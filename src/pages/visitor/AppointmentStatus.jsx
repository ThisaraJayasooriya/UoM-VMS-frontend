import React, { useState } from "react";

function AppointmentStatus() {
  const upcomingVisits = [
    {
      id: 1,
      visitorName: "Hafsa",
      visitorEmail: "hafsa@example.com",
      visitorPhone: "0771234567",
      host: "Mr. Smith",
      dateTime: "2025-06-01T10:30:00",
      reason: "Project Discussion",
      status: "Approved",
    },
    {
      id: 2,
      visitorName: "Rashmi",
      visitorEmail: "rashmi@example.com",
      visitorPhone: "0769876543",
      host: "Ms. Perera",
      dateTime: "2025-06-02T14:00:00",
      reason: "Document Signing",
      status: "Pending Approval",
    },
    {
      id: 3,
      visitorName: "Dulanga",
      visitorEmail: "dulanga@example.com",
      visitorPhone: "0754567890",
      host: "Dr. Fernando",
      dateTime: "2025-06-03T11:15:00",
      reason: "Research Collaboration",
      status: "Approved",
    },
    {
      id: 4,
      visitorName: "Nimal",
      visitorEmail: "nimal@example.com",
      visitorPhone: "0783456789",
      host: "Prof. Silva",
      dateTime: "2025-06-04T09:45:00",
      reason: "Advisory Meeting",
      status: "Approved",
    },
  ];

  const statusColors = {
    Approved: "#124E66",
    "Pending Approval": "#748D94",
    Rejected: "#2E3944",
  };

  const formatDateTime = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (err) {
      return "Invalid Date";
    }
  };

  const [timeFilter, setTimeFilter] = useState("7");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVisits = upcomingVisits.filter((visit) => {
    const visitDate = new Date(visit.dateTime);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (timeFilter !== "all") {
      const futureLimit = new Date(today);
      futureLimit.setDate(today.getDate() + parseInt(timeFilter));
      if (visitDate > futureLimit) return false;
    }

    if (statusFilter !== "all" && visit.status !== statusFilter) return false;

    return visitDate >= today;
  });

  return (
    <div className="min-h-screen p-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <label className="block text-sm font-medium text-[#2E3944] mb-1">
              Show Visits Within
            </label>
            <div className="flex gap-2 flex-wrap">
              {["7", "14", "30", "all"].map((option) => (
                <button
                  key={option}
                  onClick={() => setTimeFilter(option)}
                  className={`px-4 py-2 rounded-lg ${
                    timeFilter === option
                      ? "bg-[#124E66] text-white"
                      : "bg-[#748D94] text-white hover:bg-[#5a7179]"
                  }`}
                >
                  {option === "all" ? "All Upcoming" : `Next ${option} Days`}
                </button>
              ))}
            </div>
          </div>

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
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mb-6 text-[#2E3944]">
          <span className="font-bold">{filteredVisits.length}</span> upcoming
          visits found
        </div>

        <div className="space-y-6">
          {filteredVisits.length > 0 ? (
            filteredVisits.map((visit) => (
              <div
                key={visit.id}
                className="bg-gray-200 border-l-4 border-[#124E66] shadow-md rounded-lg p-6"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="text-xl font-semibold text-[#212A31]">
                      {visit.visitorName}
                    </p>
                    <p className="text-[#2E3944]">
                      <span className="font-medium">Host:</span> {visit.host}
                    </p>
                    <p className="text-[#748D94] text-sm">
                      <span className="font-medium">Reason:</span>{" "}
                      {visit.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className="inline-block text-white px-3 py-1 text-sm rounded-full font-medium"
                      style={{ backgroundColor: statusColors[visit.status] }}
                    >
                      {visit.status}
                    </span>
                    <p className="text-[#124E66] font-medium mt-2">
                      {formatDateTime(visit.dateTime)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#D3D9D4] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                  <div className="text-[#2E3944] text-sm">
                    <p>✉️ {visit.visitorEmail}</p>
                    <p>📞 {visit.visitorPhone}</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0e3d52]">
                      Send Reminder
                    </button>
                    <button className="px-4 py-2 border border-[#748D94] text-[#2E3944] rounded-lg hover:bg-[#f0f0f0]">
                      Reschedule
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg p-8 text-center text-[#748D94]">
              No upcoming visits match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentStatus;
