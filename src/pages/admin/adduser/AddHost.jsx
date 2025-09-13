import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AddHost = () => {
  const [host, setHost] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    nicNumber: "",
    // sent to backend:
    position: "",
    faculty: "",
    department: "",
  });

  // UI-only category to drive which position list / fields show
  const [memberType, setMemberType] = useState(""); // "Academic" | "Non Academic"
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [ setSelectedFaculty] = useState("");
  const navigate = useNavigate();

  const getFieldLabel = (field) => {
    const labels = {
      phone: "Phone Number",
      nicNumber: "NIC Number",
      confirmPassword: "Confirm Password",
    };
    const label = labels[field] || field.replace(/([A-Z])/g, " $1").trim();
    return label.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const departmentOptions = {
    IT: ["IDS", "IT", "CM"],
    ENGINEERING: ["MECHANICAL", "CIVIL", "ENTC", "CHEMICAL"],
    ARCHITECTURE: ["DESIGN", "LANDSCAPE", "ARCHITECTURE"],
  };

  const positionOptionsByType = {
    Academic: [
      "Lecturer",
      "Senior Lecturer",
      "Assistant Professor",
      "Associate Professor",
      "Professor",
      "Instructor",
    ],
    "Non Academic": [
      "HR",
      "Librarian",
      "Clerical Staff",
      "Technical Staff",
      "IT Services",
      "Finance",
      "Maintenance Staff",
      "Student Affairs",
      "Procurement",
    ],
  };

  const validateForm = (data) => {
    let temp = {};
    const phoneRegex = /^[0-9]{9}$/;
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    // Always required
    ["username", "name", "email", "phone", "password", "confirmPassword" , "nicNumber"].forEach((f) => {
      if (!data[f]?.trim()) temp[f] = "This field is required";
    });
    if (!memberType) temp.memberType = "Please select a category";
    if (!data.position?.trim()) temp.position = "Please select a position";

    // Academic-only required
    if (memberType === "Academic") {
      if (!data.faculty?.trim()) temp.faculty = "This field is required";
      if (!data.department?.trim()) temp.department = "This field is required";
    }

    if (data.username && data.username.length < 3) temp.username = "Username must be at least 3 characters.";
    if (data.name && data.name.length < 3) temp.name = "Name must be at least 3 characters.";
    if (data.phone && !phoneRegex.test(data.phone)) temp.phone = "Phone number must be exactly 9 digits.";
    if (data.email && !emailRegex.test(data.email)) temp.email = "Please enter a valid email address.";
    if (data.password && !strongPasswordRegex.test(data.password)) {
      temp.password = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
    }
    if (data.confirmPassword && data.password !== data.confirmPassword) {
      temp.confirmPassword = "Passwords do not match";
    }

    // Ensure position matches selected category
    if (memberType && data.position && !positionOptionsByType[memberType]?.includes(data.position)) {
      temp.position = "Please select a valid position for this category.";
    }

    return temp;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tempErrors = validateForm(host);
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length) return;

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: host.username,
          name: host.name,
          email: host.email,
          phone: host.phone,
          password: host.password,
          nicNumber: host.nicNumber,
          // Position always sent
          position: host.position,
          // Academic-only fields; send empty when Non Academic
          faculty: memberType === "Academic" ? host.faculty : "",
          department: memberType === "Academic" ? host.department : "",
          role: "host",
          registeredDate: new Date().toLocaleString(),
        }),
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        toast.success("Host registered successfully!");
        navigate("/admin/userdetails/host");
      } else {
        throw new Error(data?.message || "Failed to add host");
      }
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message });
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Category switch
    if (name === "memberType") {
      setMemberType(value);
      setHost((prev) => ({
        ...prev,
        position: "", // require reselect
        faculty: value === "Academic" ? prev.faculty : "",
        department: value === "Academic" ? prev.department : "",
      }));
      setSelectedFaculty("");
      setErrors((prev) => ({ ...prev, memberType: "", position: "", faculty: "", department: "", general: "" }));
      return;
    }

    if (name === "faculty") setSelectedFaculty(value);
    setHost((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleCancel = () => navigate("/admin/userdetails/host");

  const togglePasswordVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-[#00000066] flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#124E66] to-[#1d4756] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Add New Host</h2>
          <button onClick={handleCancel} className="text-white text-2xl hover:opacity-80" aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-b from-[#F9FAFB] to-[#F3F4F6]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-[#374151]">Category <span className="text-[#EF4444]">*</span></label>
              <select
                name="memberType"
                value={memberType}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.memberType ? "border-[#EF4444] focus:ring-[#F87171]" : "border-[#D1D5DB] focus:ring-[#3B82F6]"} bg-white`}
                disabled={isLoading}
              >
                <option value="">Select Category</option>
                <option value="Academic">Academic</option>
                <option value="Non Academic">Non Academic</option>
              </select>
              {errors.memberType && <p className="text-[#EF4444] text-sm mt-1">{errors.memberType}</p>}
            </div>

            {/* Position (depends on Category) */}
            <div>
              <label className="block text-sm font-medium text-[#374151]">Position <span className="text-[#EF4444]">*</span></label>
              <select
                name="position"
                value={host.position}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.position ? "border-[#EF4444] focus:ring-[#F87171]" : "border-[#D1D5DB] focus:ring-[#3B82F6]"} bg-white`}
                disabled={isLoading || !memberType}
              >
                <option value="">{memberType ? "Select Position" : "Choose Category first"}</option>
                {memberType && positionOptionsByType[memberType]?.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.position && <p className="text-[#EF4444] text-sm mt-1">{errors.position}</p>}
            </div>

            {/* Always-required text fields */}
            {["username", "name", "email", "phone", "password", "confirmPassword", "nicNumber"].map((field) => (
              <div key={field} className="flex flex-col space-y-1">
                <label className="block text-sm font-medium text-[#374151]">
                  {getFieldLabel(field)} <span className="text-[#EF4444]">*</span>
                </label>
                {/* CHANGED: wrap input + icon in relative, move icon inside input, add pr-10 */}
                <div className="relative">
                  <input
                    type={
                      field === "password" || field === "confirmPassword"
                        ? (showPassword[field] ? "text" : "password")
                        : "text"
                    }
                    name={field}
                    value={host[field] || ""}
                    placeholder={field === "confirmPassword" ? "Confirm Password" : `Enter ${getFieldLabel(field)}`}
                    onChange={handleChange}
                    className={`w-full p-3 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors[field] ? "border-[#EF4444] focus:ring-[#F87171]" : "border-[#D1D5DB] focus:ring-[#3B82F6]"} bg-white`}
                    disabled={isLoading}
                    aria-invalid={!!errors[field]}
                  />
                  {(field === "password" || field === "confirmPassword") && (
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] hover:text-[#374151]"
                      aria-label={showPassword[field] ? "Hide password" : "Show password"}
                    >
                      {showPassword[field] ? <FiEye /> : <FiEyeOff />}
                    </button>
                  )}
                </div>
                {errors[field] && <p className="text-[#EF4444] text-sm">{errors[field]}</p>}
              </div>
            ))}

            {/* Academic-only fields */}
            {memberType === "Academic" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#374151]">
                    Faculty <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    name="faculty"
                    value={host.faculty}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.faculty ? "border-[#EF4444] focus:ring-[#F87171]" : "border-[#D1D5DB] focus:ring-[#3B82F6]"} bg-white`}
                    disabled={isLoading}
                  >
                    <option value="">Select Faculty</option>
                    {["IT", "ENGINEERING", "ARCHITECTURE"].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                  {errors.faculty && <p className="text-[#EF4444] text-sm mt-1">{errors.faculty}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#374151]">
                    Department <span className="text-[#EF4444]">*</span>
                  </label>
                  <select
                    name="department"
                    value={host.department}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errors.department ? "border-[#EF4444] focus:ring-[#F87171]" : "border-[#D1D5DB] focus:ring-[#3B82F6]"} bg-white`}
                    disabled={isLoading || !host.faculty}
                  >
                    <option value="">Select Department</option>
                    {host.faculty &&
                      departmentOptions[host.faculty]?.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                  </select>
                  {errors.department && <p className="text-[#EF4444] text-sm mt-1">{errors.department}</p>}
                </div>
              </>
            )}
          </div>

          {errors.general && <div className="text-center text-[#EF4444] text-sm mt-4">{errors.general}</div>}

          <div className="mt-6 flex justify-end gap-3 border-t pt-4 border-[#F3F4F6]">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-[#D1D5DB] text-[#374151] rounded-lg hover:bg-[#E5E7EB]"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-[#124E66] to-[#1d4756] text-white rounded-lg hover:opacity-90 shadow-sm"
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
