import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClipboardList,
  FaCalendarDay, 
  FaSpinner,
  FaBell,
  FaPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [todayStats, setTodayStats] = useState({
    expectedVisitorsToday: 0,
    totalCheckedIn: 0,
    totalCheckedOut: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [userSummary, setUserSummary] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch today visitor stats + today appointments
  useEffect(() => {
    // Fetch today visitors
    fetch("http://localhost:5000/api/security/stats")
      .then((res) => res.json())
      .then((data) => {
        setTodayStats({
          expectedVisitorsToday: data.expectedVisitorsToday || 0,
          totalCheckedIn: data.totalCheckedIn || 0,
          totalCheckedOut: data.totalCheckedOut || 0,
        });
      })
      .catch((err) => console.error("Error fetching visitor stats:", err));

    // Fetch today appointments
    fetch("http://localhost:5000/api/appointment/today/count")
      .then((res) => res.json())
      .then((data) => setTodayAppointments(data.todayAppointments || 0))
      .catch((err) => console.error("Error fetching today appointments:", err));
  }, []);

  // ✅ Fetch User Summary Counts
  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/users/counts");
        const data = await response.json();

        if (!response.ok || !data.success)
          throw new Error(data.message || "Failed to fetch counts");

        setUserSummary([
          { type: "Admins", count: data.data.admins, color: "bg-[#124E66]" },
          { type: "Hosts", count: data.data.hosts, color: "bg-[#2E6B82]" },
          { type: "Security", count: data.data.security, color: "bg-[#5D8696]" },
          { type: "Visitors", count: data.data.visitors, color: "bg-[#B0B7BD]" },
        ]);
      } catch (err) {
        console.error(err);
        setError("Failed to load user summary. Please try again later.");
        setUserSummary([
          { type: "Admins", count: 0, color: "bg-[#124E66]" },
          { type: "Hosts", count: 0, color: "bg-[#2E6B82]" },
          { type: "Security", count: 0, color: "bg-[#5D8696]" },
          { type: "Visitors", count: 0, color: "bg-[#B0B7BD]" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserSummary();
  }, []);

  // ✅ Fetch 5 latest notifications for "Recent Activity"
  useEffect(() => {
    const fetchLatestNotifications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/notifications/latest");
        const data = await res.json();

        if (data.success) {
          const formatted = data.data.map((notif) => ({
            id: notif._id,
            message: notif.message,
            time: new Date(notif.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            icon: <FaBell className="text-white" />,
            color: "bg-[#124E66] p-3",
          }));
          setRecentActivities(formatted);
        }
      } catch (error) {
        console.error("❌ Failed to fetch latest notifications", error);
      }
    };
    fetchLatestNotifications();
  }, []);

  const handleShowMore = () => {
    navigate("/admin/notifications");
  };

  // ✅ Top 4 cards
  const todayCards = [
    {
      title: "Expected Visitors Today",
      value: todayStats.expectedVisitorsToday,
      icon: <FaUsers className="text-[#124E66] text-2xl" />,
    },
    {
      title: "Checked-In Today",
      value: todayStats.totalCheckedIn,
      icon: <FaUserCheck className="text-[#124E66] text-2xl" />,
    },
    {
      title: "Checked-Out Today",
      value: todayStats.totalCheckedOut,
      icon: <FaUserTimes className="text-[#124E66] text-2xl" />,
    },
    {
      title: "Appointments Requested Today",
      value: todayAppointments,
      icon: <FaClipboardList className="text-[#124E66] text-2xl" />,
    },
  ];

  return (
    <div className="pt-20 px-4 lg:px-10">
      {/* ✅ TODAY STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {todayCards.map((stat, index) => (
          <div
            key={index}
            className="bg-[linear-gradient(to_right,rgba(33,42,49,0.90),rgba(18,78,102,0.90))] p-6 rounded-xl shadow-sm border border-[#124E66] transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-white"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-100">{stat.title}</p>
                <div className="flex items-end mt-2">
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  {/* ✅ updated mini-icon label */}
                  <span className="ml-2 text-sm font-medium text-white flex items-center">
                    <FaCalendarDay className="mr-1" /> Today
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

      {/* ✅ Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#212A31]">Recent Activity</h3>
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31] transition-colors border border-[#124E66] text-sm font-medium"
          >
            Show More
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <p className="text-gray-500 text-sm">No recent activities</p>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start p-3 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <div
                  className={`${activity.color} rounded-lg mr-4 flex items-center justify-center`}
                >
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#212A31]">{activity.message}</p>
                  <p className="text-sm text-[#748D92]">{activity.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ✅ User Summary */}
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
                <div
                  className={`${user.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2`}
                >
                  <span className="text-white font-bold">{user.count}</span>
                </div>
                <p className="text-sm text-[#212A31]">{user.type}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <h3 className="text-xl font-semibold text-[#212A31]">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <a
            href="/admin/userdetails/add-admin"
            className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]"
          >
            <FaPlus className="text-xl mb-2" />
            <span>Add Admin</span>
          </a>
          <a
            href="/admin/userdetails/add-host"
            className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]"
          >
            <FaPlus className="text-xl mb-2" />
            <span>Add Host</span>
          </a>
          <a
            href="/admin/userdetails/add-security"
            className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]"
          >
            <FaPlus className="text-xl mb-2" />
            <span>Add Security</span>
          </a>
          <a
            href="/admin/visitorlogbook"
            className="p-4 bg-[#124E66] hover:bg-[#212A31] rounded-lg text-white flex flex-col items-center transition-colors border border-[#124E66]"
          >
            <FaClipboardList className="text-xl mb-2" />
            <span>View Logbook</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
