import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { CgMenuLeftAlt } from "react-icons/cg";
import { LuContact } from "react-icons/lu";
import { FaPenToSquare } from "react-icons/fa6";
import { fetchConfirmedAppointments, rescheduleAppointment, cancelAppointment } from "../../services/appointmentService";

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
  const [isReschedulePopupOpen, setIsReschedulePopupOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // State to store the selected appointment details
  const [appointments, setAppointments] = useState([]);
  const [hostId, setHostId] = useState("");
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    startTime: "",
    endTime: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

   useEffect(() => {
         const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
         if (storedUser && storedUser.id) {
           setHostId(storedUser.id);
         }
       }, []);
   
     useEffect(() => {
       if (hostId) loadRequests();
     }, [hostId]);

  const loadRequests = async () => {
    try {
      const data = await fetchConfirmedAppointments(hostId);
      const formatted = data.map((a) => ({
        id: a._id,
        aId: a.appointmentId,
        title: a.reason,
        visitorName: a.firstname + " " + a.lastname,
        phone: a.contact || "N/A",
        email: a.email || "N/A",
        date: formatDate(a.response.date),
        time:`${formatTo12Hour(a.response.startTime)} - ${formatTo12Hour(a.response.endTime)}`
      }));
      setAppointments(formatted);
    } catch (error) {
      console.error("Failed to fetch meeting requests:", error);
      setError("Failed to load appointments");
    }
  };



  const handleButtonClick = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected meeting details
    setIsPopupOpen(true); // Open the popup
  };

  const handleClose = (id) => {
    setIsPopupOpen(false); // Close the details popup
    setIsCancelConfirmOpen(true); // Open the cancel confirmation popup
  }

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;

    setIsLoading(true);
    setError("");

    try {
      await cancelAppointment(selectedAppointment.id);
      
      // Close all popups
      setIsCancelConfirmOpen(false);
      setSelectedAppointment(null);
      
      // Refresh appointments list
      await loadRequests();
      
      console.log("Appointment canceled successfully");
      
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setError(error.response?.data?.message || "Failed to cancel appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancelConfirmClose = () => {
    setIsCancelConfirmOpen(false);
    // Optionally reopen the details popup
    setIsPopupOpen(true);
  }

  const handleReschedule = () => {
    setIsPopupOpen(false); // Close details popup
    setIsReschedulePopupOpen(true); // Open reschedule popup
    // Initialize reschedule data with current appointment data
    setRescheduleData({
      date: "",
      startTime: "",
      endTime: ""
    });
  }

  const handleRescheduleSubmit = async () => {
    if (!selectedAppointment || !rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime) {
      setError("Please fill in all required fields");
      return;
    }

    if (rescheduleData.startTime >= rescheduleData.endTime) {
      setError("End time must be after start time");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const reschedulePayload = {
        date: rescheduleData.date,
        startTime: rescheduleData.startTime,
        endTime: rescheduleData.endTime
      };

      await rescheduleAppointment(selectedAppointment.id, reschedulePayload);
      
      // Close popup and reset data
      setIsReschedulePopupOpen(false);
      setSelectedAppointment(null);
      setRescheduleData({
        date: "",
        startTime: "",
        endTime: ""
      });

      // Refresh appointments list
      await loadRequests();
      
      console.log("Appointment rescheduled successfully");
      
    } catch (error) {
      console.error("Failed to reschedule appointment:", error);
      setError(error.response?.data?.message || "Failed to reschedule appointment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const handleRescheduleCancel = () => {
    setIsReschedulePopupOpen(false);
    setRescheduleData({
      date: "",
      startTime: "",
      endTime: ""
    });
    setError(""); // Clear any error messages
  }
  if (!open) return null;

  return (
    <div className="relative">
      {/* Error message display */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[60] max-w-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-700 hover:text-red-900 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

    <div  className={`pt-20 px-4 lg:px-20 transition-all duration-300 ${
        isPopupOpen || isReschedulePopupOpen || isCancelConfirmOpen ? "blur-sm pointer-events-none" : ""
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
                onClick={handleReschedule}
                className="px-3 py-2 bg-blue text-white rounded-md hover:bg-darkblue font-semibold cursor-pointer"
              >
                Reshedule Appointment
              </button>
            </div>
                 
                </div>
              </div>
            )}

      {/* Reschedule Popup */}
      {isReschedulePopupOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1">
            <button
              onClick={handleRescheduleCancel}
              disabled={isLoading}
              className="absolute top-2 right-2 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              <FaTimes className="text-black text" />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 flex justify-center m-1">
              Reschedule Appointment
            </h3>
            
            <div className="mb-4">
              <p className="text-lg font-semibold text-center mb-2">
                {selectedAppointment.aId}
              </p>
              <p className="text-center text-gray-600 mb-4">
                Visitor: {selectedAppointment.visitorName}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleData.startTime}
                    onChange={(e) => setRescheduleData({...rescheduleData, startTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={rescheduleData.endTime}
                    onChange={(e) => setRescheduleData({...rescheduleData, endTime: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Validation message */}
              {rescheduleData.startTime && rescheduleData.endTime && 
               rescheduleData.startTime >= rescheduleData.endTime && (
                <p className="text-red-500 text-sm">
                  End time must be after start time
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleRescheduleCancel}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={isLoading || !rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime || 
                         rescheduleData.startTime >= rescheduleData.endTime}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rescheduling...
                  </>
                ) : (
                  'Reschedule'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Popup */}
      {isCancelConfirmOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1">
            <button
              onClick={handleCancelConfirmClose}
              disabled={isLoading}
              className="absolute top-2 right-2 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              <FaTimes className="text-black text" />
            </button>
            
            <h3 className="text-2xl font-bold mb-4 flex justify-center m-1 text-red-600">
              Cancel Appointment
            </h3>
            
            <div className="mb-6">
              <p className="text-lg font-semibold text-center mb-2">
                {selectedAppointment.aId}
              </p>
              <p className="text-center text-gray-600 mb-4">
                Visitor: {selectedAppointment.visitorName}
              </p>
              <p className="text-center text-gray-600 mb-4">
                Date: {selectedAppointment.date}
              </p>
              <p className="text-center text-gray-600 mb-6">
                Time: {selectedAppointment.time}
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                <p className="text-red-800 text-center font-medium">
                  ⚠️ Are you sure you want to cancel this appointment?
                </p>
                <p className="text-red-600 text-center text-sm mt-2">
                  This action cannot be undone. The visitor will be notified of the cancellation.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelConfirmClose}
                disabled={isLoading}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Canceling...
                  </>
                ) : (
                  'Yes, Cancel Appointment'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
   
    </div>
  );
}
