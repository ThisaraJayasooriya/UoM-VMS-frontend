import React, { useState } from "react";

const UserDetails = ({ userData }) => {
  const [selectedRole, setSelectedRole] = useState("visitor");

  const handleView = (user) => {
    alert(`Details for ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone}`);
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      

      {/* Role Selector */}
      <select
        className="w-64 p-3 border border-blue-300 rounded-lg shadow-sm mb-6 focus:ring-2 focus:ring-blue-500"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
      >
        <option value="visitor">Visitor</option>
        <option value="host">Host</option>
        <option value="security">Security</option>
        <option value="admin">Admin</option>
      </select>

      {/* User Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-800 capitalize">{selectedRole} Details</h3>
        <table className="min-w-full text-sm text-left text-gray-800 table-fixed">
          <thead className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-4 w-1/6">User Name</th>
              <th className="py-3 px-4 w-1/5">Email</th>
              <th className="py-3 px-4 w-1/6">Phone No</th>
              <th className="py-3 px-4 w-1/6">User ID</th>
              <th className="py-3 px-4 w-1/4">Registered Date</th>
              <th className="py-3 px-4 w-1/6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData[selectedRole] && userData[selectedRole].length > 0 ? (
              userData[selectedRole].map((user, index) => (
                <tr key={index} className="border-t hover:bg-blue-50 transition">
                  <td className="py-3 px-4 truncate">{user.name}</td>
                  <td className="py-3 px-4 truncate">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.userID}</td>
                  <td className="py-3 px-4">{user.registeredDate}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white w-20 py-1 rounded text-sm"
                        onClick={() => handleView(user)}
                      >
                        View
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white w-20 py-1 rounded text-sm"
                        onClick={() => alert("Delete only works with backend")}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDetails;
