import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profilePhoto from "../../assets/profile.jpeg"; // Default profile photo
import { fetchUserProfile, updateUserProfile } from "../../services/userProfileService";

function VisitorEditProfile() {
  const navigate = useNavigate();
  const [selectedPhoto, setSelectedPhoto] = useState(profilePhoto);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nicNumber: "",
    email: "",
    phoneNumber: ""
  });

  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Set the page name for the header
    localStorage.setItem("name", "Edit Profile");
    
    // Get user ID and fetch profile data
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.id) {
      setUserId(userData.id);
      loadUserProfile(userData.id);
    } else {
      setErrorMessage("User not logged in");
    }
  }, []);

  const loadUserProfile = async (id) => {
    try {
      setIsLoading(true);
      const profile = await fetchUserProfile(id);
      
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        nicNumber: profile.nicNumber || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || ""
      });
    } catch (error) {
      console.error("Error loading profile:", error);
      setErrorMessage("Failed to load profile data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) {
      errors.push("First name is required");
    }
    
    if (!formData.lastName.trim()) {
      errors.push("Last name is required");
    }
    
    if (!formData.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.push("Email format is invalid");
    }
    
    if (!formData.phoneNumber.trim()) {
      errors.push("Phone number is required");
    } else if (!/^(?:\+94|94|0)?7\d{8}$/.test(formData.phoneNumber)) {
      errors.push("Invalid Sri Lankan phone number format");
    }
    
    if (!formData.nicNumber.trim()) {
      errors.push("NIC number is required");
    } else if (!/^(\d{9}[VXvx]|\d{12})$/.test(formData.nicNumber)) {
      errors.push("Invalid NIC format (use 123456789V or 200012345678)");
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await updateUserProfile(userId, formData);
      
      if (result.success) {
        setIsSuccess(true);
        
        // Update localStorage with new data
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const updatedUserData = { 
          ...userData, 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          nicNumber: formData.nicNumber
        };
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
        
        // Show success message for 3 seconds then hide
        setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div>
        <div className="flex justify-center items-center mb-8">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <div className="w-36 h-36 bg-blue2 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={selectedPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        {/* Loading state */}
        {isLoading && (
          <div className="text-center mb-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#124E66]"></div>
            <p className="mt-2 text-[#748D92]">Loading...</p>
          </div>
        )}
        
        {/* Success message */}
        {isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your profile has been updated successfully.</span>
          </div>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border border-[#D3D9D2] rounded-lg p-2 focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                placeholder="Enter your first name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border border-[#D3D9D2] rounded-lg p-2 focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                NIC Number *
              </label>
              <input
                type="text"
                name="nicNumber"
                value={formData.nicNumber}
                onChange={handleInputChange}
                className="w-full border border-[#D3D9D2] rounded-lg p-2 focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                placeholder="Enter your NIC number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-[#D3D9D2] rounded-lg p-2 focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-black mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full border border-[#D3D9D2] rounded-lg p-2 focus:ring-2 focus:ring-[#124E66] focus:outline-none"
                placeholder="Enter your phone number"
                required
              />
            </div>
          </div>
          
          <div className="mt-6 text-sm text-[#748D92]">
            <p>* Required fields</p>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="bg-[#748D94] text-white px-4 py-2 rounded-md hover:bg-[#5a7179] transition-colors duration-200"
              onClick={() => {
                localStorage.removeItem("authToken");
                window.location.href = "/forgot-password";
              }}
            >
              Reset Password
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200' 
                  : 'bg-[#124E66] hover:bg-[#0E3D52] text-white'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisitorEditProfile;