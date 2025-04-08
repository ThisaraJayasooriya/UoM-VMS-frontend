import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";



function HostProfile() {
    const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Wick",
    employeeId: "H0001",
    designation: "Host",
    nicNumber: "9574823V",
    email: "john@email.com",
    phone: "0113567854",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="w-100% h-full mt-20 mr-50 ml-50 rounded-lg lg:px-20 bg-blue3">
      <div className='flex  items-center gap-10'>
        <div className='pt-10'>
            <FaUserCircle className="text-9xl text-gray-800" />
        </div>
        <div className='pt-10'>
            <p className='text-3xl font-semibold'>{formData.name}</p>
            <p className='text-2xl'>{formData.designation}</p>
            <p className='text-2xl'>ID : {formData.employeeId}</p>
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: "Name", name: "name" },
          { label: "Employee ID", name: "employeeId" },
          { label: "Designation", name: "designation" },
          { label: "NIC Number", name: "nicNumber" },
          { label: "Email Address", name: "email" },
          { label: "Phone Number", name: "phone" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-sm text-gray-700">{item.label}</span>
            {isEditing ? (
              <input
                type="text"
                name={item.name}
                value={formData[item.name]}
                onChange={handleChange}
                className="bg-white text-black px-3 py-2 rounded-md border border-gray-400"
              />
            ) : (
              <div className="bg-blue-900 text-white px-3 py-2 rounded-md">{formData[item.name]}</div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        <button
          className="bg-gray-400 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-500"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
        <button className="bg-gray-400 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-500">Log Out</button>
      </div>
      <p className="text-right text-sm text-gray-600 mt-4">Last Login: 13.25pm</p>
    </div>
  )
}

export default HostProfile
