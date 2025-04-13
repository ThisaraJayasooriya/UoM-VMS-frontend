import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const SMSSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const phoneNumber = location.state?.phoneNumber || "your phone number";

  const handleResendSMS = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      // Simulate API call to resend SMS
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResendSuccess(true);
      // You might want to add actual API call here:
      // await api.resendResetSMS(phoneNumber);
    } catch (error) {
      console.error("Failed to resend SMS:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      {/* ... (keep existing header and back button code) ... */}

      {/* SMS Sent Card */}
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
          <h1 className="text-2xl font-bold text-white">SMS Sent</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          
          <p className="text-[#2E3944]">
            We have sent you an SMS to <span className="font-semibold">{phoneNumber}</span>.
          </p>
          <p className="text-[#2E3944] mb-6">
            Check your messages and follow the instructions to reset your account password.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-[#2E3944]">
                Did not receive the SMS?
              </p>
              <button 
                onClick={handleResendSMS}
                disabled={isResending}
                className="font-medium text-[#124E66] hover:text-[#2E3944] transition disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend SMS'}
              </button>
            </div>

            {resendSuccess && (
              <p className="text-green-600 text-sm">
                SMS resent successfully!
              </p>
            )}

            <Link
              to="/login"
              className="inline-block w-full md:w-auto px-6 py-3 text-sm font-medium text-white bg-[#124E66] hover:bg-[#2E3944] rounded-lg shadow-sm transition duration-200"
            >
              Back to Login
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

export default SMSSent;