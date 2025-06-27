import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useUser, useClerk } from "@clerk/clerk-react";

const Banner = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { openSignUp } = useClerk();

  const handleClick = () => {
    if (user) {
      navigate("/doctors");
      scrollTo(0, 0);
    } else {
      openSignUp();
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10">
      {/* ------ Left Side ------ */}
      <div className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5">
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white">
          <p>Book Appointment</p>
          <p className="mt-4">With 100+ Trusted Doctors</p>
        </div>
        <button
          onClick={handleClick}
          className="bg-white text-sm sm:text-base text-gray-600 px-8 py-3 rounded-full mt-6 hover:scale-105 cursor-pointer transition-all"
        >
          {user ? "Explore Specialists" : "Create account"}
        </button>
      </div>

      {/* ------ Right Side ------ */}
      <div className="hidden md:block md:w-1/2 lg:w-[370px] relative">
        <img
          className="w-full absolute bottom-0 right-0 max-w-md"
          src={assets.appointment_img}
          alt="Doctor appointment illustration"
        />
      </div>
    </div>
  );
};

export default Banner;
