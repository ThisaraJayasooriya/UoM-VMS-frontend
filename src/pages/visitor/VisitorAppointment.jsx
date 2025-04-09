import React, { useState } from "react";

function VisitorAppointment() {
  const [host, setHost] = useState(""); 
  const [vehicleRequired, setVehicleRequired] = useState(false); // State for vehicle entry
  const [vehicleNumber, setVehicleNumber] = useState(""); // State for vehicle number
  const [appointmentCategory, setAppointmentCategory] = useState(""); // State for appointment category
  const [reason, setReason] = useState(""); // State for reason

  const handleHostChange = (e) => {
    setHost(e.target.value);
  };

  const handleVehicleNumberChange = (e) => {
    setVehicleNumber(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setAppointmentCategory(e.target.value);
  };

  const handleReasonChange = (e) => {
    setReason(e.target.value);
  };
  const handleGoBack = () => {
    navigate("/visitor"); // Navigate to the visitor dashboard
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="bg-blue p-6 rounded-xl shadow-md mt-8 mx-60">
        <form className="flex flex-col gap-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="p-3 rounded-lg bg-gray-200 outline-none flex-1"
            />
            <input
              type="text"
              placeholder="Last Name"
              className="p-3 rounded-lg bg-gray-200 outline-none flex-1"
            />
          </div>
          <input
            type="text"
            placeholder="Contact"
            className="p-3 rounded-lg bg-gray-200 outline-none w-full"
          />

          {/* Host Selection Dropdown */}
          <select 
            value={host}
            onChange={handleHostChange}
            className="text-gray-500 p-3 rounded-lg bg-gray-200 outline-none w-full"
          >
            <option value="">Host</option>
            <option value="Host 1">Host 1</option>
            <option value="Host 2">Host 2</option>
            <option value="Host 3">Host 3</option>
          </select>
          
          <div className="mt-4  text-gray-500">
            <p className="mb-2">Vehicle Entry Required?</p>
            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={vehicleRequired}
                  onChange={() => setVehicleRequired(true)}
                  className="mr-2"
                />
                Yes
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!vehicleRequired}
                  onChange={() => setVehicleRequired(false)}
                  className="mr-2"
                />
                No
              </label>
            </div>
            {vehicleRequired && (
              <input
                type="text"
                name="vehicleNumber"
                placeholder="Add Vehicle Number"
                value={vehicleNumber}
                onChange={handleVehicleNumberChange}
                className="mt-2 p-3 rounded-lg bg-gray-200 outline-none w-full"
              />
            )}
          </div>

          <div className="text-gray-500">
          {/* Appointment Category Dropdown */}
          <select
            name="appointmentCategory"
            value={appointmentCategory}
            onChange={handleCategoryChange}
            className="mt-4 p-3 rounded-lg bg-gray-200 outline-none w-full"
          >
            <option value="" className=" bg-gray-200 ">Select Appointment Category</option>
            <option value="category1">Official</option>
            <option value="category2">Private</option>
          </select>
          </div>

          {/* Reason Input */}
          <textarea
            name="reason"
            placeholder="Reason"
            value={reason}
            onChange={handleReasonChange}
            className="p-3 rounded-lg bg-gray-200 outline-none h-24 w-full"
          />
        </form>
      </div>

      <div>
        <div className="mt-4 flex justify-end">
          <button className="bg-blue text-white py-2 px-6 rounded-lg hover:bg-darkblue mr-30">
           Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default VisitorAppointment;