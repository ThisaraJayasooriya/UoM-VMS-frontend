// AddSecurity.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSecurity = () => {
  const [security, setSecurity] = useState({
    userID: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    nicNumber: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleChange = (e) => {
    setSecurity({ ...security, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(security.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }
    setError("");
    console.log("Security submitted:", security);
    alert("Security added successfully!");
    navigate("/admin/userdetails/security");
  };

  return (
    <div className="pt-24 px-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Add New Security</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        {["userID", "name", "username", "email", "phone", "password", "nicNumber"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={`Enter ${field}`}
            value={security[field]}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
            required
          />
        ))}
        {error && (
          <div className="col-span-full text-red-600 text-sm text-center">{error}</div>
        )}
        <div className="col-span-full text-center">
          <button
            type="submit"
            className="bg-[#124E66] text-white px-8 py-3 rounded-lg hover:bg-[#0e3a4f]"
          >
            Add Security
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSecurity;
