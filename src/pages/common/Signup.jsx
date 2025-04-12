import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    username: "",
    nicNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
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

      {/* Sign Up Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#212A31] py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="University Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Visitor Management System</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstName" placeholder="First Name" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="email" name="email" placeholder="Email Address" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
            <input type="text" name="phoneNumber" placeholder="Phone Number" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="password" name="password" placeholder="Password" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="username" placeholder="Username" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
            <input type="text" name="nicNumber" placeholder="NIC Number" className="bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" onChange={handleChange} required />
          </div>

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
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-[#F8F9FA] px-8 py-4 text-center border-t border-[#D3D9D2]">
          <p className="text-sm text-[#748D92]">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-[#124E66] hover:text-[#2E3944] transition">
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <p className="mt-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} University of Moratuwa. All rights reserved.
      </p>
    </div>
  );
};

export default Signup;
