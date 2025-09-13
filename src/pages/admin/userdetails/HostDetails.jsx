import React, { useEffect, useState } from "react";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiArrowLeft,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * HostDetails.jsx
 * - Lists all hosts (role=host) with search & pagination
 * - Columns include Position (always), Faculty/Department (only meaningful if Academic)
 * - Edit modal allows updating core fields incl. Position
 * - Delete confirmation modal
 *
 * Assumptions:
 * - Backend returns hosts from GET /api/staff/host with fields:
 *   _id, userID, username, name, email, phone, nicNumber, position, faculty, department, registeredDate
 */
const HostDetails = () => {
  // Data & UI state
  const [hostList, setHostList] = useState([]);
  const [editHost, setEditHost] = useState(null);
  const [deleteHostId, setDeleteHostId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Search & pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const navigate = useNavigate();

  // For reference (same as AddHost)
  const departmentOptions = {
    IT: ["IDS", "IT", "CM"],
    ENGINEERING: ["MECHANICAL", "CIVIL", "ENTC", "CHEMICAL"],
    ARCHITECTURE: ["DESIGN", "LANDSCAPE", "ARCHITECTURE"],
  };

  // Fetch all hosts
  const fetchHosts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/staff/host");
      if (!res.ok) throw new Error("Failed to fetch hosts");
      const data = await res.json();
      setHostList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load hosts");
    }
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  // Helpers
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = String(phone).replace(/\D/g, "");
    if (cleaned.length === 9) {
      return `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  const formatEmail = (email) => (email ? String(email).toLowerCase() : "-");

  const isAcademic = (h) => Boolean(h?.faculty && h?.department);

  // Search
  const filteredHosts = hostList.filter((h) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (h.name || "").toLowerCase().includes(q) ||
      (h.username || "").toLowerCase().includes(q) ||
      (h.email || "").toLowerCase().includes(q) ||
      (h.position || "").toLowerCase().includes(q) ||
      (h.userID || "").toLowerCase().includes(q)
    );
  });

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredHosts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.max(1, Math.ceil(filteredHosts.length / recordsPerPage));

  const goToNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const goToPrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // Edit
  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${editHost._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editHost),
      });
      if (!res.ok) throw new Error("Failed to update host");
      toast.success("Host updated successfully!");
      setEditHost(null);
      fetchHosts();
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to update host");
    }
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteHostId(id);
    setShowConfirmModal(true);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${deleteHostId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete host");
      toast.success("Host deleted successfully!");
      setShowConfirmModal(false);
      setDeleteHostId(null);
      setCurrentPage(1);
      fetchHosts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete host");
      setShowConfirmModal(false);
      setDeleteHostId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteHostId(null);
    toast.info("Delete action cancelled");
  };

  // Add host
  const handleAddNewHost = () => {
    try {
      navigate("/admin/userdetails/add-host");
    } catch (err) {
      console.error("Navigation error:", err);
      toast.error("Failed to navigate to Add Host form");
    }
  };

  return (
    <div className="pt-5 px-4 lg:px-2 min-h-screen bg-[#FFFFFF]">
      <div className="max-w-full mx-auto">
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-96">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search host by name"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] shadow-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] focus:outline-none transition duration-200 hover:shadow-md"
              aria-label="Search hosts"
            />
          </div>

          <button
            onClick={handleAddNewHost}
            className="flex items-center gap-2 bg-[#124E66] text-[#FFFFFF] px-4 py-2 rounded-lg hover:bg-[#0e3a4f] transition shadow-sm hover:shadow-md"
            aria-label="Add New Host"
          >
            <FiPlus /> Add New Host
          </button>
        </div>

        {/* Table */}
        <div className="bg-[#D5D8DC] p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">Host Details Management</h3>

          <table className="w-full text-sm text-left text-[#374151]">
            <thead className="bg-[#B0B7BD] text-[#212A31] uppercase text-xs tracking-wider">
              <tr>
                {[
                  "#",
                  "User ID",
                  "Username",
                  "Name",
                  "Email",
                  "Phone Number",
                  "NIC/Passport",
                  "Position", // NEW
                  "Faculty",
                  "Department",
                  "Registered Date",
                  "Actions",
                ].map((heading, idx) => (
                  <th key={idx} className="py-3 px-4 font-medium whitespace-nowrap">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((host, idx) => {
                const globalIndex = indexOfFirstRecord + idx + 1;
                const academic = isAcademic(host);
                return (
                  <tr
                    key={host._id}
                    className="bg-[#E8EAEC] border-t border-[#C4C9CE] hover:bg-[#C4C9CE] transition"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">{globalIndex}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{host.userID || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{host.username || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{host.name || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatEmail(host.email)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatPhone(host.phone)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{host.nicNumber || "-"}</td>

                    {/* Position always */}
                    <td className="py-3 px-4 whitespace-nowrap">{host.position || "-"}</td>

                    {/* Faculty/Department only meaningful for Academic */}
                    <td className="py-3 px-4 whitespace-nowrap">{academic ? host.faculty || "-" : "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{academic ? host.department || "-" : "-"}</td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {host.registeredDate
                        ? new Date(host.registeredDate).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setEditHost(host)}
                        className="p-2 bg-[#1d4756] hover:bg-[#5d8696] text-[#FFFFFF] rounded-full transition"
                        title="Edit"
                        aria-label="Edit host"
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(host._id)}
                        className="p-2 bg-[#4d0202] hover:bg-[#d18282] text-[#FFFFFF] rounded-full transition"
                        title="Delete"
                        aria-label="Delete host"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {!currentRecords.length && (
                <tr>
                  <td className="py-6 px-4 text-center text-[#6B7280]" colSpan={12}>
                    No hosts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Footer actions */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-[#124E66] hover:bg-[#0e3a4f] text-[#FFFFFF] font-semibold px-4 py-2 rounded-lg shadow-md transition"
              aria-label="Go Back"
            >
              <FiArrowLeft /> Go Back
            </button>

            {/* Pagination */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-full bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB] disabled:opacity-50 transition"
                aria-label="Previous Page"
              >
                <FiChevronLeft className="text-lg" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-full ${
                    currentPage === i + 1
                      ? "bg-[#B9B9B9] text-[#FFFFFF]"
                      : "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]"
                  } transition`}
                  aria-label={`Page ${i + 1}`}
                  aria-current={currentPage === i + 1 ? "page" : undefined}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-full bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB] disabled:opacity-50 transition"
                aria-label="Next Page"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Host Modal */}
      {editHost && (
        <EditHostForm
          title="Edit Host"
          // Include position so you can edit it
          fields={[
            "username",
            "name",
            "email",
            "phone",
            "nicNumber",
            "position", // NEW in modal
            "faculty",
            "department",
          ]}
          data={editHost}
          setData={setEditHost}
          onSubmit={handleEditSubmit}
          onClose={() => setEditHost(null)}
          departmentOptions={departmentOptions}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "12px",
              minWidth: "400px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#1F2937",
              }}
            >
              Confirm Delete
            </h2>
            <p
              style={{
                color: "#6B7280",
                marginBottom: "2rem",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete this host? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: "#EF4444",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#DC2626")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#EF4444")}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                style={{
                  backgroundColor: "#6B7280",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#4B5563")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#6B7280")}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ----------------------- Edit Host Modal ----------------------- */

const validateForm = (fields, data) => {
  let tempErrors = {};
  const phoneRegex = /^[0-9]{9}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  fields.forEach((field) => {
    const value = (data[field] ?? "").toString();

    if (["username", "name", "email", "phone"].includes(field)) {
      if (!value.trim()) {
        tempErrors[field] = "This field is required";
      }
    }

    if (field === "username" && value && value.length < 3) {
      tempErrors[field] = "Username must be at least 3 characters.";
    }
    if (field === "name" && value && value.length < 3) {
      tempErrors[field] = "Name must be at least 3 characters.";
    }
    if (field === "phone" && value && !phoneRegex.test(value)) {
      tempErrors[field] = "Phone number must be exactly 9 digits.";
    }
    if (field === "email" && value && !emailRegex.test(value)) {
      tempErrors[field] = "Please enter a valid email address.";
    }
  });

  // If faculty is provided, department should be provided too (Academic case)
  if ((data.faculty && !data.department) || (!data.faculty && data.department)) {
    if (!data.faculty) tempErrors.faculty = "Faculty is required when Department is set.";
    if (!data.department) tempErrors.department = "Department is required when Faculty is set.";
  }

  return tempErrors;
};

const EditHostForm = ({
  title,
  fields,
  data,
  setData,
  onSubmit,
  onClose,
  departmentOptions,
}) => {
  const [errors, setErrors] = useState({});

  const getFieldLabel = (field) => {
    const labels = {
      phone: "Phone Number",
      nicNumber: "NIC/Passport",
      position: "Position",
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const handleFacultyChange = (selectedFaculty) => {
    setData((prev) => ({ ...prev, faculty: selectedFaculty, department: "" }));
  };

  const submit = (e) => {
    e.preventDefault();
    const tempErrors = validateForm(fields, data);
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length === 0) {
      onSubmit();
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-[#00000066] flex items-center justify-center z-50 px-4">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#4B5563] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#FFFFFF]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[#FFFFFF] text-2xl hover:opacity-80 transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={submit} className="p-6 bg-[#F9FAFB]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium text-[#4B5563]">
                  {getFieldLabel(field)}
                </label>

                {field === "faculty" ? (
                  <select
                    name={field}
                    value={data[field] || ""}
                    onChange={(e) => handleFacultyChange(e.target.value)}
                    className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                      errors[field]
                        ? "border-[#EF4444] focus:ring-[#F87171]"
                        : "border-[#E5E7EB] focus:ring-[#6B7280]"
                    } transition duration-200 bg-[#FFFFFF]`}
                    aria-required="false"
                    aria-invalid={!!errors[field]}
                    aria-describedby={errors[field] ? `error-${field}` : undefined}
                  >
                    <option value="">Select Faculty</option>
                    {["IT", "ENGINEERING", "ARCHITECTURE"].map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                ) : field === "department" ? (
                  <select
                    name={field}
                    value={data[field] || ""}
                    onChange={(e) => setData((prev) => ({ ...prev, [field]: e.target.value }))}
                    className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                      errors[field]
                        ? "border-[#EF4444] focus:ring-[#F87171]"
                        : "border-[#E5E7EB] focus:ring-[#6B7280]"
                    } transition duration-200 bg-[#FFFFFF]`}
                    aria-required="false"
                    aria-invalid={!!errors[field]}
                    aria-describedby={errors[field] ? `error-${field}` : undefined}
                    disabled={!data.faculty}
                  >
                    <option value="">Select Department</option>
                    {data.faculty &&
                      departmentOptions[data.faculty]?.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name={field}
                    value={data[field] || ""}
                    placeholder={`Enter ${getFieldLabel(field)}`}
                    onChange={(e) =>
                      setData((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                      errors[field]
                        ? "border-[#EF4444] focus:ring-[#F87171]"
                        : "border-[#E5E7EB] focus:ring-[#6B7280]"
                    } transition duration-200 bg-[#FFFFFF]`}
                    aria-required="false"
                    aria-invalid={!!errors[field]}
                    aria-describedby={errors[field] ? `error-${field}` : undefined}
                  />
                )}

                {errors[field] && (
                  <p id={`error-${field}`} className="text-[#EF4444] text-sm mt-1">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

            {/* Read-only User ID */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#4B5563]">
                User ID
              </label>
              <input
                type="text"
                value={data.userID || "-"}
                className="w-full p-3 border rounded-md shadow-sm bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                readOnly
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-[#F3F4F6]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#D1D5DB] text-[#374151] rounded-md hover:bg-[#9CA3AF] transition duration-200"
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4B5563] text-[#FFFFFF] rounded-md hover:bg-[#374151] transition duration-200 shadow-sm"
              aria-label="Save Changes"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HostDetails;
