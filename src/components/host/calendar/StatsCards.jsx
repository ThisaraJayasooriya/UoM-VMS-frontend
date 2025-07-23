import React from "react";

const StatsCards = ({ events }) => {
  const availableSlots = events.filter(e => e.backgroundColor === 'green').length;
  const bookedSlots = events.filter(e => e.backgroundColor === 'red').length;
  const totalSlots = events.length;

  return (
    <div className="max-w-7xl mx-auto px-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-700 rounded"></div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">{availableSlots}</p>
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
              <p className="text-2xl font-bold text-gray-900">{bookedSlots}</p>
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
              <p className="text-2xl font-bold text-gray-900">{totalSlots}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
