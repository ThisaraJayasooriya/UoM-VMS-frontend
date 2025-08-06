import React, { useState, useEffect } from "react";
import { addTimeSlots, getTimeSlots, deleteTimeSlot } from "../../services/timeslotService";
import CalendarHeader from "./calendar/CalendarHeader";
import StatsCards from "./calendar/StatsCards";
import WeeklyCalendar from "./calendar/WeeklyCalendar";
import DeleteConfirmationModal from "./calendar/DeleteConfirmationModal";
import AddTimeSlotsModal from "./calendar/AddTimeSlotsModal";



const HostCalendar = () => {
  const [events, setEvents] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(30);
  const [timeSlots, setTimeSlots] = useState([{ date: "", startTime: "" }]);
  const [hostId, setHostId] = useState("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, 1 = next week
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("hostId changed:", hostId);
    if (hostId) {
      fetchTimeSlots();
    }
  }, [hostId]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.id) {
      setHostId(storedUser.id);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isPopupOpen || isDeleteConfirmOpen) return; // Don't handle keyboard navigation when popup is open
      
      if (event.key === 'ArrowLeft') {
        goToPreviousWeek();
      } else if (event.key === 'ArrowRight') {
        goToNextWeek();
      } else if (event.key === 'Home') {
        setCurrentWeekOffset(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPopupOpen, isDeleteConfirmOpen]);

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

    const [hours, minutes] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0);

    const endDate = new Date(startDate.getTime() + duration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

    return `${endHours}:${endMinutes}`;
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
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
    const validSlots = timeSlots.filter((slot) => slot.date && slot.startTime);

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

  // Handle clicking on a time slot
  const handleSlotClick = (event) => {
    // Only allow deletion of available slots (green ones)
    if (event.backgroundColor === 'green') {
      setSelectedSlot(event);
      setIsDeleteConfirmOpen(true);
    }
  };

  // Delete time slot
  const handleDeleteSlot = async () => {
    if (!selectedSlot) return;

    setIsDeleting(true);
    setError("");

    try {
      await deleteTimeSlot(selectedSlot.id);
      
      // Refresh time slots after deletion
      await fetchTimeSlots();
      
      // Close confirmation dialog
      setIsDeleteConfirmOpen(false);
      setSelectedSlot(null);
      
    } catch (error) {
      console.error("Failed to delete time slot:", error);
      setError(error.response?.data?.message || "Failed to delete time slot. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete operation
  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedSlot(null);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isPopupOpen || isDeleteConfirmOpen ? "overflow-hidden" : ""}`}>
      {/* Error message */}
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-[60] max-w-md">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError("")}
              className="ml-2 text-red-700 hover:text-red-900 text-xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div
        className={`relative ${
          isPopupOpen || isDeleteConfirmOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header Component */}
        <CalendarHeader onAddTimeSlots={() => setIsPopupOpen(true)} />

        {/* Stats Cards Component */}
        <StatsCards events={events} />

        {/* Weekly Calendar Component */}
        <WeeklyCalendar
          events={events}
          currentWeekOffset={currentWeekOffset}
          onSlotClick={handleSlotClick}
          onAddTimeSlots={() => setIsPopupOpen(true)}
          onPreviousWeek={goToPreviousWeek}
          onNextWeek={goToNextWeek}
          onCurrentWeek={() => setCurrentWeekOffset(0)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        selectedSlot={selectedSlot}
        isDeleting={isDeleting}
        onConfirm={handleDeleteSlot}
        onCancel={handleDeleteCancel}
      />

      {/* Add Time Slots Modal */}
      <AddTimeSlotsModal
        isOpen={isPopupOpen}
        duration={duration}
        timeSlots={timeSlots}
        onClose={() => setIsPopupOpen(false)}
        onDurationChange={setDuration}
        onDateChange={handleDateChange}
        onStartTimeChange={handleStartTimeChange}
        onAddSlotRow={addNewTimeSlotRow}
        onRemoveSlotRow={removeTimeSlotRow}
        onSaveSlots={saveAllSlots}
        calculateEndTime={calculateEndTime}
      />
    </div>
  );
};

export default HostCalendar;
