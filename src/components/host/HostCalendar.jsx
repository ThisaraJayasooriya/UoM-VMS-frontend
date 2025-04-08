import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { FaClock, FaClockRotateLeft } from "react-icons/fa6";


const HostCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(30);
  const hostId = "65eeabcd1234ef567890abcd"; // Replace with actual host ID

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  // Fetch existing time slots from the backend
  const fetchTimeSlots = async () => {
    try {
      const data = await getTimeSlots(hostId);
      const formattedEvents = data.map((slot) => ({
        id: slot._id,
        title: slot.status === "available" ? "Available" : "Booked", // Set title based on status
        start: `${slot.date}T${slot.startTime}`,
        end: `${slot.date}T${slot.endTime}`,
        backgroundColor: slot.status === "available" ? "green" : "red", // Set background color based on status
        borderColor: slot.status === "available" ? "green" : "red", // Set border color based on status
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch time slots");
    }
  };

  // Save new slots to the backend
  const saveSlot = async () => {
    try {
      if (!selectedDate || !startTime) {
        console.error("Date and Start Time must be selected");
        return;
      }

      // Ensure startTime is in "HH:mm" format
      const startTimeObj = new Date(`1970-01-01T${startTime}:00`);
      const endTimeObj = new Date(startTimeObj.getTime() + duration * 60000);
      const formattedEndTime = endTimeObj.toTimeString().slice(0, 5);

      const newSlot = {
        hostId: hostId,
        date: selectedDate,
        startTime: startTime,
        endTime: formattedEndTime,
        status: "available",
      };

      await addTimeSlots(newSlot.hostId, newSlot.date, newSlot.startTime, newSlot.endTime);
      fetchTimeSlots(); // Refresh calendar after adding

      setIsPopupOpen(false);
      setSelectedDate("");
      setStartTime("");
    } catch (error) {
      console.error("Failed to save time slots", error);
    }
  };

  return (
    <div className={`p-4 ${isPopupOpen ? "overflow-hidden" : ""}`}>
      <div className={`relative ${isPopupOpen ? "blur-sm pointer-events-none" : ""}`}>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="mb-4 px-4 py-2 bg-blue text-white font-semibold rounded hover:bg-darkblue transition duration-300 cursor-pointer"
        >
          Add Time Slots
        </button>

        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          events={events}
          eventContent={(eventInfo) => (
            <div style={{ color: "white", fontWeight: "bold" }}>
              {eventInfo.event.title}
            </div>
          )}
          height="auto"
        />
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0  bg-opacity-50 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-lg w-120 z-10 shadow-lg border-black border-solid border-1">
            <h3 className="text-2xl font-bold mb-4">Bookable Appointment Schedule</h3>

            <div className="mb-4">
              <label className="block font-semibold">Appointment Duration</label>
              <p className="text-gray-500">How long should each appointment last?</p>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full p-2 border rounded bg-gray-100"
              >
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
              </select>
            </div>

            <hr />

            <div className="mb-4">
              <label className="block font-semibold">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold">Select Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="flex space-x-2 mt-4">
              <button onClick={saveSlot} className="flex-1 bg-blue text-white p-2 rounded hover:bg-darkblue transition">
                Save Slot
              </button>
              <button onClick={() => setIsPopupOpen(false)} className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostCalendar;
