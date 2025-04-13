import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegCalendarAlt,FaHistory, FaShareSquare} from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";



function VisitorDashboard() {
  const navigate = useNavigate(); 

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="flex items-center mt-10">
        <h2 className="text-3xl font-bold text-black ml-50">Hi Dula! </h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-8 max-w-[1300px] mx-auto">
        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => navigate('/visitor/appointment')} // Navigate to Appointment page
        >
          <FaRegCalendarAlt className='mr-2'/>
          Make an Appointment
        </div>

        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => navigate('/visitor/history')} // Navigate to Visit History page
        >
        
          <FaHistory className='mr-2'/>
          Visit History
        </div>

        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={() => navigate('/visitor/upcoming')} // Navigate to Upcoming Visits page
        >
          <FaShareSquare className='mr-2'/>
          Upcoming Visits
        </div>
        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer "
          onClick={() => navigate('/visitor/feedback')} // Navigate to provide feedback page
        >
        <VscFeedback className="mr-2 text-2xl font-bold" />
          Provide Feedback
        </div>
      </div>
    </div>
  );
}

export default VisitorDashboard;  