import React, { useState, useEffect } from "react";
import { getAppointmentStatus } from "../../services/appoinment.api.js";

function Visithistory() {
  // State for visit history
  const [visitHistory, setVisitHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch completed appointments from backend
  useEffect(() => {
    const fetchCompletedVisits = async () => {
      try {
        setIsLoading(true);
        
        // Get visitor ID from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const visitorId = userData?.id;
        
        if (!visitorId) {
          throw new Error("User not logged in or visitor ID not found");
        }
        
        // Fetch appointments from backend
        const appointments = await getAppointmentStatus(visitorId);
        
        // Filter only appointments with completed
        const completedVisits = appointments.filter(appointment => 
          appointment.status === "Completed"
        );
        
        // Format the data for our component
        const formattedVisits = completedVisits.map(appointment => ({
          visitorName: `${appointment.firstname} ${appointment.lastname}`,
          host: appointment.hostName || "Unknown Host",
          dateTime: appointment.appointmentDate 
            ? new Date(appointment.appointmentDate).toLocaleString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit'
              }) 
            : new Date(appointment.createdAt).toLocaleString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                hour: '2-digit', 
                minute: '2-digit'
              }),
          reason: appointment.reason,
          status: "Completed",
          appointmentId: appointment._id,
          hostInfo: {
            faculty: appointment.hostFaculty,
            department: appointment.hostDepartment
          }
        }));
        
        setVisitHistory(formattedVisits);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching visits:", err);
        setError(err.message || "Failed to load visit history");
        setIsLoading(false);
      }
    };
    
    fetchCompletedVisits();
  }, []);

  // Filter option - only time filter since we're showing only completed visits
  const [timeFilter, setTimeFilter] = useState("7"); // 7/14/30/all

  // Filter visits based on time selection
  const filteredVisits = visitHistory.filter(visit => {
    // Time filter logic
    const visitDate = new Date(visit.dateTime);
    const cutoffDate = new Date();
    
    if (timeFilter !== "all") {
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeFilter));
      if (visitDate < cutoffDate) return false;
    }

    return true;
  });

  // Status colors
  const statusColors = {
    Completed: "#124E66",
    Pending: "#748D94",
    Canceled: "red"
  };

  return (
    <div className="min-h-screen  p-8 mt-20">
      <div className="max-w-4xl mx-auto">

        
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#124E66] mb-2">Completed Visit History</h1>
          <p className="text-[#748D94]">View your past visits to the University of Moratuwa</p>
        </div>
        
        {/* Filter Controls - Only Time Period */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#2E3944] mb-2">
            Time Period
          </label>
          <div className="flex flex-wrap gap-2">
            {["7", "14", "30", "all"].map(option => (
              <button
                key={option}
                onClick={() => setTimeFilter(option)}
                className={`px-4 py-2 rounded-lg ${
                  timeFilter === option
                    ? "bg-[#124E66] text-white"
                    : "bg-[#748D94] text-white hover:bg-[#5a7179]"
                }`}
              >
                {option === "all" ? "All Time" : `Last ${option} Days`}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#124E66]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-6 text-[#2E3944]">
              <span className="font-bold">{filteredVisits.length}</span> completed {filteredVisits.length === 1 ? 'visit' : 'visits'} {timeFilter !== "all" ? `in the last ${timeFilter} days` : ''}
            </div>

            {/* Visit History Cards */}
          </>
        )}
        {!isLoading && !error && (
          <div className="space-y-6">
            {filteredVisits.length > 0 ? (
              filteredVisits.map((visit, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border-l-4 border-[#124E66] shadow-md rounded-lg p-6 transition transform hover:scale-[1.01]"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <p className="text-xl font-semibold text-[#212A31]">{visit.visitorName}</p>
                      <p className="text-[#2E3944] mt-1">
                        <span className="font-medium">Host:</span> {visit.host}
                      </p>
                      {visit.hostInfo && visit.hostInfo.faculty && visit.hostInfo.department && (
                        <p className="text-[#748D94] text-sm mt-1">
                          {visit.hostInfo.faculty} - {visit.hostInfo.department}
                        </p>
                      )}
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end gap-2">
                      <span 
                        className="inline-block text-white px-3 py-1 text-sm rounded-full font-medium"
                        style={{ backgroundColor: statusColors[visit.status] }}
                      >
                        {visit.status}
                      </span>
                      <span className="text-[#748D94] text-sm">
                        {visit.dateTime}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-[#2E3944]">
                      <p>
                        <span className="text-[#124E66]">📝</span> {visit.reason}
                      </p>
                    </div>
                    
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg p-8 text-center text-[#748D94] shadow-md">
                <div className="flex flex-col items-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg font-medium">No completed visits found</p>
                  <p className="text-sm mt-2">No visits match your selected time period</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagination - Only show when not using time filter */}
        {timeFilter === "all" && (
          <div className="flex justify-center mt-10 gap-2">
            <button className="px-4 py-2 rounded-lg bg-[#124E66] text-white">Previous</button>
            <button className="px-4 py-2 rounded-lg bg-[#124E66] text-white">1</button>
            <button className="px-4 py-2 rounded-lg bg-[#748D94] text-white">2</button>
            <button className="px-4 py-2 rounded-lg bg-[#748D94] text-white">3</button>
            <button className="px-4 py-2 rounded-lg bg-[#124E66] text-white">Next</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Visithistory;