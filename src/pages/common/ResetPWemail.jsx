import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const EmailSent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);
  const [countdown, setCountdown] = useState(30); // 30-second cooldown
  const email = location.state?.email || "email@gmail.com";

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setResendError(null);

    try {
      // Simulate API call (replace with actual API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Real implementation would be:
      // await api.resendResetEmail(email);
      
      setResendSuccess(true);
      setCountdown(30); // Reset cooldown
    } catch (error) {
      setResendError(error.message || "Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => setCountdown(c => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      {/* V Logo at Top-Right */}
      <img
        src={VLogo}
        alt="V Logo"
        className="absolute top-6 right-6 w-16 h-8 object-contain"
      />

      {/* Go Back Button */}
      <Link
        to="/forgot-password"
        className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/10 transition-all duration-300 rounded-full px-4 py-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Back</span>
      </Link>

      {/* Email Sent Card */}
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
          <h1 className="text-2xl font-bold text-white">Email Sent</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6 text-center">
          <div className="flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <p className="text-[#2E3944]">
            We have sent you an email at <span className="font-semibold">{email}</span>.
          </p>
          <p className="text-[#2E3944] mb-6">
            Check your inbox and follow the instructions to reset your account password.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm text-[#2E3944]">
                Did not receive the email?
              </p>
              <button
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0}
                className={`font-medium text-[#124E66] hover:text-[#2E3944] transition ${
                  (isResending || countdown > 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResending ? 'Sending...' : 
                 countdown > 0 ? `Resend (${countdown}s)` : 'Resend Email'}
              </button>
            </div>

            {resendSuccess && (
              <p className="text-green-600 text-sm">
                Email resent successfully!
              </p>
            )}

            {resendError && (
              <p className="text-red-600 text-sm">
                {resendError}
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

export default EmailSent;