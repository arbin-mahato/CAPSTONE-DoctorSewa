import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);
  // const [token, setToken] = useState(true);
  const { user } = useUser();
  const { openSignIn } = useClerk();

  return (
    <div className="flex items-center justify-between text-sm pt-1 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="DoctorSewa Logo"
        className="h-20 w-44 cursor-pointer"
      />
      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <a
          href="http://localhost:5174"
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-6 rounded-full bg-white text-black border border-gray-300 font-semibold transition-colors duration-200 hover:bg-primary hover:text-white hover:border-primary ml-2 flex items-center justify-center shadow-sm"
          style={{ minWidth: "120px", textAlign: "center" }}
        >
          Admin Panel
        </a>
      </ul>
      <div className="flex items-center gap-4">
        {!user ? (
          <button
            onClick={openSignIn}
            className="bg-primary text-white px-4 py-1 sm:px-7 sm:py-2 rounded-full font-medium cursor-pointer 
                 hover:bg-indigo-600 hover:shadow-md hover:-translate-y-0.5 
                 hover:scale-110
                 transition-all duration-200 ease-in-out"
          >
            Login
          </button>
        ) : (
          <UserButton
            afterSignOutUrl="/"
            userProfileUrl="/account"
            userProfileMode="navigation"
          />
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt=""
        />
        {/* ------ Mobile Menu ------ */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all `}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.new_logo} alt="" />
            <img
              className="w-6"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded inline-block">HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="doctors">
              <p className="px-4 py-2 rounded inline-block">ALL DOCTORS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="about">
              <p className="px-4 py-2 rounded inline-block">ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="contact">
              <p className="px-4 py-2 rounded inline-block">CONTACT</p>
            </NavLink>
            <a
              href="http://localhost:5174"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center mt-4 px-6 py-2 rounded-full bg-white text-black border border-gray-300 font-semibold transition-colors duration-200 hover:bg-primary hover:text-white hover:border-primary shadow-sm"
              style={{ minWidth: "120px", display: "inline-block" }}
            >
              Admin Panel
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
