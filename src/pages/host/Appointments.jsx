import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { LuContact } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";
import { fetchConfirmedAppointments } from "../../services/appointmentService";

function formatTo12Hour(time24) {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}



export default function Appointments() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to store the selected appointment details
  const [appointments, setAppointments] = useState([]);
   const [hostId, setHostId] = useState("");

   useEffect(() => {
         const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
         if (storedUser && storedUser.id) {
           setHostId(storedUser.id);
         }
       }, []);
   
     useEffect(() => {
       const loadRequests = async () => {
         try {
           const data = await fetchConfirmedAppointments(hostId);
           const formatted = data.map((a) => ({
             id: a._id,
             aId: a.appointmentId,
             title: a.reason,
             visitorName: a.firstname + " " + a.lastname,
             phone: a.contact || "N/A",
             date: formatDate(a.response.date),
             time:`${formatTo12Hour(a.response.startTime)} - ${formatTo12Hour(a.response.endTime)}`
           }));
           setAppointments(formatted);
         } catch (error) {
           console.error("Failed to fetch meeting requests:", error);
         }
       };
   
       if (hostId) loadRequests();
     }, [hostId]);



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
                  <td className="px-6 py-4 font-semibold">{appointment.aId}</td>
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
                        <p className="text-2xl">({selectedAppointment.aId})</p>
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
