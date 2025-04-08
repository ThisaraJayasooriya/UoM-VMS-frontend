import React from "react";
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaFlickr } from "react-icons/fa";
import vlogo from "../../assets/v.png";

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start px-6 gap-8">
        {/* Left Section - Logo and Description */}
        <div className="max-w-sm text-center md:text-left md:-ml-18">
          <img
            src={vlogo}
            alt="VMS Logo"
            className="h-12 w-auto filter invert opacity-100 mx-auto md:mx-0"
          />
          <p className="text-gray-600 mt-2 text-sm">
            The Visitor Management System is a secure web solution that
            streamlines visitor registration, check-in, and check-out.
            <br />
            It automates workflows, enhances security, and simplifies appointment
            management.
          </p>
        </div>

        {/* Center Section - Social Media Links */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-800">Connect With Us</h3>
          <div className="flex justify-center md:justify-start gap-4 mt-4 text-gray-700 text-xl">
            <a
              href="https://web.facebook.com/mrt.ac.lk?_rdc=1&_rdr#"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="cursor-pointer hover:text-blue-600" />
            </a>
            <a
              href="https://lk.linkedin.com/school/university-of-moratuwa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="cursor-pointer hover:text-blue-600" />
            </a>
            <a
              href="https://www.youtube.com/c/UniversityofMoratuwa"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="cursor-pointer hover:text-red-600" />
            </a>
            <a
              href="https://www.flickr.com/photos/university-of-moratuwa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFlickr className="cursor-pointer hover:text-pink-600" />
            </a>
          </div>
        </div>

        {/* Right Section - Address */}
        <div className="text-center md:text-right md:-mr-18"> {/* Adjusted margin here */}
          <p className="text-gray-500 text-xs">
            Address:
            <br />
            Bandaranayake Mawatha, Moratuwa 10400
            <br /><br /><br />
            Telephone:<br />
            +94 112 640 051<br />
            +94 112 650 301
          </p>
        </div>
      </div>

      {/* Footer Bottom - Copyright */}
      <p className="text-gray-500 text-xs text-center mt-6">
        © 2025 Visitor Management System. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
