import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VisitorDetails = () => {
  // State management
  const [visitorList, setVisitorList] = useState([]);
  const [editVisitor, setEditVisitor] = useState(null);
  const [deleteVisitorId, setDeleteVisitorId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  // Fetch visitors from API
  const fetchVisitors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/visitor");
      if (!res.ok) throw new Error("Failed to fetch visitors");
      const data = await res.json();
      if (data.success) {
        setVisitorList(
          data.data.map((v) => ({
            _id: v._id,
            userID: v.visitorId,
            name: `${v.firstName} ${v.lastName}`,
            username: v.username,
            email: v.email,
            phone: v.phoneNumber,
            nicNumber: v.nicNumber || v.passportNumber || "-",
            registeredDate: new Date(v.createdAt).toLocaleString(),
          }))
        );
      } else {
        throw new Error("Failed to load visitor data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load visitors");
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchVisitors();
  }, []);

  // Filter visitors based on search query
  const filteredVisitors = visitorList.filter((v) =>
    v.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredVisitors.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredVisitors.length / recordsPerPage);

  // Navigation handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Format phone number for display
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length === 9) {
      return `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  // Format email for display
  const formatEmail = (email) => {
    if (!email) return "-";
    return email.toLowerCase();
  };

  // Handle visitor edit submission
  const handleEditSubmit = async () => {
    const [firstName, lastName] = editVisitor.name.split(" ", 2);
    try {
      const res = await fetch(`http://localhost:5000/api/visitor/${editVisitor._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName || editVisitor.name,
          lastName: lastName || "",
          username: editVisitor.username,
          email: editVisitor.email,
          phoneNumber: editVisitor.phone,
          nicNumber: editVisitor.nicNumber,
        }),
      });
      if (res.ok) {
        toast.success("Visitor updated successfully!");
        setEditVisitor(null);
        fetchVisitors();
      } else {
        const error = await res.json();
        throw new Error(error.message || "Failed to update visitor");
      }
    } catch (err) {
      console.error("Edit error:", err);
      toast.error(err.message);
    }
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteVisitorId(id);
    setShowConfirmModal(true);
  };

  // Handle visitor deletion
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/visitor/${deleteVisitorId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Visitor deleted successfully!");
        fetchVisitors();
        setCurrentPage(1);
        setShowConfirmModal(false);
        setDeleteVisitorId(null);
      } else {
        throw new Error("Failed to delete visitor");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete visitor");
      setShowConfirmModal(false);
      setDeleteVisitorId(null);
    }
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteVisitorId(null);
    toast.info("Delete action cancelled");
  };

  return (
    <div className="pt-5 px-4 lg:px-2 min-h-screen bg-[#FFFFFF]">
      <div className="max-w-full mx-auto">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search visitor by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] shadow-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] focus:outline-none transition duration-200 hover:shadow-md"
              aria-label="Search visitors by name"
            />
          </div>
        </div>

        {/* Visitor Table */}
        <div className="bg-[#D5D8DC] p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">Visitor Details Management</h3>
          <table className="w-full text-sm text-left text-[#374151]">
            <thead className="bg-[#B0B7BD] text-[#212A31] uppercase text-xs tracking-wider">
              <tr>
                {["#", "User ID", "Name", "Username", "Email", "Phone Number", "NIC/Passport", "Registered Date", "Actions"].map(
                  (heading, idx) => (
                    <th
                      key={idx}
                      className="py-2 px-2 font-medium whitespace-nowrap"
                      style={{
                        width: idx === 0 ? "5%" : idx === 8 ? "10%" : `${90 / 8}%`,
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {currentRecords.map((v, idx) => {
                const globalIndex = indexOfFirstRecord + idx + 1;
                return (
                  <tr
                    key={v._id}
                    className="bg-[#E8EAEC] border-t border-[#C4C9CE] hover:bg-[#C4C9CE] transition"
                  >
                    <td className="py-2 px-2 whitespace-nowrap">{globalIndex}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{v.userID || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{v.name || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{v.username || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{formatEmail(v.email)}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{formatPhone(v.phone)}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{v.nicNumber || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{v.registeredDate || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => setEditVisitor(v)}
                        className="p-2 bg-[#1d4756] hover:bg-[#5d8696] text-[#FFFFFF] rounded-full transition"
                        title="Edit"
                        aria-label="Edit visitor"
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(v._id)}
                        className="p-2 bg-[#4d0202] hover:bg-[#d18282] text-[#FFFFFF] rounded-full transition"
                        title="Delete"
                        aria-label="Delete visitor"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 bg-[#124E66] hover:bg-[#0e3a4f] text-[#FFFFFF] font-semibold px-4 py-2 rounded-lg shadow-md transition"
              aria-label="Go Back"
            >
              <FiArrowLeft /> Go Back
            </button>

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
                    currentPage === i + 1 ? "bg-[#B9B9B9] text-[#FFFFFF]" : "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]"
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

      {/* Delete Confirmation Modal */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            minWidth: '400px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#1F2937'
            }}>
              Confirm Delete
            </h2>
            <p style={{
              color: '#6B7280',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this visitor? This action cannot be undone.
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: '#EF4444',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#DC2626'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#EF4444'}
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                style={{
                  backgroundColor: '#6B7280',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#4B5563'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#6B7280'}
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

// Form validation helper
const validateForm = (fields, data) => {
  let tempErrors = {};
  const phoneRegex = /^[0-9]{9}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  fields.forEach((field) => {
    const value = data[field] || "";

    if (["userID", "name", "username", "email", "phone"].includes(field)) {
      if (!value.trim()) {
        tempErrors[field] = "This field is required";
      }
    }

    if (field === "userID" && value.length < 3) tempErrors[field] = "User ID must be at least 3 characters.";
    if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
    if (field === "username" && value.length < 3) tempErrors[field] = "Username must be at least 3 characters.";
    if (field === "phone" && value && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
    if (field === "email" && value && !emailRegex.test(value)) tempErrors[field] = "Please enter a valid email address.";
  });

  return tempErrors;
};

// Reusable Modal Component
const ModalForm = ({ title, fields, data, setData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  // Get field label for display
  const getFieldLabel = (field) => {
    const labels = {
      phone: "Phone Number",
      nicNumber: "NIC/Passport",
      userID: "User ID"
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  const handleSubmit = (e) => {
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
        <form onSubmit={handleSubmit} className="p-6 bg-[#F9FAFB]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium text-[#4B5563]">
                  {getFieldLabel(field)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={data[field] || ""}
                  placeholder={`Enter ${getFieldLabel(field)}`}
                  onChange={(e) => setData((prev) => ({ ...prev, [field]: e.target.value }))}
                  className={`w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-[#EF4444] focus:ring-[#F87171]"
                      : "border-[#E5E7EB] focus:ring-[#6B7280]"
                  } transition duration-200 bg-[#FFFFFF]`}
                  aria-required="true"
                  aria-invalid={!!errors[field]}
                  aria-describedby={errors[field] ? `error-${field}` : undefined}
                />
                {errors[field] && (
                  <p id={`error-${field}`} className="text-[#EF4444] text-sm mt-1">{errors[field]}</p>
                )}
              </div>
            ))}
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

export default VisitorDetails;
