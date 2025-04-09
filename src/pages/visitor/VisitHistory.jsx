import React from 'react';

function Visithistory() {
  const visitHistory = [
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
    "2025/04/01",
  ]; // Example data for visit history

  return (
    <div className="p-6">
     
      {/* Visit History List */}
      <div className="mt-6 space-y-3 m-30 mt-20">
        {visitHistory.map((date, index) => (
          <div
            key={index}
            className="bg-gray-500 text-white p-3 rounded-lg shadow-md text-center text-sm"
          >
            {date}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Visithistory;