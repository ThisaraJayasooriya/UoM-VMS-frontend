import React, { useEffect, useState } from "react";

const PAGE_SIZE = 3;

const UserDetails = () => {
  const [selectedRole, setSelectedRole] = useState("visitor");
  const [userList, setUserList] = useState([]);
  const [visibleUsers, setVisibleUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (selectedRole !== "visitor") {
      fetch(`http://localhost:5000/api/staff/${selectedRole}`)
        .then((res) => res.json())
        .then((data) => {
          setUserList(data);
          setCurrentPage(1);
        })
        .catch((err) => console.error("Fetch error:", err));
    } else {
      setUserList([]);
    }
  }, [selectedRole]);

  useEffect(() => {
    const filtered = userList.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const paginated = filtered.slice(0, currentPage * PAGE_SIZE);
    setVisibleUsers(paginated);
  }, [searchQuery, userList, currentPage]);

  const handleEdit = (user) => setEditUser(user);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/staff/${editUser._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editUser),
    });

    if (res.ok) {
      alert("User updated successfully!");
      setEditUser(null);
      setSelectedRole(selectedRole); // Refresh list
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async (userId) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    const res = await fetch(`http://localhost:5000/api/staff/${userId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("User deleted");
      setUserList((prev) => prev.filter((user) => user._id !== userId));
    } else {
      alert("Deletion failed");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20">
      {/* Role + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <select
          className="w-64 p-3 border border-blue-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="visitor">Visitor</option>
          <option value="host">Host</option>
          <option value="security">Security</option>
          <option value="admin">Admin</option>
        </select>

        <input
          type="text"
          placeholder="Search by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-800 capitalize">{selectedRole} Details</h3>
        <table className="min-w-full text-sm text-left text-gray-800 table-fixed">
          <thead className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">NIC / Passport No</th>
              {selectedRole === "host" && (
                <>
                  <th className="py-3 px-4">Faculty</th>
                  <th className="py-3 px-4">Department</th>
                </>
              )}
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.length > 0 ? (
              visibleUsers.map((user, index) => (
                <tr key={user._id} className="border-t hover:bg-blue-50 transition">
                  <td className="py-3 px-4">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="py-3 px-4">{user.userID}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone}</td>
                  <td className="py-3 px-4">{user.nicNumber || "-"}</td>
                  {selectedRole === "host" && (
                    <>
                      <td className="py-3 px-4">{user.faculty}</td>
                      <td className="py-3 px-4">{user.department}</td>
                    </>
                  )}
                  <td className="py-3 px-4">{user.registeredDate}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-[#124E66] text-white py-1 px-4 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white py-1 px-4 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={selectedRole === "host" ? 10 : 8} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {visibleUsers.length < userList.filter((u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).length && (
          <div className="text-right mt-4">
            <button
              className="bg-[#124E66] text-white px-6 py-2 rounded-lg hover:bg-[#0e3a4f]"
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">Edit User</h2>
            {["userID", "name", "email", "phone", "nicNumber", "faculty", "department"].map((field) => (
              <input
                key={field}
                name={field}
                value={editUser[field] || ""}
                onChange={handleEditChange}
                placeholder={`Enter ${field}`}
                className="w-full p-3 mb-3 border rounded"
              />
            ))}
            <div className="flex justify-end gap-4">
              <button onClick={() => setEditUser(null)} className="bg-gray-300 px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
