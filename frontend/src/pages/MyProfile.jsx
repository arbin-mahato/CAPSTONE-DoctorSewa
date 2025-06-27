import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const MyProfile = ({ onComplete }) => {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      setName(user.unsafeMetadata?.name || user.fullName || "");
      setDob(user.unsafeMetadata?.dob || "");
      setGender(user.unsafeMetadata?.gender || "");
      setPhone(user.unsafeMetadata?.phone || "");
    }
  }, [isLoaded, user]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!dob) {
      toast.error("Date of Birth is required");
      return;
    }
    if (isNaN(Date.parse(dob))) {
      toast.error("Invalid Date of Birth");
      return;
    }
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: { name, dob, gender, phone },
      });
      await user.reload();
      toast.success("Profile updated!");
      if (onComplete) onComplete();
      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
    setLoading(false);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Date of Birth</label>
        <input
          type="date"
          className="border rounded w-full p-2"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Gender</label>
        <select
          className="border rounded w-full p-2"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Phone</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <button
        className="bg-primary text-white px-4 py-2 rounded"
        onClick={handleUpdate}
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
};

export default MyProfile;
