import { UserProfile } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify";

const ClerkProfileManager = () => {
  const { user } = useUser();
  const [customFields, setCustomFields] = useState({
    dob: "",
    gender: "",
  });

  useEffect(() => {
    if (user) {
      setCustomFields({
        dob: user.unsafeMetadata?.dob || "",
        gender: user.unsafeMetadata?.gender || "",
      });
    }
  }, [user]);

  const handleCustomFieldUpdate = async (field, value) => {
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          [field]: value,
        },
      });
      toast.success(
        `${field === "dob" ? "Date of Birth" : "Gender"} updated successfully!`
      );
    } catch (error) {
      toast.error(`Error updating ${field}: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      {/* Custom fields above Clerk dashboard */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Additional Information
        </h3>
        <div className="space-y-4">
          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={customFields.dob}
              onChange={(e) => {
                setCustomFields({ ...customFields, dob: e.target.value });
                if (e.target.value) {
                  handleCustomFieldUpdate("dob", e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={customFields.gender}
              onChange={(e) => {
                setCustomFields({ ...customFields, gender: e.target.value });
                if (e.target.value) {
                  handleCustomFieldUpdate("gender", e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> Date of Birth and Gender are required for
            booking appointments. These fields help us provide better medical
            care.
          </p>
        </div>
      </div>
      {/* Clerk's built-in UserProfile component below */}
      <UserProfile
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200",
            card: "shadow-lg rounded-lg border border-gray-200",
            formFieldInput:
              "border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            formFieldLabel: "text-sm font-medium text-gray-700 mb-2",
            formFieldError: "text-red-500 text-sm mt-1",
          },
        }}
      />
    </div>
  );
};

export default ClerkProfileManager;
