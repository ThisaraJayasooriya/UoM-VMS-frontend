import React, { useState, useEffect } from "react";
import { FaUserCheck, FaSearch, FaCheck, FaTimes, FaUserSlash, FaExclamationTriangle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccessControl = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", reason: "", customReason: "" });

  // Fetch blocked users
  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/staff/blocked");
      const data = await response.json();
      setBlockedUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      setBlockedUsers([]);
      toast.error("❌ Failed to load blocked users", { icon: false });
    }
    setIsLoading(false);
  };

  // Fetch visitor report notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications/all");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const visitorNotifications = (data.data || []).filter((n) => n.type === "visitor");
      setNotifications(visitorNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("❌ Failed to load notifications", { icon: false });
      setNotifications([]);
    }
  };

  // Decline a notification
  const declineNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      toast.success("✅ Notification declined successfully!", { icon: false });
    } catch (error) {
      console.error("Failed to decline notification:", error);
      toast.error("❌ Failed to decline notification", { icon: false });
    }
  };

  // Handle Blocking
  const handleBlockUser = async (e) => {
    e.preventDefault();
    let finalReason = newUser.reason === "other" ? newUser.customReason : newUser.reason;

    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.role.trim() || !finalReason.trim()) {
      toast.error("❌ Please fill all required fields!", { icon: false });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/staff/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          reason: finalReason,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("✅ User blocked successfully!", { icon: false });
        setNewUser({ name: "", email: "", role: "", reason: "", customReason: "" });
        fetchBlockedUsers();
      } else {
        toast.error(data.message || "❌ Failed to block user", { icon: false });
      }
    } catch (error) {
      toast.error("❌ Error blocking user", { icon: false });
      console.error("Error blocking user:", error);
    }
  };

  // Handle Unblocking
  const handleUnblockUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/blocked/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBlockedUsers(blockedUsers.filter((user) => user._id !== userId));
        toast.success("✅ User unblocked successfully!", { icon: false });
      } else {
        toast.error(data.message || "❌ Failed to unblock user", { icon: false });
      }
    } catch (error) {
      toast.error("❌ Error unblocking user", { icon: false });
      console.error("Error unblocking user:", error);
    }
  };

  // Search filter for blocked users
  const filteredUsers = blockedUsers.filter(
    (user) =>
      (user.name || `${user.firstName} ${user.lastName}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Parse notification message
  const parseNotificationMessage = (message) => {
    try {
      if (message.startsWith("Visitor Report:")) {
        const parts = message.split(" (Visitor: ");
        const reportDetails = parts[0].replace("Visitor Report: ", "");
        const [category, reason] = reportDetails.split(" - ");
        const visitorInfo = parts[1]?.split(", Email: ");
        const visitorName = visitorInfo[0]?.trim() || "Unknown";
        const email = visitorInfo[1]?.replace(")", "").trim() || "";
        return { category: category || "N/A", reason: reason || "N/A", visitorName, email };
      }
      return { category: "N/A", reason: message, visitorName: "Unknown", email: "" };
    } catch (error) {
      console.error("Error parsing notification message:", error, message);
      return { category: "N/A", reason: message, visitorName: "Unknown", email: "" };
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 md:p-8 lg:p-20 max-w-7xl mx-auto">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Blocked Users Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#124E66] flex items-center">
          <div className="bg-[#eaf4ff] p-4 rounded-full mr-4">
            <FaUserSlash className="text-2xl text-[#124E66]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#6b7280]">Blocked Users</h3>
            <p className="text-2xl font-semibold text-[#212A31]">{blockedUsers.length}</p>
          </div>
        </div>
        
        {/* Reported Visitors Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-[#124E66] flex items-center">
          <div className="bg-[#eaf4ff] p-4 rounded-full mr-4">
            <FaExclamationTriangle className="text-2xl text-[#124E66]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#6b7280]">Reported Visitors</h3>
            <p className="text-2xl font-semibold text-[#212A31]">{notifications.length}</p>
          </div>
        </div>
      </div>

      {/* Blocked Users Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-[#124E66] mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#212A31]">Blocked Users</h2>
          </div>
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-[#124E66]" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#124E66]"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-10 bg-[#f8fafc] rounded-lg">
            <FaUserCheck className="mx-auto text-4xl text-[#124E66] mb-4" />
            <p className="text-lg text-[#212A31] font-medium">No blocked users found</p>
            <p className="text-sm text-[#6b7280] mt-1">
              {searchTerm ? "Try a different search term" : "All users have access"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-sm text-white bg-[#124E66] rounded-lg hover:bg-[#0d3a4d] transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D3D9D2]">
              <thead className="bg-[#124E66]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Blocked On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#aec9ff]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#212A31]">
                      {user.name || `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-[#e0f2fe] text-[#0369a1]' :
                        user.role === 'security' ? 'bg-[#ecfccb] text-[#65a30d]' :
                        user.role === 'host' ? 'bg-[#f0f9ff] text-[#0c4a6e]' :
                        'bg-[#f5f3ff] text-[#5b21b6]'
                      }`}>
                        {user.role || "visitor"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                      {new Date(user.blockedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#212A31] max-w-xs truncate">{user.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                      <button
                        onClick={() => handleUnblockUser(user._id)}
                        className="px-3 py-1 bg-[#e0f2fe] text-[#124E66] rounded-md hover:bg-[#bae6fd] transition-colors flex items-center"
                      >
                        <FaCheck className="mr-1" /> Unblock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reported Visitors Table */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-[#124E66] mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#212A31]">Reported Visitors</h2>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center py-10 bg-[#f8fafc] rounded-lg">
            <FaUserCheck className="mx-auto text-4xl text-[#124E66] mb-4" />
            <p className="text-lg text-[#212A31] font-medium">No reported visitors</p>
            <p className="text-sm text-[#6b7280] mt-1">All visitors are currently in good standing</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D3D9D2]">
              <thead className="bg-[#124E66]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Visitor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Reported On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#aec9ff]">
                {notifications.map((notification) => {
                  const parsed = parseNotificationMessage(notification.message);
                  return (
                    <tr key={notification._id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#212A31]">
                        {parsed.visitorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">{parsed.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                        <span className="px-2 py-1 text-xs rounded-full bg-[#fee2e2] text-[#b91c1c]">
                          {parsed.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#212A31] max-w-xs">{parsed.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#212A31]">
                        <button
                          onClick={() => declineNotification(notification._id)}
                          className="px-3 py-1 bg-[#fee2e2] text-[#b91c1c] rounded-md hover:bg-[#fecaca] transition-colors flex items-center"
                        >
                          <FaTimes className="mr-1" /> Decline
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Block New User Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-[#124E66]">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#212A31]">Block New User</h2>
          <p className="text-sm text-[#6b7280]">Restrict access for problematic users</p>
        </div>
        
        <form onSubmit={handleBlockUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#212A31] mb-1">Name *</label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#212A31] mb-1">Email *</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#212A31] mb-1">Role *</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
                required
              >
                <option value="">Select a role</option>
                <option value="visitor">Visitor</option>
                <option value="host">Host</option>
                <option value="security">Security</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#212A31] mb-1">Reason for Blocking *</label>
              <select
                value={newUser.reason}
                onChange={(e) => setNewUser({ ...newUser, reason: e.target.value })}
                className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                <option value="suspicious">Suspicious Activity</option>
                <option value="violation">Policy Violation</option>
                <option value="spam">Spam/Abuse</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {newUser.reason === "other" && (
              <div>
                <label className="block text-sm font-medium text-[#212A31] mb-1">Custom Reason *</label>
                <input
                  type="text"
                  value={newUser.customReason}
                  onChange={(e) => setNewUser({ ...newUser, customReason: e.target.value })}
                  className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66] focus:border-transparent"
                  required
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#0d3a4d] transition-colors flex items-center shadow-sm"
            >
              <FaCheck className="mr-2" /> Block User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessControl;