import React, { useState, useEffect } from "react"; // make sure to import your API
import { useNavigate } from "react-router-dom";
import {makeAppointment, getAllHosts } from '../../services/appoinment.api.js'; // Adjust the import path as necessary

function VisitorAppointment() {
   const [hosts, setHosts] = useState([]);
  const [hostId, sethostId] = useState("");

  useEffect(() => {
    const loadHosts = async () => {
      try {
        const data = await getAllHosts();
        setHosts(data);
      } catch (error) {
        console.error("Failed to load hosts:", error);
      }
    };
    loadHosts();
  }, []);
   const [visitorId, setvisitorId] = useState(""); // 🔹 new state for username
  
     // 🔹 Load userName from localStorage on mount
    useEffect(() => {
      const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
      if (storedUser && storedUser.id) {
        setvisitorId(storedUser.id);
      }
    }, []);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [vehicleRequired, setVehicleRequired] = useState(false);
  const [vehicle, setVehicle] = useState("");
  const [category, setCategory] = useState("");
  const [reason, setReason] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    const appointmentData = {
      visitorId,
      firstname,
      lastname,
      contact,
      hostId,
      vehicle,
      category,
      reason,
    };

    try {
      const result = await makeAppointment(appointmentData);
      console.log("Appointment submitted:", result);
      alert("Appointment submitted successfully!");
      // Optional: reset form here
    } catch (err) {
      console.error("Error submitting appointment:", err);
      alert("Failed to submit appointment.");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="bg-blue p-6 rounded-xl shadow-md mt-8 mx-60">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* First & Last Name */}
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="p-3 rounded-lg bg-gray-200 outline-none flex-1"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="p-3 rounded-lg bg-gray-200 outline-none flex-1"
            />
          </div>

          {/* Contact */}
          <input
            type="text"
            placeholder="Contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="p-3 rounded-lg bg-gray-200 outline-none w-full"
          />

          {/* Host */}
          <select
            onChange={(e) => sethostId(e.target.value)}
             value={hostId}
            className="text-gray-500 p-3 rounded-lg bg-gray-200 outline-none w-full"
          >
            <option value="">Select a Host</option>
      {hosts.map((host) => (
        <option key={host._id} value={host._id}>
          {host.name}
        </option>
      ))}
          </select>

          {/* Vehicle Entry */}
          <div className="mt-4 text-gray-500">
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
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="mt-2 p-3 rounded-lg bg-gray-200 outline-none w-full"
              />
            )}
          </div>

          {/* Category */}
          <select
            name="appointmentCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-4 p-3 rounded-lg bg-gray-200 outline-none w-full"
          >
            <option value="">Select Appointment Category</option>
            <option value="Official">Official</option>
            <option value="Private">Private</option>
          </select>

          {/* Reason */}
          <textarea
            name="reason"
            placeholder="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="p-3 rounded-lg bg-gray-200 outline-none h-24 w-full"
          />

          {/* Submit Button */}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-blue text-white py-2 px-6 rounded-lg hover:bg-darkblue"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisitorAppointment;
