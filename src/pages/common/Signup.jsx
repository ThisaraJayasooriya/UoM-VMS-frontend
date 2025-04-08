import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    userRole: "Visitor",
    nicNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

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
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-[#124E66] to-[#748D92] relative">
      {/* Go Back Button - No Background */}
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

      {/* White Box with 'Let's get started' Text */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#748D92] mb-4 text-center text-sm">
          Let's get started
        </h1>
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Create New Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="firstName" placeholder="First Name" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="email" name="email" placeholder="Email Address" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
            <input type="text" name="phoneNumber" placeholder="Phone Number" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="password" name="password" placeholder="Password" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" name="username" placeholder="Username" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
            <input type="text" name="nicNumber" placeholder="NIC Number" className="input bg-gray-100 p-2 rounded-md" onChange={handleChange} required />
          </div>
          <button type="submit" className="w-full bg-[#212A31] text-white py-2 rounded-md hover:bg-[#212A31]">Sign Up</button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
        Already have an account? <a href="/login" className="text-[#124E66] font-bold hover:underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
