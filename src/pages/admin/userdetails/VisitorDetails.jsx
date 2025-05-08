import React, { useEffect, useState } from "react";

const VisitorDetails = () => {
  const [visitorList, setVisitorList] = useState([]);
  const [newVisitor, setNewVisitor] = useState(null);
  const [editVisitor, setEditVisitor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const fetchVisitors = () => {
    fetch("http://localhost:5000/api/staff/visitor")
      .then((res) => res.json())
      .then((data) => setVisitorList(data))
      .catch((err) => console.error("Fetch error:", err));
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  const filteredVisitors = visitorList.filter((v) =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredVisitors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredVisitors.length / recordsPerPage);

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

  const handleAddSubmit = async () => {
    const res = await fetch("http://localhost:5000/api/staff/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newVisitor, role: "visitor", registeredDate: new Date().toLocaleString() }),
    });
    if (res.ok) {
      alert("Visitor added successfully!");
      setNewVisitor(null);
      fetchVisitors();
      setCurrentPage(1);
    } else {
      alert("Failed to add visitor");
    }
  };

  const handleEditSubmit = async () => {
    const res = await fetch(`http://localhost:5000/api/staff/${editVisitor._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editVisitor),
    });
    if (res.ok) {
      alert("Visitor updated successfully!");
      setEditVisitor(null);
      fetchVisitors();
    } else {
      alert("Failed to update visitor");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this visitor?")) return;
    const res = await fetch(`http://localhost:5000/api/staff/${id}`, { method: "DELETE" });
    if (res.ok) {
      alert("Visitor deleted successfully!");
      fetchVisitors();
      setCurrentPage(1);
    } else {
      alert("Failed to delete visitor");
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-2">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search visitor by name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-2xl">
        <h3 className="text-xl font-semibold mb-4 text-blue-800">Visitor Details</h3>
        <table className="w-full min-w-[1200px] text-sm text-left text-gray-800">
          <thead className="bg-blue-100 text-blue-900 uppercase text-xs tracking-wider">
            <tr>
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">User ID</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4">NIC/Passport</th>
              <th className="py-3 px-4">Registered Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((v, idx) => {
              const globalIndex = indexOfFirstRecord + idx + 1;
              return (
                <tr key={v._id} className="border-t hover:bg-blue-50">
                  <td className="py-3 px-4">{globalIndex}</td>
                  <td className="py-3 px-4">{v.userID || "-"}</td>
                  <td className="py-3 px-4">{v.name || "-"}</td>
                  <td className="py-3 px-4">{v.username || "-"}</td>
                  <td className="py-3 px-4">{v.email || "-"}</td>
                  <td className="py-3 px-4">{formatPhone(v.phone)}</td>
                  <td className="py-3 px-4">{v.nicNumber || "-"}</td>
                  <td className="py-3 px-4">{v.registeredDate || "-"}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => setEditVisitor(v)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
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

        {/* Pagination and Go Back */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="bg-[#124E66] hover:bg-[#0e3a4f] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
          >
            ← Go Back
          </button>

          <div className="space-x-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {newVisitor && (
        <ModalForm
          title="Add New Visitor"
          fields={["userID", "name", "username", "email", "phone", "password", "nicNumber"]}
          data={newVisitor}
          setData={setNewVisitor}
          onSubmit={handleAddSubmit}
          onClose={() => setNewVisitor(null)}
        />
      )}

      {/* Edit Modal */}
      {editVisitor && (
        <ModalForm
          title="Edit Visitor"
          fields={["userID", "name", "username", "email", "phone", "nicNumber"]}
          data={editVisitor}
          setData={setEditVisitor}
          onSubmit={handleEditSubmit}
          onClose={() => setEditVisitor(null)}
        />
      )}
    </div>
  );
};

const ModalForm = ({ title, fields, data, setData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    fields.forEach((field) => {
      const value = data[field] || "";

      if (["userID", "name", "username", "email", "phone"].includes(field)) {
        if (!value.trim()) tempErrors[field] = "This field is required";
      }

      if (field === "userID" && value.length < 3) tempErrors[field] = "User ID must be at least 3 characters.";
      if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
      if (field === "phone" && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
      if (field === "email" && !emailRegex.test(value)) tempErrors[field] = "Enter a valid email address.";
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
                  errors[field]
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
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

export default VisitorDetails;