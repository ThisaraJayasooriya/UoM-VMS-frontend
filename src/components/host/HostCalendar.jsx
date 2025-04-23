import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { TfiPlus } from "react-icons/tfi";
import { RxCross1 } from "react-icons/rx";
import { addTimeSlots, getTimeSlots } from "../../services/timeslotService";

const HostCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [duration, setDuration] = useState(30);
  const [timeSlots, setTimeSlots] = useState([
    { date: "", startTime: "" }
  ]);
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
        title: slot.status === "available" ? "Available" : "Booked", 
        start: `${slot.date}T${slot.startTime}`,
        end: `${slot.date}T${slot.endTime}`,
        backgroundColor: slot.status === "available" ? "green" : "red", 
        borderColor: slot.status === "available" ? "green" : "red", 
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch time slots");
    }
  };

  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime) => {
    if (!startTime) return "";
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, '0');
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    
    return `${endHours}:${endMinutes}`;
  };

  // Handle date change for a specific row
  const handleDateChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index].date = value;
    setTimeSlots(updatedSlots);
  };

  // Handle start time change for a specific row
  const handleStartTimeChange = (index, value) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index].startTime = value;
    setTimeSlots(updatedSlots);
  };

  // Add a new time slot row
  const addNewTimeSlotRow = () => {
    setTimeSlots([...timeSlots, { date: "", startTime: "" }]);
  };

  // Remove a time slot row
  const removeTimeSlotRow = (index) => {
    if (timeSlots.length > 1) {
      const updatedSlots = timeSlots.filter((_, i) => i !== index);
      setTimeSlots(updatedSlots);
    }
  };

  // Save all time slots to the backend
  const saveAllSlots = async () => {
    // Validate all slots
    const validSlots = timeSlots.filter(slot => 
      slot.date && slot.startTime
    );

    if (validSlots.length === 0) {
      console.error("No valid time slots to save");
      return;
    }

    try {
      // Save each valid slot with calculated end time
      for (const slot of validSlots) {
        const endTime = calculateEndTime(slot.startTime);
        await addTimeSlots(hostId, slot.date, slot.startTime, endTime);
      }
      
      fetchTimeSlots(); // Refresh calendar after adding
      setIsPopupOpen(false);
      
      // Reset to a single empty slot
      setTimeSlots([{ date: "", startTime: "" }]);
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
          <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

          <div className="relative bg-white p-6 rounded-lg w-120 z-10 shadow-lg border-black border-solid border-1 max-h-90vh overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Bookable Appointment Schedule</h3>

            <div className="mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-2">
                  <span className="text-gray-700">1</span>
                </div>
                <h4 className="font-semibold text-lg">Appointment duration</h4>
              </div>
              <p className="text-gray-500 ml-10">How long should each appointment last?</p>
              <div className="ml-10 mt-2">
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-1/2 p-2 border rounded bg-gray-100"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                </select>
              </div>
            </div>

            <hr className="my-4" />

            <div className="mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 mr-2">
                  <span className="text-gray-700">2</span>
                </div>
                <h4 className="font-semibold text-lg">Availability</h4>
              </div>
              <p className="text-gray-500 ml-10">Set when you're available for appointments.</p>
            </div>

            {timeSlots.map((slot, index) => (
              <div key={index} className="ml-10 mb-4 flex items-center space-x-2">
                <input
                  type="date"
                  placeholder="Select date"
                  value={slot.date}
                  onChange={(e) => handleDateChange(index, e.target.value)}
                  className="p-2 border rounded bg-gray-100"
                />
                <input
                  type="time"
                  placeholder="Start time"
                  value={slot.startTime}
                  onChange={(e) => handleStartTimeChange(index, e.target.value)}
                  className="p-2 border rounded bg-gray-100"
                />
                
                
                {timeSlots.length > 1 && (
                  <button
                    onClick={() => removeTimeSlotRow(index)}
                    className="p-2 text-black"
                    title="Remove this time slot"
                  >
                    <RxCross1 />
                  </button>
                )}
              </div>
            ))}

            <div className="ml-10 mb-4">
              <button 
                onClick={addNewTimeSlotRow}
                className="border border-blue text-blue px-4 py-2 rounded hover:bg-blue-50 transition"
              >
                Add time slot
              </button>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={() => setIsPopupOpen(false)} 
                className="px-6 py-2 bg-gray-300 rounded hover:bg-gray-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={saveAllSlots} 
                className="px-6 py-2 bg-blue text-white rounded hover:bg-darkblue transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostCalendar;