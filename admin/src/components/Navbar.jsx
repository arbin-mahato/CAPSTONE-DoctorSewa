import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 py-3 border-b bg-white w-full">
      <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-between">
        <img
          onClick={() => navigate("/")}
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full mt-2 sm:mt-0 w-full sm:w-auto cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
