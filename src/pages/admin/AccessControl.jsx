import React, { useState, useEffect } from "react";
import { FaUserCheck, FaSearch, FaBan, FaCheck } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccessControl = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: "", role: "", reason: "", customReason: "" });

  // ✅ Fetch blocked users
  const fetchBlockedUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/staff/blocked");
      const data = await response.json();
      setBlockedUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      setBlockedUsers([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  // ✅ Handle Unblocking
  const handleUnblockUser = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/blocked/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setBlockedUsers(blockedUsers.filter((user) => user._id !== userId));
        toast.success("✅ User unblocked successfully!");
      } else {
        toast.error(data.message || "❌ Failed to unblock user");
      }
    } catch (error) {
      toast.error("❌ Error unblocking user");
      console.error("Error unblocking user:", error);
    }
  };

  // ✅ Handle Blocking
  const handleBlockUser = async (e) => {
    e.preventDefault();

    let finalReason = newUser.reason === "other" ? newUser.customReason : newUser.reason;

    if (!finalReason.trim()) {
      toast.error("❌ Please enter a reason for blocking!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/staff/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          role: newUser.role,
          reason: finalReason,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("✅ User blocked successfully!");
        setNewUser({ email: "", role: "", reason: "", customReason: "" });
        fetchBlockedUsers(); // refresh list
      } else {
        toast.error(data.message || "❌ Failed to block user");
      }
    } catch (error) {
      toast.error("❌ Error blocking user");
      console.error("Error blocking user:", error);
    }
  };

  // ✅ Search filter
  const filteredUsers = blockedUsers.filter(
    (user) =>
      (user.name || `${user.firstName} ${user.lastName}`)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-24">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Blocked Users List Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66] mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#212A31]">Blocked Users</h2>

          {/* Search Input */}
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#000000]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-[#124E66]" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#124E66]"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          // Empty State
          <div className="text-center py-10">
            <FaUserCheck className="mx-auto text-4xl text-[#124E66] mb-4" />
            <p className="text-lg text-[#212A31]">No blocked users found</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-2 text-[#124E66] hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          // Users Table
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#D3D9D2]">
              <thead className="bg-[#124E66]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Blocked On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#aec9ff]">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#eaf4ff]">
                    <td className="px-6 py-4 text-sm text-[#212A31]">
                      {user.name || `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#212A31]">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-[#212A31]">{user.role || "visitor"}</td>
                    <td className="px-6 py-4 text-sm text-[#212A31]">
                      {new Date(user.blockedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#212A31]">{user.reason}</td>
                    <td className="px-6 py-4 text-sm text-[#212A31]">
                      <button
                        onClick={() => handleUnblockUser(user._id)}
                        className="text-[#124E66] hover:text-[#142025] flex items-center"
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

      {/* Block New User Form Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#124E66]">
        <h2 className="text-xl font-semibold text-[#212A31] mb-4">Block New User</h2>
        <form onSubmit={handleBlockUser} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#212A31] mb-1">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full pl-4 pr-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-[#212A31] mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              required
            >
              <option value="">Select a role</option>
              <option value="visitor">Visitor</option>
              <option value="host">Host</option>
              <option value="security">Security</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-[#212A31] mb-1">Reason for Blocking</label>
            <select
              value={newUser.reason}
              onChange={(e) => setNewUser({ ...newUser, reason: e.target.value })}
              className="w-full px-4 py-2 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
              required
            >
              <option value="">Select a reason</option>
              <option value="suspicious">Suspicious Activity</option>
              <option value="violation">Policy Violation</option>
              <option value="spam">Spam/Abuse</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Conditional Textarea for "Other" */}
          {newUser.reason === "other" && (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-[#212A31] mb-1">Custom Reason</label>
              <textarea
                rows="3"
                value={newUser.customReason}
                onChange={(e) => setNewUser({ ...newUser, customReason: e.target.value })}
                className="w-full p-3 border border-[#124E66] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#124E66]"
                placeholder="Enter custom reason..."
              ></textarea>
            </div>
          )}

          {/* Submit */}
          <div className="md:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-[#124E66] text-white rounded-lg hover:bg-[#212A31] transition-colors flex items-center"
            >
              <FaBan className="mr-2" /> Block User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccessControl;
