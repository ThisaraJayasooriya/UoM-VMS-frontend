import React, { useEffect, useState } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiArrowLeft, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Main Component Definition
const AdminDetails = () => {
  const [adminList, setAdminList] = useState([]);
  const [editAdmin, setEditAdmin] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;
  const navigate = useNavigate();

  // Data Fetching
  const fetchAdmins = async () => {
    try {
      // Fetching admin data from the API
      const res = await fetch("http://localhost:5000/api/staff/admin");
      if (!res.ok) throw new Error("Failed to fetch admins");
      const data = await res.json();
      // Updates the adminList state with the fetched data
      setAdminList(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load admins");
    }
  };

  useEffect(() => {
    fetchAdmins(); // Runs the code when component mounts
  }, []);

  // Data Filtering and Pagination logic
  const filteredAdmins = adminList.filter((admin) =>
    admin.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAdmins.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAdmins.length / recordsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Phone Number Formatting function to display
  const formatPhone = (phone) => {
    if (!phone) return "-";
    const cleaned = phone.replace(/\D/g, ""); // Removes all non-digit characters
    if (cleaned.length === 9) {
      return `+94 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
  };

  // Email Formatting function to display
  const formatEmail = (email) => {
    if (!email) return "-";
    return email.toLowerCase();
  };

  // Edit Admin Submission Handler
  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${editAdmin._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editAdmin),
        // Sends a PUT request to update the admin with the specified ID, sending the updated editAdmin data
      });

      if (res.ok) {
        toast.success("Admin updated successfully!");
        setEditAdmin(null);
        fetchAdmins();
      } else {
        throw new Error("Failed to update admin");
      }
    } catch (err) {
      console.error("Edit error:", err);
      toast.error("Failed to update admin");
    }
  };

  // Handling the Delete Action
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Admin deleted successfully!");
        fetchAdmins(); // Refetches the admin list to reflect the deletion
        setCurrentPage(1); // Resets to the first page to avoid pagination issues
      } else {
        throw new Error("Failed to delete admin");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete admin");
    }
  };

  // Adding a New Admin
  const handleAddNewAdmin = () => {
    console.log("Navigating to Add Admin form");
    try {
      navigate("/admin/userdetails/add-admin");
    } catch (err) {
      console.error("Navigation error:", err);
      toast.error("Failed to navigate to Add Admin form");
    }
  };

  return (
    <div className="pt-5 px-4 lg:px-2 min-h-screen bg-[#FFFFFF]">
      <div className="max-w-full mx-auto">
        {/* Search input and Add New Admin button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search admin by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] rounded-xl bg-[#FFFFFF] shadow-sm focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] focus:outline-none transition duration-200 hover:shadow-md"
              aria-label="Search admins by name"
            />
          </div>

          {/* Button to navigate to the Add Admin form */}
          <button
            onClick={handleAddNewAdmin}
            className="flex items-center gap-2 bg-[#124E66] text-[#FFFFFF] px-4 py-2 rounded-lg hover:bg-[#0e3a4f] transition shadow-sm hover:shadow-md"
            aria-label="Add New Admin"
          >
            <FiPlus /> Add New Admin
          </button>
        </div>

        {/* Admin Details Table */}
        <div className="bg-[#D5D8DC] p-6 rounded-xl shadow-lg overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4 text-[#1F2937]">Admin Details Management</h3>
          <table className="w-full text-sm text-left text-[#374151]">
            <thead className="bg-[#B0B7BD] text-[#212A31] uppercase text-xs tracking-wider">
              <tr>
                {["#", "User ID", "Username", "Name", "Email", "Phone", "NIC/Passport", "Registered Date", "Actions"].map((heading, idx) => (
                  <th key={idx} className="py-3 px-4 font-medium whitespace-nowrap">{heading}</th>
                ))}
              </tr>
              {/* Renders table headers dynamically. */}
            </thead>
            <tbody>
              {currentRecords.map((admin, idx) => {
                const globalIndex = indexOfFirstRecord + idx + 1;
                return (
                  <tr key={admin._id} className="bg-[#E8EAEC] border-t border-[#C4C9CE] hover:bg-[#C4C9CE] transition">
                    {/* Table row for each admin, with hover effect. */}
                    <td className="py-3 px-4 whitespace-nowrap">{globalIndex}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{admin.userID || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{admin.username || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{admin.name || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatEmail(admin.email)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{formatPhone(admin.phone)}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{admin.nicNumber || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">{admin.registeredDate || "-"}</td>
                    <td className="py-3 px-4 whitespace-nowrap space-x-2">
                      {/* Edit and Delete buttons in the table */}
                      <button
                        onClick={() => setEditAdmin(admin)}
                        className="p-2 bg-[#1d4756] hover:bg-[#5d8696] text-[#FFFFFF] rounded-full transition"
                        title="Edit"
                        aria-label="Edit admin"
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(admin._id)}
                        className="p-2 bg-[#4d0202] hover:bg-[#d18282] text-[#FFFFFF] rounded-full transition"
                        title="Delete"
                        aria-label="Delete admin"
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

            {/* Pagination Controls */}
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

      {/* Edit Admin Form Modal */}
      {editAdmin && (
        <EditAdminForm
          title="Edit Admin"
          fields={["username", "name", "email", "phone", "nicNumber"]} // Removed userID from editable fields
          data={editAdmin}
          setData={setEditAdmin}
          onSubmit={handleEditSubmit}
          onClose={() => setEditAdmin(null)}
        />
      )}
    </div>
  );
};

const EditAdminForm = ({ title, fields, data, setData, onSubmit, onClose }) => {
  const [errors, setErrors] = useState({});

  const validateForm = (fields, data) => {
    let tempErrors = {};
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    fields.forEach((field) => {
      const value = data[field] || "";

      if (["username", "name", "email", "phone"].includes(field)) {
        if (!value.trim()) {
          tempErrors[field] = "This field is required";
        }
      }

      if (field === "username" && value.length < 3) tempErrors[field] = "Username must be at least 3 characters.";
      if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
      if (field === "phone" && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
      if (field === "email" && !emailRegex.test(value)) tempErrors[field] = "Please enter a valid email address.";
    });

    return tempErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tempErrors = validateForm(fields, data);
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length === 0) {
      onSubmit();
    }
  }; // Handles form submission, validates the form, and calls the onSubmit prop if there are no errors

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
                <label className="block mb-1 text-sm font-medium text-[#4B5563] capitalize">
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  value={data[field] || ""}
                  placeholder={`Enter ${field}`}
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
              <label className="block mb-1 text-sm font-medium text-[#4B5563] capitalize">
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

export default AdminDetails;