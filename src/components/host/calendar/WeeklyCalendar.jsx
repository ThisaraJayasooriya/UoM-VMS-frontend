import React from "react";
import TimeSlotCard from "./TimeSlotCard";

const WeeklyCalendar = ({ 
  events, 
  currentWeekOffset, 
  onSlotClick, 
  onAddTimeSlots,
  onPreviousWeek,
  onNextWeek,
  onCurrentWeek 
}) => {
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

  // Get current week range text
  const getCurrentWeekRange = () => {
    const weekDays = getCurrentWeekDates();
    const startOfWeek = weekDays[0];
    const endOfWeek = weekDays[6];
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Weekly Schedule</h3>
              <p className="text-gray-600 mt-1">
                {currentWeekOffset === 0 
                  ? "Current Week - Click available slots to delete" 
                  : currentWeekOffset > 0 
                    ? `${currentWeekOffset} week${currentWeekOffset > 1 ? 's' : ''} ahead - Click available slots to delete`
                    : `${Math.abs(currentWeekOffset)} week${Math.abs(currentWeekOffset) > 1 ? 's' : ''} ago - Click available slots to delete`
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-700 rounded"></div>
                <span className="text-sm text-gray-600">Available (Click to delete)</span>
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
                          {dayEvents.map((event) => (
                            <TimeSlotCard 
                              key={event.id}
                              event={event}
                              onSlotClick={onSlotClick}
                            />
                          ))}
                        </div>
                        
                        {/* Add Slot Button */}
                        {dayEvents.length === 0 && (
                          <button 
                            onClick={onAddTimeSlots}
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
                  onClick={onPreviousWeek}
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
                      onClick={onCurrentWeek}
                      className="text-sm text-blue hover:text-darkblue mt-1"
                    >
                      Back to Current Week
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={onNextWeek}
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
  );
};

export default WeeklyCalendar;
