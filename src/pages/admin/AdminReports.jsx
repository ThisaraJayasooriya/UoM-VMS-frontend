import React from "react";
import { 
  FaBook,
  FaHistory,
  FaStar,
  FaArrowRight
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminReports = () => {
  const navigate = useNavigate();

  const reportCards = [
    {
      title: "Visitor Logbook",
      description: "Access and manage all visitor entries with detailed records",
      icon: <FaBook className="text-indigo-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      path: "/admin/visitorlogbook"
    },
    {
      title: "Visitor History Report",
      description: "Generate comprehensive historical visitor analytics",
      icon: <FaHistory className="text-purple-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      path: "/admin/visitorhistoryreport"
    },
    {
      title: "Visitors' Feedback Review",
      description: "View and analyze visitor feedback and ratings",
      icon: <FaStar className="text-yellow-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      path: "/admin/visitorfeedbackreview"
    }
  ];

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="min-h-screen bg-gray-50">
        {/* Advanced Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 max-w-6xl mx-auto">
          {reportCards.map((card, index) => (
            <div 
              key={index}
              className="group relative cursor-pointer"
              onClick={() => handleCardClick(card.path)}
            >
              <div className={`absolute inset-0 ${card.bgColor} rounded-xl shadow-sm transition-all duration-500 group-hover:shadow-lg group-hover:-translate-y-1`}></div>
              
              <div className="relative block p-6 h-full">
                <div className="flex justify-between items-start h-full">
                  <div className="z-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                      {card.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-6 group-hover:text-gray-700 transition-colors">
                      {card.description}
                    </p>
                    <div className="inline-flex items-center text-indigo-600 font-medium text-sm transition-all group-hover:translate-x-1">
                      Access report
                      <FaArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white shadow-xs group-hover:shadow-sm transition-all z-10">
                    {card.icon}
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
                <div className="absolute top-0 left-0 w-8 h-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300 bg-white"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;