import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logouom.png";
import vlogo from "../../assets/v.png";

function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      {/* Desktop Navbar */}
      <nav className="absolute w-full flex justify-between items-center h-24 px-6 md:px-12 lg:px-20 text-white z-50">
        {/* Left Section - Logos */}
        <div className="flex items-center space-x-3">
          <img 
            src={logo} 
            alt="University of Moratuwa Logo" 
            className="h-14 w-auto object-contain" 
          />
          <img 
            src={vlogo} 
            alt="VMS Logo" 
            className="h-12 w-auto object-contain ml-2" 
          />
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-10">
          <Link 
            to="/" 
            className="text-[16px] font-medium hover:text-[#D3D9D4] transition duration-300 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#124E66] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/about" 
            className="text-[16px] font-medium hover:text-[#D3D9D4] transition duration-300 relative group"
          >
            About Us
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#124E66] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/contact" 
            className="text-[16px] font-medium hover:text-[#D3D9D4] transition duration-300 relative group"
          >
            Contact Us
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#124E66] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/privacy-policy" 
            className="text-[16px] font-medium hover:text-[#D3D9D4] transition duration-300 relative group"
          >
            Privacy Policy
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#124E66] group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-3xl focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-[#2E3944]/95 z-40 pt-24 px-6">
          <div className="flex flex-col space-y-5 text-white text-lg">
            <Link 
              to="/" 
              className="py-3 border-b border-[#748D92]"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="py-3 border-b border-[#748D92]"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="py-3 border-b border-[#748D92]"
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              to="/privacy-policy" 
              className="py-3 border-b border-[#748D92]"
              onClick={() => setIsOpen(false)}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeNavbar;
