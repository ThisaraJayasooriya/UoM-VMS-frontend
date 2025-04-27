import React, { useState } from "react";
import { FiUser, FiMail, FiPhone, FiLock, FiChevronDown, FiCreditCard } from "react-icons/fi";
import { MdWorkOutline, MdSchool } from "react-icons/md";

const StaffRegistration = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [userID, setUserID] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [nicNumber, setNicNumber] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isHost = selectedRole === "Host";

    if (
      name &&
      email &&
      password &&
      phone &&
      selectedRole &&
      userID &&
      nicNumber &&
      (!isHost || (faculty && department))
    ) {
      const newUser = {
        name,
        email,
        phone,
        password,
        role: selectedRole.toLowerCase(),
        userID,
        nicNumber,
        registeredDate: new Date().toLocaleString(),
        ...(isHost && { faculty, department }),
      };

      try {
        const res = await fetch("http://localhost:5000/api/staff/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });

        if (res.ok) {
          alert(`${selectedRole} added successfully!`);
          setName("");
          setEmail("");
          setPhone("");
          setPassword("");
          setSelectedRole("");
          setUserID("");
          setFaculty("");
          setDepartment("");
          setNicNumber("");
        } else {
          alert("Registration failed");
        }
      } catch (err) {
        alert("Server error");
      }
    } else {
      alert("Please fill all required fields.");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#212A31] to-[#124E66] p-8 text-white text-center">
          <h2 className="text-3xl font-bold">Register New Staff Members</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Dropdown */}
          <div className="relative col-span-full">
            <label className="block text-gray-700 font-medium mb-2">Select Role</label>
            <select
              className="w-full p-4 appearance-none border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#124E66] bg-white"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="Host">Host</option>
              <option value="Security">Security</option>
              <option value="Admin">Admin</option>
            </select>
            <FiChevronDown className="absolute right-5 top-[70%] transform -translate-y-1/2 text-gray-500" />
          </div>

          {/* Input Fields */}
          <InputField label="User ID" value={userID} onChange={setUserID} icon={<FiUser />} />
          <InputField label="Full Name" value={name} onChange={setName} icon={<FiUser />} />
          <InputField label="Email" value={email} onChange={setEmail} icon={<FiMail />} type="email" />
          <InputField label="Phone Number" value={phone} onChange={setPhone} icon={<FiPhone />} type="tel" />
          <InputField label="NIC / Passport No" value={nicNumber} onChange={setNicNumber} icon={<FiCreditCard />} />

          {/* Only for Host */}
          {selectedRole === "Host" && (
            <>
              <InputField label="Faculty" value={faculty} onChange={setFaculty} icon={<MdSchool />} />
              <InputField label="Department" value={department} onChange={setDepartment} icon={<MdWorkOutline />} />
            </>
          )}

          <InputField label="Password" value={password} onChange={setPassword} icon={<FiLock />} type="password" fullWidth />

          {/* Submit */}
          <div className="col-span-full text-center mt-4">
            <button
              type="submit"
              className="bg-[#1b3242] hover:bg-[#10222e] text-white font-semibold px-12 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Register Staff Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, icon, type = "text", fullWidth = false }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <label className="block text-gray-700 font-medium mb-2">{label}</label>
    <div className="relative">
      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label}`}
        className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1b3242] focus:outline-none"
        required
      />
    </div>
  </div>
);

export default StaffRegistration;
