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
      icon: <FaUsers className="text-white" />,
      color: "bg-[#124E66] p-3"
    },
    {
      id: 2,
      message: "Visitor Jane checked in",
      time: "9:15 AM",
      icon: <FaUserCheck className="text-white" />,
      color: "bg-[#124E66] p-3"
    },
    {
      id: 3,
      message: "Monthly report generated",
      time: "10:00 AM",
      icon: <FaClipboardList className="text-white" />,
      color: "bg-[#124E66] p-3"
    }
  ];

  const moreActivities = [
    {
      id: 4,
      message: "Logbook exported to PDF",
      time: "11:20 AM",
      icon: <FaUserEdit className="text-white" />,
      color: "bg-[#124E66] p-3"
    },
    {
      id: 5,
      message: "User details updated",
      time: "11:45 AM",
      icon: <FaUserEdit className="text-white" />,
      color: "bg-[#124E66] p-3"
    },
    {
      id: 6,
      message: "3 new visitors pre-registered",
      time: "12:30 PM",
      icon: <FaUsers className="text-white" />,
      color: "bg-[#124E66] p-3"
    }
  ];

  const stats = [
    {
      title: "Visitors Today",
      value: 58,
      change: "+12%",
      changeColor: "text-white",
      icon: <FaUsers className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"



    },
    {
      title: "Checked-In",
      value: 39,
      change: "+8%",
      changeColor: "text-white",
      icon: <FaUserCheck className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"

    },
    {
      title: "Checked-Out",
      value: 28,
      change: "-4%",
      changeColor: "text-white",
      icon: <FaUserTimes className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"

    }
  ];

  return (
    <div className="pt-20 px-4 lg:px-10 ">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.bgColor} p-6 rounded-xl shadow-sm border border-[#124E66] transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-100">{stat.title}</p>
                <div className="flex items-end mt-2">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <span className={`ml-2 text-sm font-medium ${stat.changeColor} flex items-center`}>
                    <FaChartLine className="mr-1" /> {stat.change}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-white bg-opacity-20 shadow-xs border border-[#124E66]">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#212A31]">Recent Activity</h3>
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center text-sm text-[#124E66] hover:text-[#212A31] transition-colors"
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
            <div key={activity.id} className="flex items-start p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <div className={`${activity.color} rounded-lg mr-4 flex items-center justify-center`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#212A31]">{activity.message}</p>
                <p className="text-sm text-[#212A31]">{activity.time}</p>
              </div>
            </div>
          ))}

          {showMore && moreActivities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <div className={`${activity.color} rounded-lg mr-4 flex items-center justify-center`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#212A31]">{activity.message}</p>
                <p className="text-sm text-[#212A31]">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
          <h3 className="text-lg font-semibold text-[#212A31] mb-4">Visitor Trends</h3>
          <div className="h-64 bg-gradient-to-br from-[#212A31] to-[#124E66] rounded-lg flex items-center justify-center border border-[#124E66]">
            <p className="text-white">Chart visualization would go here</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
          <h3 className="text-lg font-semibold text-[#212A31] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
              <FaUserCheck className="text-xl mb-2" />
              <span>Check In</span>
            </button>
            <button className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
              <FaClipboardList className="text-xl mb-2" />
              <span>Reports</span>
            </button>
            <button className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
              <FaUsers className="text-xl mb-2" />
              <span>Visitors</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
