import React, { useState, useEffect } from "react";
import profilePhoto from "../../assets/profile.jpeg"; // Default profile photo

function VisitorEditProfile() {
  const [selectedPhoto, setSelectedPhoto] = useState(profilePhoto); // State to store the selected photo

  useEffect(() => {
    // Set the page name for the header
    localStorage.setItem("name", "Edit Profile");
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedPhoto(e.target.result); // Update the photo preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div>
        <div className="flex justify-center items-center mb-8">
          <label htmlFor="profilePhotoInput" className="cursor-pointer">
            <div className="w-36 h-36 bg-blue2 rounded-full overflow-hidden flex items-center justify-center">
              <img
                src={selectedPhoto} // Display the selected or default photo
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            className="hidden" // Hide the input element
            onChange={handlePhotoChange}
          />
        </div>
      </div>
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full border border-[#D3D9D2] rounded-lg p-2"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                NIC Number
              </label>
              <input
                type="text"
                className="w-full border border-[#D3D9D2] rounded-lg p-2"
                placeholder="Enter your NIC number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full border border-[#D3D9D2] rounded-lg p-2"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Phone Number
              </label>
              <input
                type="text"
                className="w-full border border-[#D3D9D2] rounded-lg p-2"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-[#124E66] text-white px-4 py-2 rounded-md hover:bg-[#0E3D52] transition-colors duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VisitorEditProfile;