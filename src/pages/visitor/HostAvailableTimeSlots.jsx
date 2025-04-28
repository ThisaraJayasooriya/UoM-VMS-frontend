import React from "react";

function HostAvailableTimeSlots() {
  const availableSlots = [
    {
      id: 1,
      date: "3 Mar 2025",
      time: "9:00am",
      duration: "30 min",
    },
  ];

  return (
    <div className="min-h-screen  p-8 mt-20">
      <div className="max-w-4xl mx-auto">
       

        {/* Available Slots */}
        <div className="bg-green-50 p-6 rounded-lg shadow-md mt-">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Host Available Time</h2>
          <div className="grid grid-cols-4 gap-4 items-center text-center">
            <p className="font-medium text-gray-600">Date</p>
            <p className="font-medium text-gray-600">Time</p>
            <p className="font-medium text-gray-600">Duration</p>
            <p className="font-medium text-gray-600">Actions</p>
          </div>
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="grid grid-cols-4 gap-4 items-center text-center mt-4"
            >
              <p className="bg-gray-200 text-gray-800 py-2 rounded-lg">{slot.date}</p>
              <p className="bg-gray-200 text-gray-800 py-2 rounded-lg">{slot.time}</p>
              <p className="bg-gray-200 text-gray-800 py-2 rounded-lg">{slot.duration}</p>
              <div className="flex justify-center gap-2">
                <button className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0e3b4d]"> 
                  Select
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Rebook
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HostAvailableTimeSlots;