import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import MyProfile from "./MyProfile";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, getDoctorsData } =
    useContext(AppContext);
  const { getToken, userId } = useAuth();
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = () => {
    setDocSlots([]);
    //getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      //getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      //setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = `${day}_${month}_${year}`;
        const slotTime = formattedTime;
        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        //Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  // Helper function to check completeness
  const isProfileComplete = () => {
    if (!user) return false;
    const meta = user.unsafeMetadata || {};
    return (
      (meta.name || user.fullName) && meta.dob && !isNaN(Date.parse(meta.dob))
    );
  };

  const bookAppointment = async () => {
    if (!userId) {
      toast.warning("Login to book appointment");
      openSignIn();
      return;
    }
    if (!isProfileComplete()) {
      setShowProfileModal(true);
      return;
    }
    if (!slotTime) {
      toast.warning("Please select a time slot");
      return;
    }

    const date = docSlots[slotIndex][0].datetime;
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = `${day}_${month}_${year}`;

    try {
      const token = await getToken();
      console.log("🧪 Token from Clerk:", token); // ADD THIS

      if (!token) {
        toast.warning("No token found from Clerk");
        return;
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  // Simple Modal implementation
  const Modal = ({ children, onClose }) => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 8,
          padding: 24,
          minWidth: 320,
          position: "relative",
        }}
      >
        <button
          style={{ position: "absolute", top: 8, right: 8 }}
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <>
      {showProfileModal && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <h2 className="text-lg font-bold mb-2">Complete Your Profile</h2>
          <p className="mb-4 text-sm text-gray-600">
            Please fill in your name and date of birth to continue booking.
          </p>
          <MyProfile onComplete={() => setShowProfileModal(false)} />
        </Modal>
      )}
      {docInfo && (
        <div>
          {/* ------- Doctor Details ------- */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <img
                className="bg-primary w-full sm:max-w-72 rounded-lg"
                src={docInfo.image}
                alt=""
              />
            </div>
            <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
              {/* ----- Doc Info : Name, Degree & Experience */}
              <p className="flex items-center gap-2 text-3xl text-gray-900 font-medium">
                {docInfo.name}
                <img
                  className="w-5"
                  src={assets.verified_icon}
                  alt="Verified Icon"
                />
              </p>
              <div className="flex items-center gap-3 mt-1 text-gray-600">
                <p>
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full">
                  {docInfo.experience}
                </button>
              </div>
              {/* ----- Doctor's About ----- */}
              <div>
                <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                  About <img src={assets.info_icon} alt="" />
                </p>
                <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                  {docInfo.about}
                </p>
              </div>
              <p className="text-gray-500 font-medium mt-4">
                Appointment fee:{" "}
                <span className="text-gray-800">
                  {currencySymbol}
                  {docInfo.fees}
                </span>
              </p>
              <div className="flex items-center gap-1 text-sm mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    docInfo.available ? "bg-green-600" : "bg-red-500"
                  }`}
                ></span>
                <span
                  className={
                    docInfo.available ? "text-green-600" : "text-red-500"
                  }
                >
                  {docInfo.available ? "Available" : "Not Available"}
                </span>
              </div>
            </div>
          </div>
          {/* ----- Booking slots ----- */}
          <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
            <p>Booking slots</p>
            <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
              {docSlots.length &&
                docSlots.map((item, index) => (
                  <div
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                      slotIndex === index
                        ? "bg-primary text-white"
                        : "border border-gray-200"
                    }`}
                  >
                    <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                    <p>{item[0] && item[0].datetime.getDate()}</p>
                  </div>
                ))}
            </div>
            <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
              {docSlots.length &&
                docSlots[slotIndex].map((item, index) => (
                  <p
                    onClick={() => setSlotTime(item.time)}
                    className={`text-sm font-light flex shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                      item.time === slotTime
                        ? "bg-primary text-white"
                        : "text-gray-400 border border-gray-300"
                    }`}
                    key={index}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer hover:bg-indigo-600 hover:shadow-md hover:-translate-y-0.5 
                 hover:scale-105
                 transition-all duration-200 ease-in-out"
            >
              Book an appointment
            </button>
          </div>
          {/* Listing Related Doctors */}
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      )}
    </>
  );
};

export default Appointment;
