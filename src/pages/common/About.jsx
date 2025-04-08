import React from "react";
import campusImage from "../../assets/campus.jpeg"; 
const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6 bg-white shadow-md mt-6 rounded-lg">
        <h2 className="text-3xl font-bold text-center text-teal-900 mb-6">About the Visitor Management System of University of Moratuwa</h2>
        
        {/* Image with correct path */}
        <img 
        src={campusImage} 
        alt="University of Moratuwa" 
        className="w-full object-cover rounded-lg mb-6" 
        />


        <p className="text-gray-700 mb-4">
          Welcome to the Visitor Management System (VMS) developed for the University of Moratuwa. This innovative, web-based solution enhances campus security, streamlines visitor registration, and improves the visitor experience.
        </p>
        <h3 className="text-2xl font-semibold text-teal-900 mt-6">Our Mission</h3>
        <p className="text-gray-700 mb-4">
          We are committed to creating a safe and welcoming environment for students, staff, and visitors. VMS leverages technology to simplify visitor management, reduce administrative burdens, and enhance security.
        </p>
        <h3 className="text-2xl font-semibold text-teal-900 mt-6">What is the Visitor Management System?</h3>
        <p className="text-gray-700 mb-4">
          The VMS automates the entire visitor lifecycle, from pre-registration and check-in to check-out and reporting, ensuring a secure, efficient, and structured solution.
        </p>
        <h3 className="text-2xl font-semibold text-teal-900 mt-6">Who Can Use It?</h3>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>Visitors: Students, alumni, vendors, and guests</li>
          <li>Hosts: University staff and faculty</li>
          <li>Security Personnel: Verifying visitor identities</li>
          <li>Admins: Managing user roles and reports</li>
        </ul>
        <p className="text-gray-700">
          
        </p>
      </main>

      {/* Footer */}
      <footer className="bg-teal-900 text-white text-center py-4 mt-10">
        <p>&copy; 2025 Visitor Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default About;
