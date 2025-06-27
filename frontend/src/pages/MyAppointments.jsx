import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, getDoctorsData } = useContext(AppContext);
  const { getToken } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const navigate = useNavigate();
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setAppointments(data.appointments.reverse());
      else setAppointments([]);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setAppointments([]);
    }
  };

  // Complete cancelAppointment function
  const cancelAppointment = async (appointmentId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments(); // Refresh the list
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);

        try {
          const token = await getToken();
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (data.success) {
            navigate("/my-appointments");
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getUserAppointments();
  }, []);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-lg text-zinc-700 border-b border-b-gray-400">
        My Appointments
      </p>
      <div>
        {appointments.length === 0 ? (
          <p className="text-gray-500 mt-6">No appointments found.</p>
        ) : (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-b-gray-400"
              key={index}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={item.docData?.image}
                  alt=""
                />
              </div>
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800  font-semibold text-base">
                  {item.docData?.name}
                </p>
                <p>{item.docData?.speciality}</p>
                <p className="text-zinc-700 font-medium mt-1">Address:</p>
                <p>{item.docData?.address?.line1}</p>
                <p>{item.docData?.address?.line2}</p>
                <p className="text-xs mt-1">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time:{" "}
                  </span>
                  {slotDateFormat(item.slotDate)} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 justify-end text-sm text-center">
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment !== item._id && (
                    <button
                      onClick={() => setPayment(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      Pay Online
                    </button>
                  )}
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment === item._id && (
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-20 max-h-5 cursor-pointer"
                        src={assets.stripe_logo}
                        alt=""
                      />
                    </button>
                  )}
                {!item.cancelled &&
                  !item.payment &&
                  !item.isCompleted &&
                  payment === item._id && (
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 hover:text-white transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-20 max-h-5 cursor-pointer"
                        src={assets.razorpay_logo}
                        alt=""
                      />
                    </button>
                  )}
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border rounded text-[#FFFFFF]  bg-green-400">
                    Paid
                  </button>
                )}

                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                    Completed
                  </button>
                )}

                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment cancelled
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
