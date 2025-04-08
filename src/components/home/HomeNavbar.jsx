import React from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import logo from "../../assets/logouom.png";
import vlogo from "../../assets/v.png";

function HomeNavbar() {
  return (
    <div className="relative w-full">
      {/* Navbar */}
      <nav className="absolute w-full flex justify-between items-center h-20 px-6 md:px-16 text-white z-20">
        {/* Left Section - Company Logo & V Logo */}
        <div className="flex items-start -ml-6 mt-18">
          <img src={logo} alt="Company Logo" className="w-28 md:w-32" />
          <img src={vlogo} alt="V Logo" className="w-16 md:w-20 mt-10" />
        </div>

        {/* Center Section - Navigation Links */}
        <div className="flex gap-10 text-sm md:text-base uppercase mt-8">
          <Link to="/" className="cursor-pointer hover:text-gray-300 transition duration-300">
            Home
          </Link>
          <Link to="/about" className="cursor-pointer hover:text-gray-300 transition duration-300">
            About Us
          </Link>
          <Link to="/contact" className="cursor-pointer hover:text-gray-300 transition duration-300">
            Contact Us
          </Link>
          <Link to="/privacy-policy" className="cursor-pointer hover:text-gray-300 transition duration-300">
            Privacy Policy
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default HomeNavbar;