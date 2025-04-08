import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logouom.png"; // University logo
import VLogo from "../../assets/v.png"; // V Logo for top-right corner

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Logging in with:", { username, password });
    navigate("/roles"); // Redirect to home page on successful login
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#124E66] to-[#748D92] relative">
      {/* Go Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-white flex items-center gap-1 hover:underline"
      >
        <span className="text-lg">←</span> Go Back
      </button>

      {/* V Logo at Top-Right */}
      <img
        src={VLogo}
        alt="V Logo"
        className="absolute top-4 right-4 w-20 h-10"
      />

      <div className="bg-gray-200 p-10 rounded-lg shadow-lg w-96">
        {/* University Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="University Logo"
            className="w-28 h-28 opacity-150 brightness-100 contrast-190"
          />
        </div>

        {/* Username Input */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
          <input
            type="text"
            placeholder="USERNAME"
            className="w-full text-center py-2 pl-12 pr-12 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🔒</span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="PASSWORD"
            className="w-full text-center py-2 pl-10 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center text-black font-medium">
            <input type="checkbox" className="mr-2" /> Remember Me
          </label>
          <a href="/forgot-password" className="text-black font-medium hover:underline">Forgot Password?</a>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gray-800 text-white py-2 rounded-md shadow-md hover:bg-gray-900"
        >
          LOGIN
        </button>

        {/* Sign Up Link */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-[#124E66] font-bold hover:underline">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
