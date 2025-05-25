import React, { useEffect, useState } from "react";
import { getAcceptedAppointment, confirmAppointment ,rejectAppointment} from "../../services/appoinment.api";

function HostAvailableTimeSlots() {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.id) {
      fetchAppointment(storedUser.id);
    }
  }, []);

  const fetchAppointment = async (visitorId) => {
    try {
      const data = await getAcceptedAppointment(visitorId);
      setAppointment(data);
    } catch (error) {
      console.error("Error loading appointment", error);
    }
  };

  const handleConfirm = async () => {
    if (!appointment || !appointment._id) return;

    setLoading(true);
    try {
      await confirmAppointment(appointment._id);
      alert("Appointment confirmed!");
      // Update UI: set status to confirmed locally
      setAppointment({ ...appointment, status: "confirmed" });
    } catch (error) {
      alert("Failed to confirm appointment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
   if (!appointment || !appointment._id) return;

    setLoading(true);
    try {
      await rejectAppointment(appointment._id);
      alert("Appointment rejected!");
      
      setAppointment({ ...appointment, status: "visitorRejected" });
    } catch (error) {
      alert("Failed to reject appointment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg- pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
        {appointment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Time Details */}
            <div className="space-y-4 text-lg text-gray-700">
              <p>
                <span className="font-semibold">📅 Date:</span> {appointment.response.date}
              </p>
              <p>
                <span className="font-semibold">🕒 Start Time:</span> {appointment.response.startTime}
              </p>
              <p>
                <span className="font-semibold">⏰ End Time:</span> {appointment.response.endTime}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {appointment.status}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              {appointment.status === "accepted" && (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-40 bg-blue2 text-white py-3 rounded-xl shadow hover:bg-blue transition"
                >
                  {loading ? "Confirming..." : "Confirm"}
                </button>
              )}
              <button
                onClick={handleReject}
                className="w-40 bg-yellow-500 text-white py-3 rounded-xl shadow hover:bg-yellow-600 transition"
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-xl mt-10">
            No accepted appointment found.
          </p>
        )}
      </div>
    </div>
  );
}

export default HostAvailableTimeSlots;
