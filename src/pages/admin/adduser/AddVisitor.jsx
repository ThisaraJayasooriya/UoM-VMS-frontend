import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddVisitor = () => {
  const [visitor, setVisitor] = useState({
    userID: "",
    name: "",
    nicNumber: "",
    phone: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setVisitor({ ...visitor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // You can POST visitor to backend visitor API (if you have it)
    console.log("Visitor submitted:", visitor);
    alert("Visitor added successfully!");
    navigate("/admin/userdetails/visitor");
  };

  return (
    <div className="pt-24 px-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-800">Add New Visitor</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        {["userID", "name", "nicNumber", "phone", "password"].map((field) => (
          <input
            key={field}
            name={field}
            placeholder={`Enter ${field}`}
            value={visitor[field]}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg"
            required
          />
        ))}
        <div className="col-span-full text-center">
          <button type="submit" className="bg-[#124E66] text-white px-8 py-3 rounded-lg hover:bg-[#0e3a4f]">
            Add Visitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVisitor;
