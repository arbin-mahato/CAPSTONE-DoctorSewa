import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="md:mx-10">
      {/* ------- Grid Section (Logo + Links) ------- */}
      <div className="sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm flex flex-col">
        {/* Left */}
        <div>
          <img className="w-40 h-20 w-50" src={assets.logo} alt="" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>

        {/* Center */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>Home</li>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+1-212-456-7890</li>
            <li>proarbind@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* ------- Copyright ------- */}
      <div>
        <hr className="border-t border-gray-300" />
        <p className="py-5 text-sm text-center">
          Copyright 2025@ DoctorSewa - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
