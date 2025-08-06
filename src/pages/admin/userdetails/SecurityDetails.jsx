import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SecurityDetails = () => {
  // State variables for managing security details
  const [securityList, setSecurityList] = useState([]);
  const [editSecurity, setEditSecurity] = useState(null);
  const [deleteSecurityId, setDeleteSecurityId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  const fetchSecurity = async () => {
    try {
      // Fetch security users from the API
      const res = await fetch("http://localhost:5000/api/staff/security");
      if (!res.ok) throw new Error("Failed to fetch security users");
      const data = await res.json();
      setSecurityList(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load security users");
    }
  };

  // Fetch security details on component mount
  useEffect(() => {
    fetchSecurity();
  }, []);

  const filteredSecurity = securityList.filter((sec) =>
    sec.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSecurity.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSecurity.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Helper functions to format phone and email
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

  // Function to handle submission of edited security user
  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${editSecurity._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSecurity),
      });
      if (res.ok) {
        toast.success("Security updated successfully!");
        setEditSecurity(null);
        fetchSecurity();
      } else {
        throw new Error("Failed to update security");
      }
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to update security");
    }
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (id) => {
    setDeleteSecurityId(id);
    setShowConfirmModal(true);
  };

  // Handle security deletion
  const handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${deleteSecurityId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Security deleted successfully!");
        fetchSecurity();
        setCurrentPage(1);
        setShowConfirmModal(false);
        setDeleteSecurityId(null);
      } else {
        throw new Error("Failed to delete security");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete security");
      setShowConfirmModal(false);
      setDeleteSecurityId(null);
    }
  };

  // Handle canceling delete
  const handleCancelDelete = () => {
    setShowConfirmModal(false);
    setDeleteSecurityId(null);
    toast.info("Delete action cancelled");
  };

  // Function to handle navigation to Add Security form
  const handleAddNewSecurity = () => {
    console.log("Navigating to Add Security form");
    try {
      navigate("/admin/userdetails/add-security");
    } catch (err) {
      console.error("Navigation error:", err);
      toast.error("Failed to navigate to Add Security form");
    }
  };

  return (
    // Main component rendering security details management UI
    <div className="pt-5 px-4 lg:px-2 min-h-screen bg-[#FFFFFF]">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            {/* Search input for filtering security users */}
            <input
              type="text"
              placeholder="Search security by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] shadow-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] focus:outline-none transition duration-200 hover:shadow-md"
              aria-label="Search security by name"
            />
          </div>
          {/* Button to add new security user */}
          <button
            onClick={handleAddNewSecurity}
            className="flex items-center gap-2 bg-[#124E66] text-[#FFFFFF] px-4 py-2 rounded-lg hover:bg-[#0e3a4f] transition shadow-sm hover:shadow-md"
            aria-label="Add New Security"
          >
            <FiPlus /> Add New Security
          </button>
        </div>

        {/* Security details table */}
        <div className="bg-[#D5D8DC] p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">Security Details Management</h3>
          <table className="w-full text-sm text-left text-[#374151]">
            <thead className="bg-[#B0B7BD] text-[#212A31] uppercase text-xs tracking-wider">
              <tr>
                {["#", "User ID", "Username", "Name", "Email", "Phone Number", "NIC/Passport", "Registered Date", "Actions"].map((heading, idx) => (
                  <th
                    key={idx}
                    className="py-2 px-2 font-medium whitespace-nowrap"
                    style={{
                      width: idx === 0 ? "5%" : idx === 8 ? "10%" : `${90 / 8}%`, // Distribute 90% width across 8 columns (excluding # and Actions)
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {currentRecords.map((sec, idx) => {
                const globalIndex = indexOfFirstRecord + idx + 1;
                return (
                  <tr key={sec._id} className="bg-[#E8EAEC] border-t border-[#C4C9CE] hover:bg-[#C4C9CE] transition">
                    <td className="py-2 px-2 whitespace-nowrap">{globalIndex}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{sec.userID || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{sec.username || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{sec.name || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{formatEmail(sec.email)}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{formatPhone(sec.phone)}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{sec.nicNumber || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap">{sec.registeredDate || "-"}</td>
                    <td className="py-2 px-2 whitespace-nowrap space-x-2">
                      {/* Action buttons for editing and deleting security user */}
                      <button
                        onClick={() => setEditSecurity(sec)}
                        className="p-2 bg-[#1d4756] hover:bg-[#5d8696] text-[#FFFFFF] rounded-full transition"
                        title="Edit"
                        aria-label="Edit security"
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(sec._id)}
                        className="p-2 bg-[#4d0202] hover:bg-[#d18282] text-[#FFFFFF] rounded-full transition"
                        title="Delete"
                        aria-label="Delete security"
                      >
                        <FiTrash2 className="text-lg" />
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
              className="flex items-center gap-2 bg-[#124E66] hover:bg-[#0e3a4f] text-[#FFFFFF] font-semibold px-4 py-2 rounded-lg shadow-md transition"
              aria-label="Go Back"
            >
              <FiArrowLeft /> Go Back
            </button>

            {/* Pagination controls */}
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
                  className={`px-3 py-1 rounded-full ${currentPage === i + 1 ? "bg-[#B9B9B9] text-[#FFFFFF]" : "bg-[#E5E7EB] text-[#374151] hover:bg-[#D1D5DB]"} transition`}
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

      {/* Edit Security Form Modal */}
      {editSecurity && (
        <EditSecurityForm
          title="Edit Security"
          fields={["username", "name", "email", "phone", "nicNumber"]} // Removed userID from editable fields
          data={editSecurity}
          setData={setEditSecurity}
          onSubmit={handleEditSubmit}
          onClose={() => setEditSecurity(null)}
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
              Are you sure you want to delete this security user? This action cannot be undone.
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

const validateForm = (fields, data) => {
  let tempErrors = {};
  const phoneRegex = /^[0-9]{9}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  fields.forEach((field) => {
    const value = data[field] || "";

    if (["username", "name", "email", "phone"].includes(field)) {
      if (!value.trim()) {
        tempErrors[field] = "This field is required";
      }
    }

    if (field === "username" && value.length < 3) tempErrors[field] = "Username must be at least 3 characters.";
    if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
    if (field === "phone" && value && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
    if (field === "email" && value && !emailRegex.test(value)) tempErrors[field] = "Please enter a valid email address.";
  });

  return tempErrors;
};

// Edit Security Form Component
const EditSecurityForm = ({ title, fields, data, setData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  // Get field label for display
  const getFieldLabel = (field) => {
    const labels = {
      phone: "Phone Number",
      nicNumber: "NIC/Passport"
    };
    return labels[field] || field.charAt(0).toUpperCase() + field.slice(1);
  };

  // Validate form fields on mount and when data changes
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
            {/* Render input fields dynamically based on provided fields */}
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
            {/* Display userID as read-only */}
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

export default SecurityDetails;


