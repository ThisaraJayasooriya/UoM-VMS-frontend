import React from "react";
import { FiUsers, FiShield, FiClock, FiCalendar } from "react-icons/fi";

import campusImage from "../../assets/campus.jpeg"; 

const About = () => {
  const stats = [
    { value: "100+", label: "Daily Visitors", icon: <FiUsers className="text-2xl" /> },
    { value: "99.9%", label: "Security Accuracy", icon: <FiShield className="text-2xl" /> },
    { value: "<1 min", label: "Check-in Time", icon: <FiClock className="text-2xl" /> },
    { value: "24/7", label: "System Availability", icon: <FiCalendar className="text-2xl" /> },
  ];

  return (
    <div className="bg-gradient-to-b from-[#D3D9D2] to-[#EBEFEA] min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[400px] w-full overflow-hidden">
        <img
          src={campusImage}
          alt="University of Moratuwa Campus"
          className="w-full h-full object-cover brightness-75 transition-all duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-opacity-40 flex flex-col justify-center items-center text-white text-center p-4">
          <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg mb-4">
            About Our Visitor Management System
          </h2>
          <p className="text-xl md:text-2xl font-light mt-2 max-w-2xl">
            Enhancing campus security and visitor experience at University of Moratuwa
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-16 z-10 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-[#124E66] flex justify-center mb-3">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#124E66]">{stat.value}</h3>
              <p className="text-[#2E3944] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 md:px-10 py-16">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-[#124E66] p-8 text-white flex items-center">
              <div>
                <h3 className="text-3xl font-bold mb-4">Why Our VMS?</h3>
                <p className="text-lg leading-relaxed">
                  Our Visitor Management System represents the cutting edge in campus security technology,
                  designed specifically for the needs of University of Moratuwa.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <p className="text-[#2E3944] text-lg leading-relaxed mb-6">
                Welcome to the Visitor Management System (VMS) developed for the University of Moratuwa.
                This innovative, web-based solution enhances campus security, streamlines visitor registration,
                and improves the visitor experience.
              </p>
              <div className="bg-[#EBEFEA] p-4 rounded-lg border-l-4 border-[#124E66]">
                <p className="text-[#2E3944] italic">
                  "Security and convenience at your fingertips - the future of campus access management."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#124E66] mb-4 flex items-center">
              <FiShield className="mr-2" /> Our Mission
            </h3>
            <p className="text-[#2E3944] leading-relaxed">
              We are committed to creating a safe and welcoming environment for students, staff, and visitors.
              VMS leverages technology to simplify visitor management, reduce administrative burdens, and enhance security.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-2xl font-semibold text-[#124E66] mb-4 flex items-center">
              <FiClock className="mr-2" /> The VMS Advantage
            </h3>
            <p className="text-[#2E3944] leading-relaxed">
              The VMS automates the entire visitor lifecycle, from pre-registration and check-in to check-out and reporting,
              ensuring a secure, efficient, and structured solution.
            </p>
          </div>
        </div>

        {/* User Types Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-[#124E66] mb-8">Who Can Use It?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Visitors",
                description: "Students, alumni, vendors, and guests",
                icon: <FiUsers className="text-3xl text-[#124E66]" />,
                color: "bg-[#EBEFEA]"
              },
              {
                title: "Hosts",
                description: "University staff and faculty",
                icon: <FiUsers className="text-3xl text-[#124E66]" />,
                color: "bg-[#D3D9D2]"
              },
              {
                title: "Security",
                description: "Verifying visitor identities",
                icon: <FiShield className="text-3xl text-[#124E66]" />,
                color: "bg-[#EBEFEA]"
              },
              {
                title: "Admins",
                description: "Managing user roles and reports",
                icon: <FiUsers className="text-3xl text-[#124E66]" />,
                color: "bg-[#D3D9D2]"
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="flex justify-center mb-4">
                  {item.icon}
                </div>
                <h4 className="text-xl font-semibold text-center text-[#124E66] mb-2">{item.title}</h4>
                <p className="text-[#2E3944] text-center">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
        <div className="text-center text-gray-600 mt-10 mb-6">
          <div className="border-t border-gray-300 pt-6">
            <p className="text-lg">
              © 2025 Visitor Management System - University of Moratuwa. All rights reserved.
            </p>
          </div>
        </div>
    </div>
  );
};

export default About;
