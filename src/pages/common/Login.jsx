import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../assets/logouom.png";
import VLogo from "../../assets/v.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const rememberMeValue = localStorage.getItem('authRemember') === 'true';

    if (token) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            navigate('/visitor');
          } else if (!rememberMeValue) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('visitorData');
            localStorage.removeItem('authRemember');
          }
        })
        .catch(() => {
          if (!rememberMeValue) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('visitorData');
            localStorage.removeItem('authRemember');
          }
        })
        .finally(() => setCheckingAuth(false));
    } else {
      setCheckingAuth(false);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!import.meta.env.VITE_API_BASE_URL) {
        throw new Error("VITE_API_BASE_URL is not defined in the environment variables");
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/visitor/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      toast.success("🎉 Login successful! Redirecting...");

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("authRemember", rememberMe ? "true" : "false");
        if (data.visitor) {
          localStorage.setItem("visitorData", JSON.stringify(data.visitor));
        }
        console.log('Token saved with rememberMe:', rememberMe);
      }

      navigate("/visitor");
    } catch (error) {
      toast.error(`❌ ${error.message || 'Login failed. Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex items-center justify-center">
        <div className="text-white text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      <img
        src={VLogo}
        alt="V Logo"
        className="absolute top-6 right-6 w-16 h-8 object-contain"
      />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/10 transition-all duration-300 rounded-full px-4 py-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#212A31] py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="University Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Visitor Management System</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-[#2E3944]">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#748D92]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                className="block w-full pl-10 pr-3 py-3 border border-[#D3D9D2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66] transition duration-200"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-[#2E3944]">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#748D92]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="block w-full pl-10 pr-10 py-3 border border-[#D3D9D2] rounded-lg shadow-sm focus:ring-2 focus:ring-[#124E66] focus:border-[#124E66] transition duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#748D92] hover:text-[#2E3944] transition"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#124E66] focus:ring-[#124E66] border-[#D3D9D2] rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2E3944]">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="font-medium text-[#124E66] hover:text-[#2E3944] transition">
                Forgot password?
              </Link>
            </div>
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
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </div>
        </form>

        <div className="bg-[#F8F9FA] px-8 py-4 text-center border-t border-[#D3D9D2]">
          <p className="text-sm text-[#748D92]">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-[#124E66] hover:text-[#2E3944] transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} University of Moratuwa. All rights reserved.
      </p>
    </div>
  );
};

export default Login;