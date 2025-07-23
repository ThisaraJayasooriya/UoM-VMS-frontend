import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointmentStatus } from "../../services/appoinment.api";

function AppointmentStatus() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Set the page name for the header
    localStorage.setItem("name", "Appoinment Status");
    
    const fetchAppointments = async () => {
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      if (storedUser && storedUser.id) {
        try {
          const data = await getAppointmentStatus(storedUser.id);
          setAppointments(data);
        } catch (err) {
          setError("Failed to fetch appointments");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Visitor ID not found.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Process appointments to ensure all required fields are available
  const processedAppointments = appointments.map(appointment => {
    // Ensure hostName is available
    if (!appointment.hostName && appointment.hostId) {
      appointment.hostName = typeof appointment.hostId === 'object' ? 
        (appointment.hostId.name || `${appointment.hostId.firstname || ''} ${appointment.hostId.lastname || ''}`.trim()) : 
        "Unknown Host";
    }
    
    return appointment;
  });
  
  // Filter appointments based on active tab
  const filteredAppointments = activeTab === "all" 
    ? processedAppointments 
    : processedAppointments.filter(appointment => appointment.status === activeTab);
    
  // Sort appointments by date, with newest dates first (descending order)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const dateA = new Date(a.response?.date || a.date || 0);
    const dateB = new Date(b.response?.date || b.date || 0);
    return dateB - dateA; // Descending order (newest first)
  });

  // Status styling information
  const statusColors = {
    pending: "#f59e0b",         // Amber
    confirmed: "#2e8b57",       // Green
    visitorRejected: "#b22222", // Red
    hostRejected: "#b22222",    // Red
    completed: "#3b82f6",       // Blue
  };
  
  const statusLabels = {
    pending: "Pending",
    confirmed: "Confirmed",
    visitorRejected: "Rejected by You",
    hostRejected: "Rejected by Host",
    completed: "Completed"
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date not specified";
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateStr; // Return the original string if it can't be parsed
      }
      
      // Format: Month Day, Year (e.g., July 15, 2025)
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateStr || "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen p-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#124E66]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 p-4 rounded-lg text-center text-red-600">
            <p>{error}</p>
            <button 
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Status Tabs */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#212A31] mb-4">My Appointments</h1>
              <div className="flex flex-wrap gap-2">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "all"
                      ? "bg-[#124E66] text-white"
                      : "bg-gray-100 text-[#2E3944] hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  All ({appointments.length})
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "pending"
                      ? "bg-[#f59e0b] text-white"
                      : "bg-gray-100 text-[#2E3944] hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending ({appointments.filter(a => a.status === "pending").length})
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "confirmed"
                      ? "bg-[#2e8b57] text-white"
                      : "bg-gray-100 text-[#2E3944] hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("confirmed")}
                >
                  Confirmed ({appointments.filter(a => a.status === "confirmed").length})
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === "visitorRejected" || activeTab === "hostRejected"
                      ? "bg-[#b22222] text-white"
                      : "bg-gray-100 text-[#2E3944] hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("visitorRejected")}
                >
                  Rejected ({appointments.filter(a => a.status === "visitorRejected" || a.status === "hostRejected").length})
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6 text-[#2E3944]">
              <span className="font-bold">{sortedAppointments.length}</span> appointments found
            </div>

            {/* Appointments List - Sorted by date (newest first) */}
            <div className="space-y-6">
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className={`bg-white border-l-4 shadow-md rounded-lg p-6 transition hover:shadow-lg`}
                    style={{ borderLeftColor: statusColors[appointment.status] || "#124E66" }}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-xl text-[#124E66] mb-2">
                          Meeting with {appointment.hostName || appointment.hostId?.name || "Host"}
                        </h3>
                        <p className="text-[#2E3944]">
                          <span className="font-medium">📅 Date:</span> {formatDate(appointment.response?.date || appointment.date)}
                        </p>
                        <p className="text-[#2E3944]">
                          <span className="font-medium">⏰ Time:</span> {appointment.response?.startTime ? 
                            `${appointment.response.startTime} - ${appointment.response.endTime}` : 
                            appointment.timeSlot || "Time not specified"}
                        </p>
                        <p className="text-[#2E3944] mt-2">
                          <span className="font-medium">🗒️ Reason:</span> {appointment.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block text-white px-4 py-2 text-sm rounded-md font-medium"
                          style={{
                            backgroundColor: statusColors[appointment.status] || "#333",
                          }}
                        >
                          {statusLabels[appointment.status] || appointment.status}
                        </span>
                       
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#D3D9D2] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      
                      <div className="flex gap-3">
                        {appointment.status === "confirmed" && (
                          <button className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0e3d52]">
                            View Details
                          </button>
                         
                        )}
                        
                        {appointment.status === "visitorRejected" && (
                          <button 
                            className="px-4 py-2 border border-gray-300 text-[#2E3944] rounded-lg hover:bg-gray-100"
                            onClick={() => navigate("/visitor/appointment")}
                          >
                            Make New Appointment
                          </button>
                        )}
                        {appointment.status === "pending" && (
                          <div className="flex gap-2">
                            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg">
                              Awaiting Response
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center text-[#748D94] border border-gray-100 shadow">
                  <div className="flex flex-col items-center gap-4">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg">No {activeTab !== "all" ? statusLabels[activeTab] : ""} appointments found.</p>
                    <button 
                      className="mt-2 px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0e3d52]"
                      onClick={() => navigate("/visitor/appointment")}
                    >
                      Make an Appointment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AppointmentStatus;
