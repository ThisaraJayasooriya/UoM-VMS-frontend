import React, { useEffect, useState } from "react";
import { getAcceptedAppointment } from "../../services/appoinment.api";

function HostAvailableTimeSlots() {
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.id) {
      fetchAppointment(storedUser.id);
    }
  }, []);

  const fetchAppointment = async (visitorId) => {
    try {
      const data = await getAcceptedAppointment(visitorId);
      setAppointment(data.response);
    } catch (error) {
      console.error("Error loading appointment", error);
    }
  };

  const handleAccept = () => {
    alert("Appointment Accepted!");
  };

  const handleRebook = () => {
    alert("Redirecting to Rebook Page...");
  };

  return (
    <div className="min-h-screen pt-28 bg-white px-4 mt-10">
      <div className="max-w-md mx-auto">
        {appointment ? (
          <div className="bg-white shadow-md rounded-lg p-6 border border-green-300 text-gray-700">
            <div className="mb-4">
              <p><span className="font-semibold">📅 Date:</span> {appointment.date}</p>
              <p><span className="font-semibold">🕒 Start Time:</span> {appointment.startTime}</p>
              <p><span className="font-semibold">⏰ End Time:</span> {appointment.endTime}</p>
            </div>

            {/* Buttons side by side */}
            <div className="flex justify-center gap-4 mt-4 ">
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600 transition"
              >
                Accept
              </button>
              <button
                onClick={handleRebook}
                className="bg-yellow-500 text-white px-5 py-2 rounded hover:bg-yellow-600 transition"
              >
                Rebook
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">
            No accepted appointment found.
          </p>
        )}
      </div>
    </div>
  );
}

export default HostAvailableTimeSlots;
