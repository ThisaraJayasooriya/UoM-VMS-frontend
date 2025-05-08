import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddHost = () => {
  const [host, setHost] = useState({
    userID: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    nicNumber: "",
    faculty: "",
    department: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setHost({ ...host, [e.target.name]: e.target.value });
    setError("");
  };

  const validatePassword = (password) => {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(host.password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    console.log("Host submitted:", host);
    alert("Host added successfully!");
    navigate("/admin/userdetails/host");
  };

  return (
    <div className="pt-24 px-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Add New Host</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        {[
          "userID",
          "name",
          "username",
          "email",
          "phone",
          "password",
          "nicNumber",
          "faculty",
          "department",
        ].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={`Enter ${field}`}
            type={field === "password" ? "password" : "text"}
            value={host[field]}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
            required
          />
        ))}

        {error && (
          <div className="col-span-full text-red-600 font-medium text-sm">
            {error}
          </div>
        )}

        <div className="col-span-full text-center">
          <button
            type="submit"
            className="bg-[#124E66] text-white px-8 py-3 rounded-lg hover:bg-[#0e3a4f]"
          >
            Add Host
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHost;
