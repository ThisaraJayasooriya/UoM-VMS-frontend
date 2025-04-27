import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaClipboardList
} from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const recentActivities = [
    { id: 1, message: "🛡️ Admin Nick added a new staff member (8:00 AM)" },
    { id: 2, message: "✅ Visitor Jane checked in (9:15 AM)" },
    { id: 3, message: "📊 Monthly report generated (10:00 AM)" },
  ];

  const moreActivities = [
    { id: 4, message: "📤 Logbook exported to PDF (11:20 AM)" },
    { id: 5, message: "📝 User details updated (11:45 AM)" },
    { id: 6, message: "👥 3 new visitors pre-registered (12:30 PM)" },
  ];

  return (
    <div className="pt-20 px-4 lg:px-20">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="bg-white p-10 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-100"
          onClick={() => navigate("/admin/admininsights")}
        >
          <h2 className="text-5xl font-bold text-blue-700">58</h2>
          <p className="text-md text-green-600">+12% vs. Yesterday</p>
          <p className="mt-3 text-gray-600">Visitors Today</p>
        </div>

        <div
          className="bg-white p-10 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-100"
          onClick={() => navigate("/admin/visitorlogbook")}
        >
          <h2 className="text-5xl font-bold text-green-700">39</h2>
          <p className="text-md text-green-600">+8% Check-Ins</p>
          <p className="mt-3 text-gray-600">Checked-In</p>
        </div>

        <div
          className="bg-white p-10 rounded-lg shadow-lg text-center cursor-pointer hover:bg-gray-100"
          onClick={() => navigate("/admin/visitorlogbook")}
        >
          <h2 className="text-5xl font-bold text-red-600">28</h2>
          <p className="text-md text-red-500">-4% Check-Outs</p>
          <p className="mt-3 text-gray-600">Checked-Out</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white p-10 rounded-lg shadow-lg mt-10 col-span-3">
        <h3 className="text-lg font-bold mb-5">Recent Activity</h3>
        <ul className="space-y-3 text-gray-600">
          {recentActivities.map((activity) => (
            <li key={activity.id}>{activity.message}</li>
          ))}
          {showMore &&
            moreActivities.map((activity) => <li key={activity.id}>{activity.message}</li>)}
        </ul>
        {!showMore && (
          <button
            className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700"
            onClick={() => setShowMore(true)}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
