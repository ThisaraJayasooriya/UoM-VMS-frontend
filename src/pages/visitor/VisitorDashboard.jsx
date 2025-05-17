import React from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt, FaHistory, FaShareSquare } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";
import { useState, useEffect } from "react";

function VisitorDashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.username) {
      setUserName(storedUser.username);
    }
  }, []);
  const navigate = useNavigate();
  const handleAppointmentClick = () => {
    navigate("/visitor/appointment", {
      state: {
        name: "Make an Appointment",
      },
    });
  };

  const handleHistoryClick = () => {
    navigate("/visitor/history", {
      state: {
        name: "Visit History",
      },
    });
  };
  const handleUpcommingClick = () => {
    navigate("/visitor/Status", {
      state: {
        name: "Appointment Status",
      },
    });
  };
  const handleFeedbackClick = () => {
    navigate("/visitor/feedback", {
      state: {
        name: "Provide Feedback",
      },
    });
  };
  const handleHostAvailableTimeClick = () => {
    navigate("/visitor/HostAvailableTime", {
      state: {
        name: "Host Available Time Slot",
      },
    });
  };
  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="flex items-center mt-10">
      <h2 className="text-3xl font-bold text-black ml-50">Hi {userName}!</h2>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-8 max-w-[1300px] mx-auto">
        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={handleAppointmentClick} // Navigate to Appointment page
        >
          <FaRegCalendarAlt className="mr-2" />
          Make an Appointment
        </div>

        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={handleHostAvailableTimeClick} // Navigate to Appointment page
        >
          <FaRegCalendarAlt className="mr-2" />
          Host Available Time Slot
        </div>

        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={handleHistoryClick} // Navigate to Visit History page
        >
          <FaHistory className="mr-2" />
          Visit History
        </div>

        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer "
          onClick={handleFeedbackClick} // Navigate to provide feedback page
        >
          <VscFeedback className="mr-2 text-2xl font-bold" />
          Provide Feedback
        </div>
        <div
          className="bg-[#748D92] p-4 rounded-lg shadow-md w-[430px] h-[180px] flex items-center justify-center text-xl font-semibold text-gray-700 cursor-pointer"
          onClick={handleUpcommingClick} // Navigate to Upcoming Visits page
        >
          <FaShareSquare className="mr-2" />
          Appointment Status
        </div>
      </div>
    </div>
  );
}

export default VisitorDashboard;
