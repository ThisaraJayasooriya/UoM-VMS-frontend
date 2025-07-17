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
  const [timeSlots, setTimeSlots] = useState([{ date: "", startTime: "" }]);
  const [hostId, setHostId] = useState("");
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // 0 = current week, -1 = previous week, 1 = next week

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
      if (isPopupOpen) return; // Don't handle keyboard navigation when popup is open
      
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
  }, [isPopupOpen]);

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

  // Get week dates based on current week offset
  const getCurrentWeekDates = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (currentWeekOffset * 7));
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }
    return weekDays;
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekOffset(prev => prev - 1);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekOffset(prev => prev + 1);
  };

  // Get current week range text
  const getCurrentWeekRange = () => {
    const weekDays = getCurrentWeekDates();
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
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

  return (
    <div className={`min-h-screen bg-gray-50 ${isPopupOpen ? "overflow-hidden" : ""}`}>
      <div
        className={`relative ${
          isPopupOpen ? "blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Simple Header */}
        <div className="bg-white border-b border-gray-200 mb-8">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
                <p className="text-gray-600 mt-2">Manage your availability and appointments</p>
              </div>
              <button
                onClick={() => setIsPopupOpen(true)}
                className="inline-flex items-center px-6 py-3 bg-blue text-white font-medium rounded-lg hover:bg-darkblue transition-colors"
              >
                <TfiPlus className="mr-2" />
                Add Time Slots
              </button>
            </div>
          </div>
        </div>

        {/* Clean Stats Cards */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-green-700 rounded"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.backgroundColor === 'green').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-red-700 rounded"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Booked Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.backgroundColor === 'red').length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-6 h-6 bg-blue rounded"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{events.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Calendar Section */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Weekly Schedule</h3>
                  <p className="text-gray-600 mt-1">
                    {currentWeekOffset === 0 
                      ? "Current Week" 
                      : currentWeekOffset > 0 
                        ? `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead`
                        : `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ago`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-700 rounded"></div>
                    <span className="text-sm text-gray-600">Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-700 rounded"></div>
                    <span className="text-sm text-gray-600">Booked</span>
                  </div>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Calendar Header */}
                  <div className="grid grid-cols-7 border-b border-gray-200 mb-4">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                      <div key={day} className="p-3 text-center">
                        <div className="text-sm font-semibold text-gray-700">{day}</div>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Body */}
                  <div className="grid grid-cols-7 gap-px bg-gray-200">
                    {(() => {
                      const weekDays = getCurrentWeekDates();

                      return weekDays.map((date, index) => {
                        // Fix: Use local date string to avoid timezone issues
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const day = String(date.getDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;
                        
                        const dayEvents = events.filter(event => event.start.startsWith(dateStr));
                        const isToday = new Date().toDateString() === date.toDateString();
                        
                        return (
                          <div 
                            key={index} 
                            className={`min-h-[140px] p-3 bg-white ${isToday ? 'bg-blue/5 ring-2 ring-blue/20' : ''}`}
                          >
                            {/* Date Display */}
                            <div className="text-center mb-3">
                              <span className={`text-lg font-semibold ${isToday ? 'text-blue' : 'text-gray-900'}`}>
                                {date.getDate()}
                              </span>
                              {(date.getDate() <= 7 || date.getDate() >= 25) && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {date.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                              )}
                            </div>
                            
                            {/* Time Slots */}
                            <div className="space-y-1">
                              {dayEvents.map((event) => {
                                const startTime = new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                const endTime = new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                                
                                const startDate = new Date(event.start);
                                const endDate = new Date(event.end);
                                const durationMinutes = (endDate - startDate) / (1000 * 60);
                                
                                const baseHeight = 48;
                                const slotHeight = Math.max((durationMinutes / 30) * baseHeight, 36);
                                
                                return (
                                  <div
                                    key={event.id}
                                    className={`relative rounded-lg p-3 text-white shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
                                      event.backgroundColor === 'green' 
                                        ? 'bg-green-600 border-green-700 hover:bg-green-700' 
                                        : 'bg-red-600 border-red-700 hover:bg-red-700'
                                    }`}
                                    style={{ height: `${slotHeight}px` }}
                                  >
                                    <div className="flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-bold">{startTime}</span>
                                          <span className="text-xs opacity-90">{endTime}</span>
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          event.backgroundColor === 'green'
                                            ? 'bg-green-700 text-green-100'
                                            : 'bg-red-700 text-red-100'
                                        }`}>
                                          {durationMinutes >= 60 
                                            ? `${Math.floor(durationMinutes / 60)}h${durationMinutes % 60 > 0 ? ` ${durationMinutes % 60}m` : ''}`
                                            : `${durationMinutes}m`
                                          }
                                        </div>
                                      </div>
                                      <div className="flex-1 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-center leading-tight">
                                          {event.title}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            
                            {/* Add Slot Button */}
                            {dayEvents.length === 0 && (
                              <button 
                                onClick={() => setIsPopupOpen(true)}
                                className="w-full mt-2 p-2 border border-dashed border-gray-300 rounded text-xs text-gray-500 hover:border-blue hover:text-blue transition-colors"
                              >
                                + Add Slot
                              </button>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <button 
                      onClick={goToPreviousWeek}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <span className="mr-2">←</span>
                      Previous Week
                    </button>
                    
                    <div className="text-center">
                      <div className="font-medium text-gray-900">
                        {getCurrentWeekRange()}
                      </div>
                      {currentWeekOffset !== 0 && (
                        <button
                          onClick={() => setCurrentWeekOffset(0)}
                          className="text-sm text-blue hover:text-darkblue mt-1"
                        >
                          Back to Current Week
                        </button>
                      )}
                    </div>
                    
                    <button 
                      onClick={goToNextWeek}
                      className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Next Week
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl z-10 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-darkblue via-blue to-darkblue2 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Add Time Slots</h3>
                  <p className="text-blue3/80 text-sm mt-1">Set up your availability</p>
                </div>
                <button 
                  onClick={() => setIsPopupOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <RxCross1 className="text-white text-lg" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              
              {/* Duration Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Meeting Duration
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[30, 60, 90, 120].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setDuration(mins)}
                      className={`px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all ${
                        duration === mins 
                          ? 'bg-blue text-white border-blue shadow-lg transform scale-105' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue hover:shadow-md'
                      }`}
                    >
                      <div className="font-semibold">
                        {mins === 30 ? '30min' : mins === 60 ? '1h' : mins === 90 ? '1.5h' : '2h'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-800">
                    Time Slots ({timeSlots.length})
                  </label>
                  <button
                    onClick={addNewTimeSlotRow}
                    className="flex items-center px-4 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors shadow-sm"
                  >
                    <TfiPlus className="mr-2 text-sm" />
                    Add Slot
                  </button>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <span className="text-sm font-medium text-gray-800">Slot {index + 1}</span>
                        </div>
                        {timeSlots.length > 1 && (
                          <button
                            onClick={() => removeTimeSlotRow(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <RxCross1 className="text-sm" />
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Date</label>
                          <input
                            type="date"
                            value={slot.date}
                            onChange={(e) => handleDateChange(index, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                          <input
                            type="time"
                            value={slot.startTime}
                            onChange={(e) => handleStartTimeChange(index, e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                          />
                        </div>
                      </div>
                      
                      {slot.startTime && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-800 font-medium">
                              End time: {calculateEndTime(slot.startTime)}
                            </span>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                              {duration}min
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {timeSlots.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <div className="text-gray-400 mb-3">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No time slots yet</h4>
                    <p className="text-gray-500 mb-4">Create your first availability slot</p>
                    <button
                      onClick={addNewTimeSlotRow}
                      className="px-4 py-2 bg-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add First Slot
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  {timeSlots.filter(slot => slot.date && slot.startTime).length} slot(s) ready to save
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveAllSlots}
                  className="px-5 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium shadow-sm"
                >
                  Save Time Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostCalendar;
