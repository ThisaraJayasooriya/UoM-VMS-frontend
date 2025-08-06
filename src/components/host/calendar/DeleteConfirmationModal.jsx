import React from "react";
import { RxCross1 } from "react-icons/rx";

const DeleteConfirmationModal = ({ 
  isOpen, 
  selectedSlot, 
  isDeleting, 
  onConfirm, 
  onCancel 
}) => {
  if (!isOpen || !selectedSlot) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-sm"></div>

      <div className="relative bg-white p-6 rounded-lg w-115 z-10 shadow-lg border-black border-solid border-1">
        <button
          onClick={onCancel}
          disabled={isDeleting}
          className="absolute top-2 right-2 text-white px-4 py-2 rounded hover:bg-gray-300 transition duration-300 cursor-pointer disabled:cursor-not-allowed"
        >
          <RxCross1 className="text-black text" />
        </button>
        
        <h3 className="text-2xl font-bold mb-4 flex justify-center m-1 text-red-600">
          Delete Time Slot
        </h3>
        
        {/* Warning Section */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <span className="text-red-600 text-2xl mr-2">⚠️</span>
            <h4 className="text-lg font-semibold text-red-800">
              Confirm Deletion
            </h4>
          </div>
          <p className="text-red-700">
            The time slot will be removed from your calendar.
          </p>
        </div>

        {/* Time Slot Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Time Slot Details:</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Date:</span> {new Date(selectedSlot.start).toLocaleDateString()}</p>
            <p><span className="font-medium">Time:</span> {new Date(selectedSlot.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedSlot.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Available</span></p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Keep Time Slot
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Deleting...
              </>
            ) : (
              'Yes, Delete Time Slot'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
