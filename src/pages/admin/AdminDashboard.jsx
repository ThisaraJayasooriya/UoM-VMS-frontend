import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClipboardList,
  FaChevronDown,
  FaChartPie,
  FaExclamationCircle,
  FaPlus,
  FaLaptop,
  FaBell,
  FaChartLine,
  FaSpinner
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const AdminDashboard = () => {
  const navigate = useNavigate(); // Hook for navigation
  const [userSummary, setUserSummary] = useState([]); // State for storing user summary data
  const [error, setError] = useState(null); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indicator

  // Static statistics data for dashboard cards
  const stats = [
    {
      title: "Visitors Today",
      value: 58,
      change: "+12%",
      icon: <FaUsers className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"
    },
    {
      title: "Checked-In",
      value: 39,
      change: "+8%",
      icon: <FaUserCheck className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"
    },
    {
      title: "Checked-Out",
      value: 28,
      change: "-4%",
      icon: <FaUserTimes className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"
    },
    {
      title: "Pending Actions",
      value: 5,
      change: "+2%",
      icon: <FaExclamationCircle className="text-[#124E66] text-2xl" />,
      bgColor: "bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))]"
    }
  ];

  // Recent activities data (first 3 notifications matching Notifications.jsx)
  const recentActivities = [
    { id: 1, message: "Admin Nick added a new staff member", time: "8:00 AM", icon: <FaUsers className="text-white" />, color: "bg-[#124E66] p-3" },
    { id: 2, message: "Visitor Jane checked in", time: "9:15 AM", icon: <FaUserCheck className="text-white" />, color: "bg-[#124E66] p-3" },
    { id: 3, message: "Monthly report generated", time: "10:00 AM", icon: <FaClipboardList className="text-white" />, color: "bg-[#124E66] p-3" }
  ];

  // Fetch user summary data from API on component mount
  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/users/counts");
        const data = await response.json();
        console.log("Response:", data); // Debug log
        
        if (!response.ok || !data.success) throw new Error(data.message || "Failed to fetch counts");

        setUserSummary([
          { type: "Admins", count: data.data.admins, color: "bg-[#124E66]" },
          { type: "Hosts", count: data.data.hosts, color: "bg-[#2E6B82]" },
          { type: "Security", count: data.data.security, color: "bg-[#5D8696]" },
          { type: "Visitors", count: data.data.visitors, color: "bg-[#B0B7BD]" }
        ]);
      } catch (err) {
        setError("Failed to load user summary. Please try again later.");
        setUserSummary([
          { type: "Admins", count: 0, color: "bg-[#124E66]" },
          { type: "Hosts", count: 0, color: "bg-[#2E6B82]" },
          { type: "Security", count: 0, color: "bg-[#5D8696]" },
          { type: "Visitors", count: 0, color: "bg-[#B0B7BD]" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSummary();
  }, []);

  // Function to handle "Show more" redirection
  const handleShowMore = () => {
    navigate("/notifications");
  };

  return (
    <div className="pt-20 px-4 lg:px-10">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  <span className="ml-2 text-sm font-medium text-white flex items-center">
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

{/* Recent Activities Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#212A31]">Recent Activity</h3>
          {/* Styled button for "Show more" */}
          <button
            onClick={handleShowMore} // Redirect to notifications page
            className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31] transition-colors border border-[#124E66] text-sm font-medium"
          >
            Show More
          </button>
          

        </div>
        <div className="space-y-4">
          {/* Display recent activities */}
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start p-3 hover:bg-blue-50 rounded-lg transition-colors">
              <div className={`${activity.color} rounded-lg mr-4 flex items-center justify-center`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-[#212A31]">{activity.message}</p>
                <p className="text-sm text-[#748D92]">{activity.time}</p>
              </div>
            </div>
          ))}
          
        </div>
      </div>
      {/* User Summary Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <h3 className="text-xl font-semibold text-[#212A31]">User Summary</h3>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {loading ? (
          <div className="flex justify-center mt-4">
            <FaSpinner className="animate-spin text-[#124E66] text-2xl" />
          </div>
        ) : (
          <div className="flex justify-around mt-4">
            {userSummary.map((user, index) => (
              <div key={index} className="text-center">
                <div className={`${user.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <span className="text-white font-bold">{user.count}</span>
                </div>
                <p className="text-sm text-[#212A31]">{user.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <h3 className="text-xl font-semibold text-[#212A31]">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <a href="/admin/userdetails/add-admin" className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
            <FaPlus className="text-xl mb-2" />
            <span>Add Admin</span>
          </a>
          <a href="/admin/userdetails/add-host" className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
            <FaPlus className="text-xl mb-2" />
            <span>Add Host</span>
          </a>
          <a href="/admin/userdetails/add-security" className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
            <FaPlus className="text-xl mb-2" />
            <span>Add Security</span>
          </a>
          <a href="/admin/visitorlogbook" className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]">
            <FaClipboardList className="text-xl mb-2" />
            <span>View Logbook</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;