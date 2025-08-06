import React from "react";
import { FaShieldAlt, FaDatabase, FaUserCheck, FaEnvelope, FaChartLine, FaUniversity, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#D3D9D4] min-h-screen p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#124E66] to-[#2E3944] text-white rounded-xl p-8 md:p-12 mb-10 shadow-lg">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl md:text-2xl font-light opacity-90">
          Visitor Management System - University of Moratuwa
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Introduction Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 border-l-8 border-[#124E66]">
          <p className="text-lg text-gray-800 leading-relaxed">
            Welcome to the Visitor Management System (VMS) of the University of Moratuwa. 
            This Privacy Policy outlines how we collect, use, store, and protect your personal 
            information when you use our system. By using the VMS, you agree to the practices 
            described in this policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Information We Collect */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#124E66] p-4 flex items-center">
              <FaDatabase className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4">
                We collect the following types of information to provide and improve our services:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Personal Information:</strong> Name, contact details (email, phone number), identification details (e.g., NIC number), and visit purpose.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Visit Details:</strong> Date and time of visits, host information, Vehicle Number.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>System Logs:</strong> Check-in and check-out timestamps, unique verification codes.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#2E3944] p-4 flex items-center">
              <FaChartLine className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-white">2. How We Use Your Information</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4">
                Your information is used for the following purposes:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Visitor Registration:</strong> To facilitate pre-registration, appointment scheduling, and check-in/check-out processes.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Security Verification:</strong> To verify visitor identities and ensure campus security.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Communication:</strong> To send email notifications, appointment confirmations, and real-time updates to visitors.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Reporting & Analytics:</strong> To generate visitor reports, track trends, and improve operational efficiency.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>System Maintenance:</strong> To monitor system performance, troubleshoot issues, and ensure smooth operation.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#124E66] p-4 flex items-center">
              <FaShieldAlt className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-white">3. Data Storage and Security</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Storage:</strong> Your data is securely stored in our database using MongoDB, with encryption for sensitive information.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Access Control:</strong> Only authorized personnel (e.g., admins, security staff) have access to visitor data, based on their roles and responsibilities.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Data Retention:</strong> Visitor data is retained within the system until it is manually deleted or managed in accordance with administrative procedures or applicable legal requirements.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sharing of Information */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="bg-[#2E3944] p-4 flex items-center">
              <FaUserCheck className="text-white text-2xl mr-3" />
              <h2 className="text-2xl font-semibold text-white">4. Sharing of Information</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-800 mb-4">
                We do not sell, trade, or share your personal information with third parties except in the following cases:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>With Hosts:</strong> Hosts will receive visitor details (name, contact information, visit purpose) to manage appointments.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>With Security Personnel:</strong> Security teams will access visitor information (Date, Time, Host, Vehicle Number) for identity verification and access control.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-[#748D92] text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 flex-shrink-0">•</span>
                  <span className="text-gray-800"><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect the rights, property, or safety of the university and its community.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* VMS Description */}
        <div className="bg-gradient-to-r from-[#124E66] to-[#2E3944] rounded-xl p-8 mb-10 shadow-lg text-white">
          <div className="flex items-center mb-4">
            <FaUniversity className="text-3xl mr-4" />
            <h2 className="text-2xl font-semibold">About Our Visitor Management System</h2>
          </div>
          <p className="text-lg leading-relaxed">
            The Visitor Management System is a secure web solution that streamlines visitor registration, check-in, and check-out. It automates workflows, enhances security, and simplifies appointment management, activity tracking, and reporting for a seamless experience.
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#124E66] mb-6 flex items-center">
              <FaMapMarkerAlt className="mr-3" />
              Address
            </h2>
            <p className="text-gray-800 text-lg">
              Bandaranayake Mawatha,<br />
              Moratuwa 10400,<br />
              Sri Lanka
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#124E66] mb-6 flex items-center">
              <FaPhone className="mr-3" />
              Telephone
            </h2>
            <p className="text-gray-800 text-lg">
              +94 112 640 051<br />
              +94 112 650 301
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-10 mb-6">
          <div className="border-t border-gray-300 pt-6">
            <p className="text-lg">
              © 2025 Visitor Management System - University of Moratuwa. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;