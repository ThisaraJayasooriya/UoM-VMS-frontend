import React from 'react';

function Visithistory() {
  const visitHistory = [
    {
      visitorName: "Thisara Jayasooriya ",
      host: "Mr. Smith",
      date: "2025/04/01",
      time: "10:30 AM",
      reason: "Official Meeting",
    },
    {
      visitorName: "Thisara Jayasooriya",
      host: "Ms. Taylor",
      date: "2025/04/02",
      time: "2:00 PM",
      reason: "Document Submission",
    },
    {
      visitorName: "Thisara Jayasooriya",
      host: "Dr. Williams",
      date: "2025/04/03",
      time: "9:00 AM",
      reason: "Consultation",
    },
    {
      visitorName: "Thisara Jayasooriya",
      host: "Dr. Williams",
      date: "2025/04/03",
      time: "9:00 AM",
      reason: "Consultation",
    },
  ];

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center mt-10">
      <div className="w-full max-w-2xl space-y-4">
        {visitHistory.map((visit, index) => (
          <div
            key={index}
            className="bg-blue2 p-5 rounded-lg shadow-sm border border-gray-400 colour-gray-200 hover:shadow-lg transition duration-300 ease-in-out"
          >
            <p className="text-lg font-semibold text-gray-800">
              Visitor: {visit.visitorName}
            </p>
            <p className="text-sm text-gray-600">Host: {visit.host}</p>
            <p className="text-sm text-gray-600">Date: {visit.date}</p>
            <p className="text-sm text-gray-600">Time: {visit.time}</p>
            <p className="text-sm text-gray-600">Reason: {visit.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visithistory;