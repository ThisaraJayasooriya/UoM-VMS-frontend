import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-[#D3D9D4] min-h-screen p-6">
      {/* Header section */}
      <div className="pl-4 md:pl-10">
        <h1 className="text-3xl font-bold text-teal-900 mb-2">
          Privacy Policy for the Visitor Management System (UoM)
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Welcome to the Visitor Management System (VMS) of the University of Moratuwa. This Privacy Policy outlines how we collect, use, store, and protect your personal information when you use our system. By using the VMS, you agree to the practices described in this policy.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 pl-4 md:pl-10 pr-4 md:pr-10">
        {/* Information We Collect */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-800 mb-4">
            We collect the following types of information to provide and improve our services:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li><strong>Personal Information:</strong> Name, contact details (email, phone number), identification details (e.g., NIC number), and visit purpose.</li>
            <li><strong>Visit Details:</strong> Date and time of visits, host information, Vehicle Number.</li>
            <li><strong>System Logs:</strong> Check-in and check-out timestamps, unique verification codes.</li>
          </ul>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-800 mb-4">
            Your information is used for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li><strong>Visitor Registration:</strong> To facilitate pre-registration, appointment scheduling, and check-in/check-out processes.</li>
            <li><strong>Security Verification:</strong> To verify visitor identities and ensure campus security.</li>
            <li><strong>Communication:</strong> To send SMS notifications, appointment confirmations, and real-time updates to hosts and visitors.</li>
            <li><strong>Reporting & Analytics:</strong> To generate visitor reports, track trends, and improve operational efficiency.</li>
            <li><strong>System Maintenance:</strong> To monitor system performance, troubleshoot issues, and ensure smooth operation.</li>
          </ul>
        </div>

        {/* Data Storage and Security */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">3. Data Storage and Security</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li><strong>Storage:</strong> Your data is securely stored in our database using MongoDB, with encryption for sensitive information.</li>
            <li><strong>Access Control:</strong> Only authorized personnel (e.g., admins, security staff) have access to visitor data, based on their roles and responsibilities.</li>
            <li><strong>Data Retention:</strong> Visitor data is retained only for as long as necessary to fulfill the purposes outlined in this policy or as required by law.</li>
          </ul>
        </div>

        {/* Sharing of Information */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">4. Sharing of Information</h2>
          <p className="text-gray-800 mb-4">
            We do not sell, trade, or share your personal information with third parties except in the following cases:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-800">
            <li><strong>With Hosts:</strong> Hosts will receive visitor details (name, contact information, visit purpose) to manage appointments.</li>
            <li><strong>With Security Personnel:</strong> Security teams will access visitor information (Date, Time, Host, Vehicle Number) for identity verification and access control.</li>
            <li><strong>Legal Requirements:</strong> We may disclose information if required by law or to protect the rights, property, or safety of the university and its community.</li>
          </ul>
        </div>

        {/* VMS Description */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">VMS</h2>
          <p className="text-gray-800">
            The Visitor Management System is a secure web solution that streamlines visitor registration, check-in, and check-out. It automates workflows, enhances security, and simplifies appointment management, activity tracking, and reporting for a seamless experience.
          </p>
        </div>

        {/* Connect With Us */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-teal-900 mb-4">Connect With Us</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Address</h3>
              <p className="text-gray-800">
                Bandaranayake Mawatha, Moratuwa 10400
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Telephone</h3>
              <p className="text-gray-800">
                +94 112 640 051<br />
                +94 112 650 301
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 mt-6">
          © 2025 Visitor Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;