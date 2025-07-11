import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaIdCard, FaEnvelope, FaPhone } from "react-icons/fa";
import { fetchUserProfile } from "../../services/userProfileService"; 

const SecurityProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


 useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.id) {
      fetchUserProfile(userData.id)
        .then((data) => setProfile(data))
        .catch((err) => {
          console.error("Error loading profile", err);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  if (error) return <div className="text-red-600 p-6">{error}</div>;
  if (!profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          {/* Header */}
          <div className="bg-[#124E66] p-6 text-white">
            <div className="flex items-center">
              <div className="bg-[#748D92] p-3 rounded-full mr-4">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center mt-1">
                  <span className="bg-[#2E3944] text-xs px-2 py-1 rounded-full capitalize">{profile.role}</span>
                  <span className="ml-3 text-sm opacity-90">ID: {profile.userID}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaIdCard className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">NIC Number</h3>
                </div>
                <p className="text-[#2E3944]">{profile.nicNumber || "Not Provided"}</p>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaEnvelope className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">Email Address</h3>
                </div>
                <p className="text-[#2E3944]">{profile.email}</p>
              </div>

              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaPhone className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">Phone Number</h3>
                </div>
                <p className="text-[#2E3944]">{profile.phone || "Not Provided"}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-semibold text-[#212A31] mb-4">
                Security Personnel's Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#748D92]">Registered Date</h4>
                  <p className="text-[#2E3944]">{new Date(profile.registeredDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-[#748D92]">Status</h4>
                  <p className={`font-medium ${profile.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {profile.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAF9] px-6 py-4 border-t border-[#D3D9D2] flex justify-end">
            <button
              onClick={handleLogout}
              className="bg-[#748D92] text-white px-4 py-2 rounded-md hover:bg-[#5A7176] transition-colors duration-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityProfile;
