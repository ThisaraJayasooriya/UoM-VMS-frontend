import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegCalendarAlt, FaHistory, FaShareSquare, FaClock } from "react-icons/fa";
import { VscFeedback } from "react-icons/vsc";

function VisitorDashboard() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser?.username) {
      setUserName(storedUser.username);
    }
  }, []);

  // 🔁 Generic click handler
  const handleCardClick = (title, path) => {
    localStorage.setItem("name", title);
    navigate(path);
  };
   localStorage.setItem("name", "Dashboard");

  // 💡 Dashboard items
  const dashboardCards = [
    {
      id: 1,
      title: "Make an Appointment",
      icon: <FaRegCalendarAlt className="text-blue-500 text-4xl" />,
      path: "/visitor/appointment",
    },
    {
      id: 2,
      title: "Host Available Time Slot",
      icon: <FaClock className="text-green-500 text-4xl" />,
      path: "/visitor/HostAvailableTime",
    },
    {
      id: 3,
      title: "Visit History",
      icon: <FaHistory className="text-yellow-500 text-4xl" />,
      path: "/visitor/history",
    },
    {
      id: 4,
      title: "Provide Feedback",
      icon: <VscFeedback className="text-pink-500 text-4xl" />,
      path: "/visitor/feedback",
    },
    {
      id: 5,
      title: "Appointment Status",
      icon: <FaShareSquare className="text-purple-500 text-4xl" />,
      path: "/visitor/Status",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-6 lg:px-24 mt-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {userName} !</h1>
        <p className="text-lg text-gray-500">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {dashboardCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.title, card.path)}
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
