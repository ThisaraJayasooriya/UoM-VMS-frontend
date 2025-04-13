import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaFlickr,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import vlogo from "../../assets/v.png";

const Footer = () => {
  return (
    <footer className="bg-[#D3D9D4] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          {/* Left Section - Logo and Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-4">
              <div className="bg-[#124E66] p-2 rounded-md">
                <img src={vlogo} alt="VMS Logo" className="h-10 w-auto" />
              </div>
              <span className="ml-3 text-xl font-light text-[#124E66]">
                Visitor Management System
              </span>
            </div>
            <p className="text-[#2E3944] text-sm text-center md:text-left">
              The Visitor Management System is a secure web solution that
              streamlines visitor registration, check-in, and check-out. It
              automates workflows, enhances security, and simplifies appointment
              management.
            </p>
          </div>

          {/* Center Section - Social Media Links */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold text-[#124E66] mb-4 border-b border-[#748D92] pb-2 w-full text-center">
              Connect With Us
            </h3>
            <div className="flex gap-6 mt-2 text-xl">
              <a
                href="https://web.facebook.com/mrt.ac.lk?_rdc=1&_rdr#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E3944] hover:text-[#6495ED] transition-colors duration-300"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://lk.linkedin.com/school/university-of-moratuwa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E3944] hover:text-[#0000FF] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://www.youtube.com/c/UniversityofMoratuwa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E3944] hover:text-[#FF0000] transition-colors duration-300"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
              <a
                href="https://www.flickr.com/photos/university-of-moratuwa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2E3944] hover:text-[#E30B5C] transition-colors duration-300"
                aria-label="Flickr"
              >
                <FaFlickr />
              </a>
            </div>
          </div>

          {/* Right Section - Contact Info */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold text-[#124E66] mb-4 border-b border-[#748D92] pb-2 w-full text-center md:text-right">
              Contact Information
            </h3>
            <div className="text-[#2E3944] text-sm space-y-3">
              <div className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-2 text-[#124E66]" />
                <div>
                  <p className="font-medium text-[#124E66]">Address:</p>
                  <p>Bandaranayake Mawatha,</p>
                  <p>Moratuwa 10400</p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="mt-1 mr-2 text-[#124E66]" />
                <div>
                  <p className="font-medium text-[#124E66]">Telephone:</p>
                  <p>+94 112 640 051</p>
                  <p>+94 112 650 301</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#748D92] my-6"></div>

        {/* Copyright Section */}
        <div className="text-center text-[#2E3944] text-xs">
          <p>
            © 2025 Visitor Management System - University of Moratuwa. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
