import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/notifications/all");
      const data = await response.json();
      setNotifications(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete a notification
  const deleteNotification = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="pt-20 px-4 lg:px-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-[#212A31]">All Notifications</h3>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31]"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-sm text-[#748D92]">No notifications available.</p>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className="flex justify-between items-center p-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-[#212A31]">{n.message}</p>
                <p className="text-xs text-[#748D92]">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => deleteNotification(n._id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
