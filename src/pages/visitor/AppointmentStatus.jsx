import React, { useState, useEffect } from "react";
import { getAppointmentStatus } from "../../services/appoinment.api";

function AppointmentStatus() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

  const statusColors = {
    confirmed: "#2e8b57",         // Green
    visitorRejected: "#b22222",   // Red
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US");
    } catch (err) {
      return "Invalid Date";
    }
  };

  return (
    <div className="min-h-screen p-8 mt-20">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-[#2E3944]">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="mb-6 text-[#2E3944]">
              <span className="font-bold">{appointments.length}</span> appointments found
            </div>

            <div className="space-y-6">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="bg-gray-100 border-l-4 border-[#124E66] shadow-md rounded-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <p className="text-[#2E3944]">
                          <span className="font-medium">Host:</span> {appointment.hostName}
                        </p>
                        <p className="text-[#2E3944]">
                          <span className="font-medium">Date:</span> {formatDate(appointment.date)}
                        </p>
                        <p className="text-[#2E3944]">
                          <span className="font-medium">Time Slot:</span> {appointment.timeSlot}
                        </p>
                        <p className="text-[#748D94] text-sm">
                          <span className="font-medium">Reason:</span> {appointment.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className="inline-block text-white px-3 py-1 text-sm rounded-full font-medium"
                          style={{
                            backgroundColor: statusColors[appointment.status] || "#333",
                          }}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#D3D9D4] flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <div className="text-[#2E3944] text-sm">
                        <p>✉️ {appointment.visitorEmail}</p>
                        <p>📞 {appointment.visitorPhone}</p>
                      </div>
                      <div className="flex gap-3">
                        {appointment.status === "confirmed" && (
                          <button className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0e3d52]">
                            View Details
                          </button>
                        )}
                        {appointment.status === "visitorRejected" && (
                          <button className="px-4 py-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-100">
                            Rejected by You
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 text-center text-[#748D94]">
                  No confirmed or rejected appointments.
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
