import React, { useState } from "react";
import { 
  FaUsers, 
  FaUserCheck, 
  FaUserTimes, 
  FaClipboardList,
  FaChevronDown,
  FaChevronUp,
  FaChartLine,
  FaUserEdit
} from "react-icons/fa";

const AdminDashboard = () => {
  const [showMore, setShowMore] = useState(false);

  const recentActivities = [
    { 
      id: 1, 
      message: "Admin Nick added a new staff member", 
      time: "8:00 AM",
      icon: <FaUsers className="text-blue-500" />,
      color: "bg-blue-100"
    },
    { 
      id: 2, 
      message: "Visitor Jane checked in", 
      time: "9:15 AM",
      icon: <FaUserCheck className="text-green-500" />,
      color: "bg-green-100"
    },
    { 
      id: 3, 
      message: "Monthly report generated", 
      time: "10:00 AM",
      icon: <FaClipboardList className="text-purple-500" />,
      color: "bg-purple-100"
    },
  ];

  const moreActivities = [
    { 
      id: 4, 
      message: "Logbook exported to PDF", 
      time: "11:20 AM",
      icon: <FaUserEdit className="text-indigo-500" />,
      color: "bg-indigo-100"
    },
    { 
      id: 5, 
      message: "User details updated", 
      time: "11:45 AM",
      icon: <FaUserEdit className="text-indigo-500" />,
      color: "bg-indigo-100"
    },
    { 
      id: 6, 
      message: "3 new visitors pre-registered", 
      time: "12:30 PM",
      icon: <FaUsers className="text-teal-500" />,
      color: "bg-teal-100"
    },
  ];

  const stats = [
    {
      title: "Visitors Today",
      value: 58,
      change: "+12%",
      changeColor: "text-green-500",
      icon: <FaUsers className="text-blue-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100"
    },
    {
      title: "Checked-In",
      value: 39,
      change: "+8%",
      changeColor: "text-green-500",
      icon: <FaUserCheck className="text-green-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100"
    },
    {
      title: "Checked-Out",
      value: 28,
      change: "-4%",
      changeColor: "text-red-500",
      icon: <FaUserTimes className="text-red-500 text-2xl" />,
      bgColor: "bg-gradient-to-br from-red-50 to-red-100"
    }
  ];

  return (
    <div className="pt-20 px-4 lg:px-20">
      <div className="min-h-screen bg-gray-50">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`${stat.bgColor} p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <div className="flex items-end mt-2">
                    <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
                    <span className={`ml-2 text-sm font-medium ${stat.changeColor} flex items-center`}>
                      <FaChartLine className="mr-1" /> {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white shadow-xs">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
            <button 
              onClick={() => setShowMore(!showMore)}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showMore ? (
                <>
                  <span>Show less</span>
                  <FaChevronUp className="ml-1" />
                </>
              ) : (
                <>
                  <span>Show more</span>
                  <FaChevronDown className="ml-1" />
                </>
              )}
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`${activity.color} p-2 rounded-lg mr-4`}>
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.message}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
            
            {/* Show more activities with simple toggle */}
            <div className={`space-y-4 transition-all duration-300 ${showMore ? 'block' : 'hidden'}`}>
              {moreActivities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className={`${activity.color} p-2 rounded-lg mr-4`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Content Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Visitor Trends</h3>
            <div className="h-64 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Chart visualization would go here</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600 flex flex-col items-center transition-colors">
                <FaUserCheck className="text-xl mb-2" />
                <span>Check In</span>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 flex flex-col items-center transition-colors">
                <FaClipboardList className="text-xl mb-2" />
                <span>Reports</span>
              </button>
              <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-600 flex flex-col items-center transition-colors">
                <FaUsers className="text-xl mb-2" />
                <span>Visitors</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;