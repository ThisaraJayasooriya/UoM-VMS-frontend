import React from "react";
import { TfiPlus } from "react-icons/tfi";

const CalendarHeader = ({ onAddTimeSlots }) => {
  return (
    <div className="bg-white border-b border-gray-200 mb-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
            <p className="text-gray-600 mt-2">Manage your availability and appointments</p>
          </div>
          <button
            onClick={onAddTimeSlots}
            className="inline-flex items-center px-6 py-3 bg-blue text-white font-medium rounded-lg hover:bg-darkblue transition-colors"
          >
            <TfiPlus className="mr-2" />
            Add Time Slots
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
