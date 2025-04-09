import React, { useState } from "react";

const StaffRegistration = ({ addUser }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (name && email && password && phone && selectedRole) {
      addUser(selectedRole.toLowerCase(), {
        name,
        email,
        phone,
        password,
        userID: `#${selectedRole[0].toLowerCase()}${Math.floor(Math.random() * 1000)}`,
        registeredDate: new Date().toLocaleString(),
      });

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSelectedRole("");
      alert(`${selectedRole} added successfully!`);
    } else {
      alert("Please fill all fields and select a role.");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20 relative z-10">
      <div className="flex flex-col items-center bg-blue3 mt-12 w-full h-full p-8 rounded-lg">
        <h1 className="text-2xl font-bold mt-5 mb-8">Add New User</h1>

        <div className="w-full max-w-3xl bg-white shadow-xl p-10 rounded-xl border border-gray-200">
          {/* Role Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Select Role</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b3242]"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="" disabled>Select Role</option>
              <option value="Host">Host</option>
              <option value="Security">Security</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b3242]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b3242]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
              <input
                type="tel"
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b3242]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1b3242]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="bg-[#1b3242] hover:bg-[#10222e] text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200"
            >
              Register User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;
