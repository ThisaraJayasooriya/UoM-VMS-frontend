import React, { useEffect, useState } from "react";

const HostDetails = () => {
  const [hostList, setHostList] = useState([]);
  const [newHost, setNewHost] = useState(null);
  const [editHost, setEditHost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchHosts = () => {
    fetch("http://localhost:5000/api/staff/host")
      .then((res) => res.json())
      .then((data) => setHostList(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const filteredHosts = hostList.filter((host) =>
    host.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHosts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredHosts.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 9) {
      return `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  const formatEmail = (email) => {
    if (!email) return "-";
    return email.toLowerCase();
  };

  const handleAddSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/staff/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newHost, role: "host", registeredDate: new Date().toLocaleString() }),
    });
    if (res.ok) {
      alert("Host added successfully!");
      setNewHost(null);
      fetchHosts();
      setCurrentPage(1);
    } else {
      alert("Failed to add host");
    }
  };

  const handleEditSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/staff/${editHost._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editHost),
    });
    if (res.ok) {
      alert("Host updated successfully!");
      setEditHost(null);
      fetchHosts();
    } else {
      alert("Failed to update host");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this host?")) return;
    const res = await fetch(`http://localhost:5000/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Host deleted successfully!");
      fetchHosts();
      setCurrentPage(1);
    } else {
      alert("Failed to delete host");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-2">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search host by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setNewHost({})}
          className="bg-[#124E66] text-white px-6 py-3 rounded-lg hover:bg-[#0e3a4f]"
        >
          + Add New Host
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-[#124E66]">Host Details</h3>
        <table className="w-full min-w-[1200px] text-sm text-left text-gray-800">
          <thead className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wider">
            <tr>
              {[
                "#", "User ID", "Name", "Username", "Email", "Phone", "NIC/Passport", "Faculty", "Department", "Registered Date", "Actions"
              ].map((heading, idx) => (
                <th key={idx} className="py-3 px-4 whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((host, idx) => {
              const globalIndex = indexOfFirstRecord + idx + 1;
              return (
                <tr key={host._id} className="border-t hover:bg-blue-50">
                  <td className="py-3 px-4 whitespace-nowrap">{globalIndex}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.userID || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.name || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.username || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{formatEmail(host.email)}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{formatPhone(host.phone)}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.nicNumber || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.faculty || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.department || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{host.registeredDate || "-"}</td>
                  <td className="py-3 px-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => setEditHost(host)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(host._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-[#124E66] hover:bg-[#0e3a4f] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            ← Go Back
          </button>
          <div className="space-x-4">
            <button onClick={goToPrevPage} disabled={currentPage === 1} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
              Previous
            </button>
            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {newHost && (
        <ModalForm
          title="Add New Host"
          fields={["userID", "name", "username", "email", "phone", "password", "nicNumber", "faculty", "department"]}
          data={newHost}
          setData={setNewHost}
          onSubmit={handleAddSubmit}
          onClose={() => setNewHost(null)}
        />
      )}

      {/* Edit Modal */}
      {editHost && (
        <ModalForm
          title="Edit Host"
          fields={["userID", "name", "username", "email", "phone", "nicNumber", "faculty", "department"]}
          data={editHost}
          setData={setEditHost}
          onSubmit={handleEditSubmit}
          onClose={() => setEditHost(null)}
        />
      )}
    </div>
  );
};

// ModalForm
const ModalForm = ({ title, fields, data, setData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    fields.forEach((field) => {
      const value = data[field] || "";
      if (["userID", "name", "username", "email", "phone", "faculty", "department"].includes(field) && !value.trim()) {
        tempErrors[field] = "This field is required.";
      }
      if (field === "userID" && value.length < 3) tempErrors[field] = "User ID must be at least 3 characters.";
      if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
      if (field === "username" && value.length < 3) tempErrors[field] = "Username must be at least 3 characters.";
      if (field === "phone" && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
      if (field === "email" && !emailRegex.test(value)) tempErrors[field] = "Please enter a valid email address.";
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSubmit();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field} className="mb-4">
              <input
                name={field}
                value={data[field] || ""}
                placeholder={`Enter ${field}`}
                onChange={(e) => setData((prev) => ({ ...prev, [field]: e.target.value }))}
                className={`w-full p-3 border rounded-lg ${
                  errors[field] ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
                } focus:outline-none focus:ring-2`}
              />
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostDetails;