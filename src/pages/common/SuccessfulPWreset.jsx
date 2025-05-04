import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const SuccessfulPWreset = () => {
  const navigate = useNavigate();

  // Auto-redirect to /login after 3 seconds and clear any stale auth token
  useEffect(() => {
    // Clear any old tokens (optional safety measure)
    localStorage.removeItem("authToken");

    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      {/* V Logo at Top-Right */}
      <img
        src={VLogo}
        alt="V Logo"
        className="absolute top-6 right-6 w-16 h-8 object-contain"
      />

      {/* Success Card */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-[#212A31] py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="University Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Password Reset Successful</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <svg
              className="w-16 h-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-[#2E3944]">
            Your password has been successfully reset!
          </h2>
          <p className="text-sm text-[#748D92]">
            You will be redirected to the login page in a few seconds...
          </p>

          {/* Login Button */}
          <div>
            <Link
              to="/login"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#124E66] hover:bg-[#2E3944] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#124E66] transition duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} University of Moratuwa. All rights reserved.
      </p>
    </div>
  );
};

export default SuccessfulPWreset;
