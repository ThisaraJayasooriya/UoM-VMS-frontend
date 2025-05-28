import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt, FaHistory, FaShareSquare, FaClock } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";

function VisitorDashboard() {
  const [userName, setUserName] = useState("");


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser && storedUser.username) {
      setUserName(storedUser.username);
    }
  }, []);

  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    navigate("/visitor/appointment");
  };

  const handleHistoryClick = () => {
    navigate("/visitor/history");
  };

  const handleUpcommingClick = () => {
    navigate("/visitor/Status");
  };

  const handleFeedbackClick = () => {
    navigate("/visitor/feedback");
  };

  const handleHostAvailableTimeClick = () => {
    navigate("/visitor/HostAvailableTime");
  };

  const dashboardCards = [
    {
      id: 1,
      title: "Make an Appointment",
      icon: <FaRegCalendarAlt className="text-blue-500 text-4xl" />,
      action: handleAppointmentClick,
    },
    {
      id: 2,
      title: "Host Available Time Slot",
      icon: <FaClock className="text-green-500 text-4xl" />,
      action: handleHostAvailableTimeClick,
    },
    {
      id: 3,
      title: "Visit History",
      icon: <FaHistory className="text-yellow-500 text-4xl" />,
      action: handleHistoryClick,
    },
    {
      id: 4,
      title: "Provide Feedback",
      icon: <VscFeedback className="text-pink-500 text-4xl" />,
      action: handleFeedbackClick,
    },
    {
      id: 5,
      title: "Appointment Status",
      icon: <FaShareSquare className="text-purple-500 text-4xl" />,
      action: handleUpcommingClick,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 lg:px-24 mt-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {userName} 👋</h1>
        <p className="text-lg text-gray-500">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            onClick={card.action}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer group hover:scale-105"
          >
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center mb-5 group-hover:border-blue2 transition-colors duration-300">
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-700 group-hover:text-blue transition-colors duration-300">
              {card.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VisitorDashboard;
