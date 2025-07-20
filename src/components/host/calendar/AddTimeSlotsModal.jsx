import React from "react";
import { TfiPlus } from "react-icons/tfi";
import { RxCross1 } from "react-icons/rx";

const AddTimeSlotsModal = ({
  isOpen,
  duration,
  timeSlots,
  onClose,
  onDurationChange,
  onDateChange,
  onStartTimeChange,
  onAddSlotRow,
  onRemoveSlotRow,
  onSaveSlots,
  calculateEndTime
}) => {
  if (!isOpen) return null;

  return (
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
              onClick={onClose}
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
                  onClick={() => onDurationChange(mins)}
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
                onClick={onAddSlotRow}
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
                        onClick={() => onRemoveSlotRow(index)}
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
                        onChange={(e) => onDateChange(index, e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Start Time</label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => onStartTimeChange(index, e.target.value)}
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
                  onClick={onAddSlotRow}
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
              onClick={onClose}
              className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSaveSlots}
              className="px-5 py-2 bg-blue text-white rounded-lg hover:bg-darkblue transition-colors font-medium shadow-sm"
            >
              Save Time Slots
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTimeSlotsModal;
