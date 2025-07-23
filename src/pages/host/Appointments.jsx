import { useState, useEffect } from "react";
import { FaTimes, FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { 
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineCalendar
} from "react-icons/hi";
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
  const [isInitialLoading, setIsInitialLoading] = useState(true);
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
      setIsInitialLoading(true);
      // Add a small delay to show the loading animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await fetchConfirmedAppointments(hostId);
      const formatted = data.map((a) => ({
        id: a._id,
        aId: a.appointmentId,
        title: a.reason,
        visitorName: a.firstname + " " + a.lastname,
        phone: a.contact || "N/A",
        email: a.visitorId.email || "N/A",
        date: formatDate(a.response.date),
        time:`${formatTo12Hour(a.response.startTime)} - ${formatTo12Hour(a.response.endTime)}`
      }));
      setAppointments(formatted);
    } catch (error) {
      console.error("Failed to fetch meeting requests:", error);
      setError("Failed to load appointments");
    } finally {
      setIsInitialLoading(false);
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

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-6 py-4">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-2 h-4 bg-white/30 rounded"></div>
          <div className="col-span-3 h-4 bg-white/30 rounded"></div>
          <div className="col-span-2 h-4 bg-white/30 rounded"></div>
          <div className="col-span-2 h-4 bg-white/30 rounded"></div>
          <div className="col-span-2 h-4 bg-white/30 rounded"></div>
          <div className="col-span-1 h-4 bg-white/30 rounded"></div>
        </div>
      </div>
      
      {/* Skeleton Rows */}
      <div className="divide-y divide-gray-100">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="px-6 py-5">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-lg animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                  <div>
                    <div className="h-2 w-8 bg-gray-300 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-16 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                  <div>
                    <div className="h-2 w-8 bg-gray-300 rounded animate-pulse mb-1"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 flex justify-center">
                <div className="w-16 h-8 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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

      <div className={`pt-20 px-4 lg:px-16 max-w-7xl mx-auto transition-all duration-300 ${
        isPopupOpen || isReschedulePopupOpen || isCancelConfirmOpen ? "blur-sm pointer-events-none" : ""
      }`}>
        
        {/* Page Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue/10 rounded-xl animate-pulse-slow">
                <HiOutlineCalendar className="text-blue text-xl animate-bounce-gentle" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-darkblue">My Appointments</h1>
                <p className="text-customgray mt-1">Manage your confirmed appointments</p>
              </div>
            </div>
            {appointments.length > 0 && !isInitialLoading && (
              <div className="bg-blue text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 animate-slide-in">
                <HiOutlineUserGroup />
                {appointments.length} Active
              </div>
            )}
          </div>
        </div>

        {/* Appointments List */}
        {isInitialLoading ? (
          <div className="animate-fade-in">
            <SkeletonLoader />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm animate-fade-in">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiOutlineCalendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-darkblue2 mb-2">No appointments scheduled</h3>
            <p className="text-customgray">Your confirmed appointments will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-slide-up">
            {/* List Header */}
            <div className="bg-gradient-to-r from-blue to-darkblue2 px-6 py-4">
              <div className="grid grid-cols-12 gap-4 text-white font-semibold text-sm uppercase tracking-wide">
                <div className="col-span-2 flex items-center gap-2">
                  <FaCalendarAlt className="w-4 h-4" />
                  ID
                </div>
                <div className="col-span-3 flex items-center gap-2">
                  <HiOutlineDocumentText className="w-4 h-4" />
                  Purpose
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <FaUser className="w-4 h-4" />
                  Visitor
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <FaClock className="w-4 h-4" />
                  Date
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <HiOutlineClock className="w-4 h-4" />
                  Time
                </div>
                <div className="col-span-1 text-center">
                  Action
                </div>
              </div>
            </div>

            {/* List Items */}
            <div className="divide-y divide-gray-100">
              {appointments.map((appointment, index) => (
                <div
                  key={appointment.id}
                  className={`px-6 py-5 hover:bg-blue/5 transition-all duration-300 group ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Appointment ID */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue rounded-full"></div>
                        <span className="font-semibold text-darkblue text-sm group-hover:text-blue transition-colors">
                          {appointment.aId}
                        </span>
                      </div>
                    </div>

                    {/* Purpose */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue/10 rounded-lg">
                          <HiOutlineDocumentText className="text-blue w-3 h-3" />
                        </div>
                        <div>
                          <p className="font-semibold text-darkblue2 text-sm leading-tight">
                            {appointment.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Visitor */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-customgray/10 rounded-full flex items-center justify-center">
                          <FaUser className="text-customgray w-3 h-3" />
                        </div>
                        <div>
                          <p className="font-medium text-darkblue2 text-sm">
                            {appointment.visitorName}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-green-600 w-3 h-3" />
                        <div>
                          <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Date</p>
                          <p className="font-semibold text-darkblue text-sm">{appointment.date}</p>
                        </div>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-orange-500 w-3 h-3" />
                        <div>
                          <p className="text-xs text-orange-500 font-medium uppercase tracking-wide">Time</p>
                          <p className="font-semibold text-darkblue text-sm">{appointment.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => handleButtonClick(appointment)}
                        className="px-3 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium text-sm flex items-center gap-1 group-hover:shadow-md"
                      >
                        <FaEye className="w-3 h-3" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* List Footer */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-customgray">
                <span>Total appointments: {appointments.length}</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue rounded-full"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {isPopupOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-darkblue via-blue to-darkblue2 text-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Appointment Details</h3>
                  <p className="text-blue3/80 text-sm mt-1">ID: {selectedAppointment.aId}</p>
                </div>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Appointment Info */}
              <div className="bg-blue-50 border-l-4 border-blue rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HiOutlineCalendar className="text-blue w-5 h-5" />
                  <span className="font-semibold text-darkblue">Appointment Schedule</span>
                </div>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <FaCalendarAlt className="w-3 h-3" />
                      Date:
                    </span>
                    <span className="text-gray-800 font-semibold">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium flex items-center gap-2">
                      <FaClock className="w-3 h-3" />
                      Time:
                    </span>
                    <span className="text-gray-800 font-semibold">{selectedAppointment.time}</span>
                  </div>
                </div>
              </div>

              {/* Visitor Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue/10 rounded-full flex items-center justify-center">
                    <FaUser className="text-blue w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Visitor</p>
                    <p className="font-semibold text-darkblue">{selectedAppointment.visitorName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-green-600 w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Contact Information</p>
                    <p className="font-medium text-darkblue text-sm">{selectedAppointment.email}</p>
                    <p className="font-medium text-darkblue text-sm">{selectedAppointment.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <HiOutlineDocumentText className="text-purple-600 w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">Purpose</p>
                    <p className="font-semibold text-darkblue">{selectedAppointment.title}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={() => handleClose(selectedAppointment.id)}
                className="px-4 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center gap-2"
              >
                <FaTrash className="w-3 h-3" />
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                className="px-4 py-2 text-sm bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium flex items-center gap-2"
              >
                <FaEdit className="w-3 h-3" />
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isReschedulePopupOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-darkblue via-blue to-darkblue2 text-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Reschedule Appointment</h3>
                  <p className="text-blue3/80 text-sm mt-1">ID: {selectedAppointment.aId}</p>
                </div>
                <button
                  onClick={handleRescheduleCancel}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Current Appointment Info */}
              <div className="bg-blue-50 border-l-4 border-blue rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaUser className="text-blue w-4 h-4" />
                  <span className="font-semibold text-darkblue">Current Appointment</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">Visitor: {selectedAppointment.visitorName}</p>
                <p className="text-sm text-gray-600">Current Time: {selectedAppointment.date}, {selectedAppointment.time}</p>
              </div>

              {/* New Schedule Form */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                    <FaCalendarAlt className="text-blue w-4 h-4" />
                    New Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:bg-gray-100"
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <FaClock className="text-green-600 w-4 h-4" />
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleData.startTime}
                      onChange={(e) => setRescheduleData({...rescheduleData, startTime: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:bg-gray-100"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                      <FaClock className="text-red-600 w-4 h-4" />
                      End Time
                    </label>
                    <input
                      type="time"
                      value={rescheduleData.endTime}
                      onChange={(e) => setRescheduleData({...rescheduleData, endTime: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:bg-gray-100"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Validation Messages */}
                {rescheduleData.startTime && rescheduleData.endTime && 
                 rescheduleData.startTime >= rescheduleData.endTime && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">⚠️ End time must be after start time</p>
                  </div>
                )}

                {/* Preview */}
                {rescheduleData.date && rescheduleData.startTime && rescheduleData.endTime && 
                 rescheduleData.startTime < rescheduleData.endTime && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCalendarAlt className="text-green-600 w-3 h-3" />
                      <span className="text-xs text-green-800 font-medium uppercase tracking-wide">New Schedule</span>
                    </div>
                    <p className="text-sm font-semibold text-green-800">
                      {new Date(rescheduleData.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} • {rescheduleData.startTime} - {rescheduleData.endTime}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={handleRescheduleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={isLoading || !rescheduleData.date || !rescheduleData.startTime || !rescheduleData.endTime || 
                         rescheduleData.startTime >= rescheduleData.endTime}
                className="px-4 py-2 text-sm bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Rescheduling...
                  </>
                ) : (
                  <>
                    <FaEdit className="w-3 h-3" />
                    Reschedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {isCancelConfirmOpen && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Cancel Appointment</h3>
                  <p className="text-red-100 text-sm mt-1">ID: {selectedAppointment.aId}</p>
                </div>
                <button
                  onClick={handleCancelConfirmClose}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  <FaTimes className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {/* Appointment Info */}
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FaCalendarAlt className="text-red-500 w-5 h-5" />
                  <span className="font-semibold text-red-800">Appointment to Cancel</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Visitor:</span>
                    <span className="text-gray-800 font-semibold">{selectedAppointment.visitorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-800 font-semibold">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 font-medium">Time:</span>
                    <span className="text-gray-800 font-semibold">{selectedAppointment.time}</span>
                  </div>
                </div>
              </div>
              
              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 font-bold text-lg">⚠</span>
                  </div>
                  <div>
                    <p className="text-red-800 font-semibold mb-1">Are you sure you want to cancel this appointment?</p>
                    <p className="text-red-600 text-sm">This action cannot be undone. The visitor will be notified of the cancellation.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
              <button
                onClick={handleCancelConfirmClose}
                disabled={isLoading}
                className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Canceling...
                  </>
                ) : (
                  <>
                    <FaTrash className="w-3 h-3" />
                    Yes, Cancel Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
   
    </div>
  );
}

// Add custom styles for animations
const styles = `
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(20px);
    }
    to { 
      opacity: 1; 
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from { 
      opacity: 0;
      transform: translateY(30px);
    }
    to { 
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0;
      transform: translateX(30px);
    }
    to { 
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes bounceGentle {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-8px);
    }
  }
  
  @keyframes pulseSlow {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slideUp 0.8s ease-out forwards;
  }
  
  .animate-slide-in {
    animation: slideIn 0.6s ease-out forwards;
  }
  
  .animate-bounce-gentle {
    animation: bounceGentle 2s ease-in-out infinite;
  }
  
  .animate-pulse-slow {
    animation: pulseSlow 2s ease-in-out infinite;
  }
`;

// Inject styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}
