import { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    nationality: "",
    nicNumber: "",
    passportNumber: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    nationality: "",
    nicNumber: "",
    passportNumber: ""
  });

  const validateNIC = (nic) => {
    const cleanedNIC = nic.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const oldFormat = /^[0-9]{9}[VX]$/;
    const newFormat = /^[0-9]{12}$/;
    
    if (!cleanedNIC) return "NIC is required";
    if (oldFormat.test(cleanedNIC)) return "";
    if (newFormat.test(cleanedNIC)) return "";
    return "Please enter a valid NIC (ex: 123456789V or 200012345678)";
  };

  const validatePassport = (passport) => {
    if (!passport.trim()) return "Passport number is required";
    if (!/^[A-Za-z0-9]{5,20}$/.test(passport)) {
      return "Passport must be 5-20 alphanumeric characters";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (name === "nicNumber" && formData.nationality === "Sri Lankan") {
      const nicError = validateNIC(value);
      setErrors(prev => ({ ...prev, nicNumber: nicError || "" }));
    }
    
    if (name === "passportNumber" && formData.nationality === "Foreigner") {
      const passportError = validatePassport(value);
      setErrors(prev => ({ ...prev, passportNumber: passportError || "" }));
    }

    if (name === "nationality") {
      if (!value) {
        setErrors(prev => ({ ...prev, nationality: "Please select your nationality" }));
      } else {
        setErrors(prev => ({ ...prev, nationality: "" }));
        setFormData(prev => ({
          ...prev,
          nicNumber: value === "Sri Lankan" ? prev.nicNumber : "",
          passportNumber: value === "Foreigner" ? prev.passportNumber : ""
        }));
      }
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      nationality: "",
      nicNumber: "",
      passportNumber: ""
    };

    if (!validator.isEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    const phoneRegex = /^(?:\+94|94|0)?(7[0-9]{8})$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid Sri Lankan phone number (e.g., 0712345678)";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match!";
      isValid = false;
    }

    if (!formData.nationality) {
      newErrors.nationality = "Please select your nationality";
      isValid = false;
    }

    if (formData.nationality === "Sri Lankan") {
      const nicError = validateNIC(formData.nicNumber);
      if (nicError) {
        newErrors.nicNumber = nicError;
        isValid = false;
      }
    } else if (formData.nationality === "Foreigner") {
      const passportError = validatePassport(formData.passportNumber);
      if (passportError) {
        newErrors.passportNumber = passportError;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({ ...errors, form: "" });

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Please try again.");
      }

      // On successful signup
      toast.success("🎉 Signup successful! Redirecting to login...", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // Store token if available
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to login after delay
      setTimeout(() => navigate("/login"), 2000);

    } catch (error) {
      console.error("Signup error:", error);
      toast.error(`❌ ${error.message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#124E66] to-[#2E3944] flex flex-col items-center justify-center relative p-4">
      <img src={VLogo} alt="V Logo" className="absolute top-6 right-6 w-16 h-8 object-contain" />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-white flex items-center gap-2 hover:bg-white/10 transition-all duration-300 rounded-full px-4 py-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">Back</span>
      </button>

      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#212A31] py-6 px-8 text-center">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="University Logo" className="w-20 h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">Visitor Management System</h1>
          <p className="text-[#D3D9D2] mt-2">University of Moratuwa</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                name="firstName" 
                placeholder="First Name" 
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" 
                onChange={handleChange} 
                required 
                value={formData.firstName}
              />
            </div>
            <div>
              <input 
                type="text" 
                name="lastName" 
                placeholder="Last Name" 
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" 
                onChange={handleChange} 
                required 
                value={formData.lastName}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`} 
                onChange={handleChange} 
                required 
                value={formData.email}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input 
                type="text" 
                name="phoneNumber" 
                placeholder="Phone Number (0712345678)" 
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.phoneNumber ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`} 
                onChange={handleChange} 
                required 
                value={formData.phoneNumber}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none pr-12`}
                onChange={handleChange}
                required
                value={formData.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-[#748D92] hover:text-[#2E3944] transition"
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
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none pr-12`}
                onChange={handleChange}
                required
                value={formData.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-[#748D92] hover:text-[#2E3944] transition"
              >
                {showConfirmPassword ? (
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
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input 
                type="text" 
                name="username" 
                placeholder="Username" 
                className="w-full bg-gray-100 px-4 py-3 rounded-md border border-[#D3D9D2] focus:ring-2 focus:ring-[#124E66] focus:outline-none" 
                onChange={handleChange} 
                required 
                value={formData.username}
              />
            </div>
            <div>
              <select
                name="nationality"
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.nationality ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`}
                onChange={handleChange}
                required
                value={formData.nationality}
              >
                <option value="">Select Nationality</option>
                <option value="Sri Lankan">Sri Lankan</option>
                <option value="Foreigner">Foreigner</option>
              </select>
              {errors.nationality && <p className="text-red-500 text-xs mt-1">{errors.nationality}</p>}
            </div>
          </div>

          {formData.nationality === "Sri Lankan" && (
            <div>
              <input
                type="text"
                name="nicNumber"
                placeholder="NIC Number (123456789V or 200012345678)"
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.nicNumber ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`}
                onChange={handleChange}
                value={formData.nicNumber}
                required={formData.nationality === "Sri Lankan"}
              />
              {errors.nicNumber && <p className="text-red-500 text-xs mt-1">{errors.nicNumber}</p>}
            </div>
          )}

          {formData.nationality === "Foreigner" && (
            <div>
              <input
                type="text"
                name="passportNumber"
                placeholder="Passport Number"
                className={`w-full bg-gray-100 px-4 py-3 rounded-md border ${errors.passportNumber ? 'border-red-500' : 'border-[#D3D9D2]'} focus:ring-2 focus:ring-[#124E66] focus:outline-none`}
                onChange={handleChange}
                value={formData.passportNumber}
                required={formData.nationality === "Foreigner"}
              />
              {errors.passportNumber && <p className="text-red-500 text-xs mt-1">{errors.passportNumber}</p>}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#124E66] hover:bg-[#1F5F7B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#124E66] transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </div>
        </form>

        <div className="bg-[#F8F9FA] px-8 py-4 text-center border-t border-[#D3D9D2]">
          <p className="text-sm text-[#748D92]">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-[#124E66] hover:text-[#2E3944] transition">
              Log in
            </a>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-white/80">
        © {new Date().getFullYear()} University of Moratuwa. All rights reserved.
      </p>
    </div>
  );
};

export default Signup;