import React, { useState } from "react";

function Visithistory() {
  // Sample visit history data with dates
  const visitHistory = [
    {
      visitorName: "Hafsa",
      host: "Mr. Smith",
      dateTime: "2025/04/01 10:30 AM", // Within 30 days
      reason: "Official Meeting",
      status: "Completed"
    },
    {
      visitorName: "Hafsa",
      host: "Ms. Taylor",
      dateTime: "2025/04/10 2:00 PM", // Within 14 days
      reason: "Document Submission",
      status: "Completed"
    },
    {
      visitorName: "Hafsa",
      host: "Mr. Wick",
      dateTime: "2025/04/15 11:00 AM", // Within 7 days
      reason: "Client Visit",
      status: "Completed"
    },
    {
      visitorName: "Hafsa",
      host: "Mr. Smith",
      dateTime: "2025/03/01 10:30 AM", // Older than 30 days
      reason: "Official Meeting",
      status: "Canceled"
    },
  ];

  // Filter options
  const [timeFilter, setTimeFilter] = useState("7"); // 7/14/30/all
  const [statusFilter, setStatusFilter] = useState("all"); // all/completed/pending/canceled

  // Filter visits based on selections
  const filteredVisits = visitHistory.filter(visit => {
    // Time filter logic
    const visitDate = new Date(visit.dateTime);
    const cutoffDate = new Date();
    
    if (timeFilter !== "all") {
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeFilter));
      if (visitDate < cutoffDate) return false;
    }

    // Status filter logic
    if (statusFilter !== "all" && visit.status !== statusFilter) return false;

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

        
        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Time Period Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#2E3944] mb-1">
              Time Period
            </label>
            <div className="flex gap-2">
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

          {/* Status Filter */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#2E3944] mb-1">
              Visit Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 rounded-lg border border-[#748D94] bg-white text-[#212A31]"
            >
              <option value="all">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-[#2E3944]">
          Showing <span className="font-bold">{filteredVisits.length}</span> visits matching filters
        </div>

        {/* Visit History Cards */}
        <div className="space-y-6">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit, index) => (
              <div
                key={index}
                className="bg-gray-200 border-l-4 border-[#124E66] shadow-md rounded-lg p-6 transition transform hover:scale-[1.02]"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <p className="text-xl font-semibold text-[#212A31]">{visit.visitorName}</p>
                    <p className="text-[#2E3944] mt-1">
                      <span className="font-medium">Host:</span> {visit.host}
                    </p>
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
                  <p className="text-[#2E3944]">
                    <span className="text-[#124E66]">📝</span> {visit.reason}
                  </p>
                  <button className="text-[#124E66] hover:text-[#0e3d52] font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 text-center text-[#748D94]">
              No visits match the selected filters
            </div>
          )}
        </div>

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