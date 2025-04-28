import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { LuContact } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";

import React from "react";

export default function Appointments() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to store the selected appointment details

  const appointments = [
    {
      id: "A0001",
      date: "3 Mar 2025",
      time: "9:00am - 9:30am",
      phone: "0113567854",
      email: "john@gmail.com",
      visitorName: "John Wick",
      title: "Team Meeting",
    },
    {
      id: "A0002",
      date: "4 Mar 2025",
      time: "9:00am - 9:30am",
      phone: "0113567854",
      email: "john@gmail.com",
      visitorName: "John Wick",
      title: "Team Meeting",
    },
    {
      id: "A0003",
      date: "5 Mar 2025",
      time: "9:00am - 9:30am",
      phone: "0113567854",
      email: "john@gmail.com",
      visitorName: "John Wick",
      title: "Team Meeting",
    },
    {
      id: "A0004",
      date: "6 Mar 2025",
      time: "9:00am - 9:30am",
      phone: "0113567854",
      email: "john@gmail.com",
      visitorName: "John Wick",
      title: "Team Meeting",
    },
  ];

  const handleButtonClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected meeting details
    setIsPopupOpen(true); // Open the popup
  };

  const handleClose = (id) => {
    console.log("Canceled Appointment:", id);
    setIsPopupOpen(false); // Close the popup
  }
  if (!open) return null;

  return (
    <div className="relative">
    <div  className={`pt-20 px-4 lg:px-20 transition-all duration-300 ${
        isPopupOpen ? "blur-sm pointer-events-none" : ""
      }`}>
      <div className="bg-gray-100 p-6 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-6 py-4 font-bold text-lg">Appointment ID</th>
                <th className="px-6 py-4 font-bold text-lg">Date</th>
                <th className="px-6 py-4 font-bold text-lg">Time</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold">{appointment.id}</td>
                  <td className="px-6 py-4">{appointment.date}</td>
                  <td className="px-6 py-4">{appointment.time}</td>
                  <td className="px-6 py-4">
                    <button className="bg-blue2 hover:bg-customgray text-white px-3 py-1 rounded-xl shadow-xl cursor-pointer font-semibold" 
                    onClick={() => handleButtonClick(appointment)} // Pass the entire appointment object
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>

      {isPopupOpen && selectedAppointment && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>
      
                <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1 ">
                  <button
                    onClick={() => setIsPopupOpen(false)}
                    className="absolute top-2 right-2 text-white px-4 py-2   rounded hover:bg-gray-300 transition duration-300 cursor-pointer"
                  >
                    <FaTimes className="text-black text" />
                  </button>
                  <h3 className="text-2xl font-bold mb-4 flex justify-center m-1">
                    Appointment Overview
                  </h3>
                  <div className="flex flex-col gap-5 ">
                    <div className=" gap-4 ml-12 items-center">
                        <p className="text-2xl">({selectedAppointment.id})</p>
                        <p>{selectedAppointment.date}, {selectedAppointment.time}</p>
                    </div>
                    <div className="flex gap-4 ml-12 items-center">
                      <div>
                        <CgMenuLeftAlt className="text-2xl" />
                      </div>
                      <div>
                        <p>
                          <strong>Booked by</strong>
                        </p>
                        <p>{selectedAppointment.visitorName}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 ml-12 items-center">
                      <div>
                        <LuContact className="text-2xl" />
                      </div>
                      <div>
                        <p>
                          <strong>Contact Info</strong>
                        </p>
                        <p>{selectedAppointment.email}</p>
                        <p>{selectedAppointment.phone}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 ml-12 items-center">
                      <div>
                        <FaPenToSquare className="text-2xl" />
                      </div>
                      <div>
                        <p>
                          <strong>Purpose</strong>
                        </p>
                        <p>{selectedAppointment.title}</p>
                      </div>
                    </div>
                    
                    
                   
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => handleClose(selectedAppointment.id)} // Pass the appointment ID to the handleClose function
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer"
              >
                Cancel Appointment
              </button>
              <button
                className="px-3 py-2 bg-blue text-white rounded-md hover:bg-darkblue font-semibold cursor-pointer"
              >
                Reshedule Appointment
              </button>
            </div>
                 
                </div>
              </div>
            )}
   
    </div>
  );
}
