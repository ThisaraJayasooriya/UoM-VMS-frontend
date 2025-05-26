import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddHost = () => {
  // State for form input fields
  const [host, setHost] = useState({
    userID: "",
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    nicNumber: "",
    faculty: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fields = ["userID", "username", "name", "email", "phone", "password", "nicNumber", "faculty", "department"];

   // Form validation function
  const validateForm = (data) => {
    let tempErrors = {};
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    fields.forEach((field) => {
      const value = data[field] || "";

       // Check required fields
      if (["userID", "username", "name", "email", "phone", "password", "faculty", "department"].includes(field)) {
        if (!value.trim()) {
          tempErrors[field] = "This field is required";
        }
      }

      // Additional field-specific validations
      if (field === "userID" && value.length < 3) tempErrors[field] = "User ID must be at least 3 characters.";
      if (field === "username" && value.length < 3) tempErrors[field] = "Username must be at least 3 characters.";
      if (field === "name" && value.length < 3) tempErrors[field] = "Name must be at least 3 characters.";
      if (field === "phone" && value && !phoneRegex.test(value)) tempErrors[field] = "Phone number must be exactly 9 digits.";
      if (field === "email" && value && !emailRegex.test(value)) tempErrors[field] = "Please enter a valid email address.";
      if (field === "password" && value && !strongPasswordRegex.test(value)) {
        tempErrors[field] = "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
      }
    });

    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm(host);
    setErrors(tempErrors);


  // If no validation errors, proceed to submit data
    if (Object.keys(tempErrors).length === 0) {
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/staff/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...host, role: "host", registeredDate: new Date().toLocaleString() }),
        });

        const data = await res.json();

        // Check for successful response
        if (res.ok && data.success) {
          if (data.message.includes("email sent") || !data.message.includes("failed to send")) {
            toast.success("Host registered and email sent successfully!");
          } else {
            toast.warning("Host registered, but failed to send confirmation email.");
          }
          navigate("/admin/userdetails/host");
        } else {
          throw new Error(data.message || "Failed to add host");
        }
      } catch (err) {
        console.error("Submission error:", err);
        setErrors({ general: err.message });
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHost((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };
 
   // Cancel and go back to host list
  const handleCancel = () => {
    navigate("/admin/userdetails/host");
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-[#00000066] flex items-center justify-center z-50 px-4">
      <div className="bg-[#FFFFFF] w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#124E66] to-[#1d4756] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#FFFFFF]">Add New Host</h2>
          <button
            onClick={handleCancel}
            className="text-[#FFFFFF] text-2xl hover:opacity-80 transition"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field}>
                <label className="block mb-1 text-sm font-medium text-[#374151] capitalize">
                  {field} <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={host[field] || ""}
                  placeholder={`Enter ${field}`}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${
                    errors[field]
                      ? "border-[#EF4444] focus:ring-[#F87171]"
                      : "border-[#D1D5DB] focus:ring-[#3B82F6]"
                  } transition duration-200 bg-[#FFFFFF]`}
                  aria-required="true"
                  aria-invalid={!!errors[field]}
                  aria-describedby={errors[field] ? `error-${field}` : undefined}
                  disabled={isLoading}
                />
                {errors[field] && (
                  <p id={`error-${field}`} className="text-[#EF4444] text-sm mt-1">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>

          {errors.general && (
            <div className="col-span-full text-[#EF4444] text-sm mt-4 text-center">
              {errors.general}
            </div>
          )}
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-[#F3F4F6]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#E5E7EB] transition duration-200"
              aria-label="Cancel"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#124E66] to-[#1d4756] text-[#FFFFFF] rounded-lg hover:opacity-90 transition duration-200 shadow-sm"
              aria-label="Save and Send Email"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save and Send Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHost;