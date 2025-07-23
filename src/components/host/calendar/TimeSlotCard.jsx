import React from "react";

const TimeSlotCard = ({ event, onSlotClick }) => {
  const startTime = new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const endTime = new Date(event.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const durationMinutes = (endDate - startDate) / (1000 * 60);
  
  const baseHeight = 48;
  const slotHeight = Math.max((durationMinutes / 30) * baseHeight, 36);
  
  return (
    <div
      onClick={() => onSlotClick(event)}
      className={`relative rounded-lg p-3 text-white shadow-sm border-l-4 transition-all duration-200 hover:shadow-md ${
        event.backgroundColor === 'green' 
          ? 'bg-green-600 border-green-700 hover:bg-green-700 cursor-pointer hover:scale-105' 
          : 'bg-red-600 border-red-700 hover:bg-red-700 cursor-default'
      }`}
      style={{ height: `${slotHeight}px` }}
      title={event.backgroundColor === 'green' ? 'Click to delete this time slot' : 'This slot is booked'}
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
        {event.backgroundColor === 'green' && (
          <div className="absolute top-1 right-1 opacity-60">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012-2h4l-1.5 1.5a.5.5 0 000 .707L14 8.707 11.293 11.414a1 1 0 01-1.414-1.414L12.586 7H10a1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSlotCard;
