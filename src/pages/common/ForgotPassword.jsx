import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const ForgotPassword = () => {
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is not defined in the environment variables");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/visitor/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        // Navigate based on input type (email or phone number)
        const isEmail = contact.includes("@");
        if (isEmail) {
          navigate("/email-sent", { state: { email: contact } });
        } else {
          navigate("/sms-sent", { state: { phoneNumber: contact } });
        }
      } else {
        throw new Error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      {/* V Logo at Top-Right */}
      <img
        src={VLogo}
        alt="V Logo"
        className="absolute top-6 right-6 w-16 h-8 object-contain"
      />

      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/10 transition-all duration-300 rounded-full px-4 py-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      {/* Password Reset Card */}
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
          <h1 className="text-2xl font-bold text-white">Forgot Your Password?</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <p className="text-[#2E3944] text-center">
            Enter your registered email below to receive password reset instructions.
          </p>

          {/* Contact Field */}
          <div className="space-y-2">
            <label htmlFor="contact" className="block text-sm font-medium text-[#2E3944]">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#748D92]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="contact"
                type="text"
                placeholder="Enter your email"
                className="block w-full pl-10 pr-3 py-3 border border-[#D3D9D2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66] transition duration-200"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#124E66] hover:bg-[#2E3944] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#124E66] transition duration-200 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : (
                'Request Reset Link'
              )}
            </button>
          </div>

          {/* Back to Login Link */}
          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-sm font-medium text-[#124E66] hover:text-[#2E3944] transition"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} University of Moratuwa. All rights reserved.
      </p>
    </div>
  );
};

export default ForgotPassword;