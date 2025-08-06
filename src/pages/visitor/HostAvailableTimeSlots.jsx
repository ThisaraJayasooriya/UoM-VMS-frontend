import React, { useEffect, useState } from "react";
import { getAcceptedAppointment, confirmAppointment, rejectAppointment, selectTimeSlot } from "../../services/appoinment.api";

function HostAvailableTimeSlots() {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isMultipleSlots, setIsMultipleSlots] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.id) {
      fetchAppointment(storedUser.id);
    }
  }, []);

  const fetchAppointment = async (visitorId) => {
    try {
      const data = await getAcceptedAppointment(visitorId);
      console.log("Fetched appointment data:", data);
      setAppointment(data);
      
      // Check if this is a multiple slots appointment
      if (data && data.response && data.response.responseType === "allSlots") {
        setIsMultipleSlots(true);
      } else {
        setIsMultipleSlots(false);
      }
    } catch (error) {
      console.error("Error loading appointment", error);
    }
  };

  const handleSlotSelection = async (slot) => {
    if (!slot || !appointment._id) return;

    setLoading(true);
    try {
      await selectTimeSlot(appointment._id, slot.slotId);
      
      // Update the appointment with the selected slot
      setAppointment(prev => ({
        ...prev,
        selectedTimeSlot: slot,
        response: {
          ...prev.response,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime
        }
      }));
      
      // Show success notification
      setNotification({
        show: true,
        type: 'success',
        message: 'Time slot selected successfully!'
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error("Error selecting time slot:", error);
      // Show error notification
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to select time slot. Please try again.'
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!appointment || !appointment._id) return;

    // For multiple slots, check if slot is selected
    if (isMultipleSlots && !selectedSlot && !appointment.selectedTimeSlot) {
      setNotification({
        show: true,
        type: 'warning',
        message: 'Please select a time slot first'
      });
      
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
      return;
    }

    setLoading(true);
    try {
      await confirmAppointment(appointment._id);
      
      // Show success notification
      setNotification({
        show: true,
        type: 'success',
        message: 'Appointment confirmed!'
      });
      
      // Update UI: set status to confirmed locally
      setAppointment({ ...appointment, status: "confirmed" });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to confirm appointment'
      });
      
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
   if (!appointment || !appointment._id) return;

    setLoading(true);
    try {
      await rejectAppointment(appointment._id);
      
      // Show notification
      setNotification({
        show: true,
        type: 'warning',
        message: 'Appointment rejected!'
      });
      
      setAppointment({ ...appointment, status: "visitorRejected" });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error(error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to reject appointment'
      });
      
      setTimeout(() => {
        setNotification({ show: false, type: '', message: '' });
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg- pt-24 px-4">      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-200">
        {/* Inline Notification */}
        {notification.show && (
          <div 
            className={`${
              notification.type === 'success' 
                ? 'bg-green-100 border border-green-400 text-green-700' 
                : notification.type === 'error'
                ? 'bg-red-100 border border-red-400 text-red-700'
                : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
            } px-4 py-3 rounded relative mb-6`} 
            role="alert"
          >
            <strong className="font-bold">
              {notification.type === 'success' ? 'Success! ' : notification.type === 'error' ? 'Error! ' : 'Warning! '}
            </strong>
            <span className="block sm:inline">{notification.message}</span>
            <button 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <svg className="fill-current h-6 w-6" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}
        {appointment ? (
          <div>
            {isMultipleSlots ? (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Select Your Preferred Time Slot
                </h2>
                
                {appointment.selectedTimeSlot ? (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Selected Time Slot:</h3>
                    <p className="text-green-700">
                      📅 {new Date(appointment.selectedTimeSlot.date).toLocaleDateString()} - 
                      🕒 {appointment.selectedTimeSlot.startTime} to {appointment.selectedTimeSlot.endTime}
                    </p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Available Time Slots:</h3>
                    <div className="grid gap-3">
                      {appointment.availableTimeSlots?.map((slot) => (
                        <div
                          key={slot.slotId}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedSlot?.slotId === slot.slotId
                              ? 'bg-blue-50 border-blue-500'
                              : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium">
                                📅 {new Date(slot.date).toLocaleDateString()}
                              </span>
                              <span className="ml-4 text-gray-600">
                                🕒 {slot.startTime} - {slot.endTime}
                              </span>
                            </div>
                            <input
                              type="radio"
                              name="timeSlot"
                              checked={selectedSlot?.slotId === slot.slotId}
                              onChange={() => setSelectedSlot(slot)}
                              className="ml-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-center gap-4 mt-6">
                  {!appointment.selectedTimeSlot && (
                    <button
                      onClick={() => handleSlotSelection(selectedSlot)}
                      disabled={!selectedSlot || loading}
                      className={`px-6 py-3 rounded-lg font-semibold transition ${
                        selectedSlot && !loading
                          ? 'bg-[#124E66] text-white hover:bg-[#0E3D52] '
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {loading ? "Selecting..." : "Select Time Slot"}
                    </button>
                  )}
                  
                  {appointment.selectedTimeSlot && appointment.status === "accepted" && (
                    <button
                      onClick={handleConfirm}
                      disabled={loading}
                      className="px-6 py-3 bg-[#124E66] text-white rounded-lg hover:bg-[#0E3D52]  font-semibold transition"
                    >
                      {loading ? "Confirming..." : "Confirm Appointment"}
                    </button>
                  )}
                  
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
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
            )}
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
