import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Notifications page for admins
const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        console.log("Auth token from localStorage:", token ? `Present: ${token.slice(0, 20)}...` : "Missing"); // Partial token log
        if (!token) {
          setError("No authentication token. Please log in.");
          setLoading(false);
          return;
        }
        const response = await fetch("http://localhost:5000/api/visitor/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        console.log("API response:", data); // Log full response
        if (!data.success) throw new Error(data.message || "Failed to fetch notifications");
        setNotifications(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err); // Log detailed error
        setError(err.message || "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Navigate back to dashboard
  const handleBackToDashboard = () => {
    navigate("/admin");
  };

  return (
    <div className="pt-20 px-4 lg:px-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#212A31]">All Notifications</h3>
          <button
            onClick={handleBackToDashboard}
            className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31] transition-colors border border-[#124E66] text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm text-[#748D92]">Loading notifications...</p>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className="flex items-start p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium text-[#212A31]">
                    {notification.message}
                  </p>
                  <p className="text-sm text-[#748D92]">
                    {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#748D92]">No notifications available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;