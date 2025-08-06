import { FaUser, FaIdCard, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { fetchUserProfile } from "../../services/userProfileService"; 
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRemember");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userData");
    navigate("/");
  };

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

  if (!profile) return <div className="pt-20 px-4">Loading profile...</div>;

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-[#124E66] p-6 text-white">
            <div className="flex items-center">
              <div className="bg-[#748D92] p-3 rounded-full mr-4">
                <FaUser className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center mt-1">
                  <span className="bg-[#2E3944] text-xs px-2 py-1 rounded-full">Admin</span>
                  <span className="ml-3 text-sm opacity-90">ID: {profile.userID}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* NIC Section */}
              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaIdCard className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">NIC Number</h3>
                </div>
                <p className="text-[#2E3944]">{profile.nicNumber}</p>
              </div>

              {/* Email Section */}
              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaEnvelope className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">Email Address</h3>
                </div>
                <p className="text-[#2E3944]">{profile.email}</p>
              </div>

              {/* Phone Section */}
              <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
                <div className="flex items-center mb-3">
                  <FaPhone className="text-[#124E66] mr-2" />
                  <h3 className="font-semibold text-[#212A31]">Phone Number</h3>
                </div>
                <p className="text-[#2E3944]">0112345678</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-[#F8FAF9] px-6 py-4 border-t border-[#D3D9D2] flex justify-end">
            {/* ✅ Removed Edit Profile button */}
            <button
              className="bg-[#748D92] text-white px-4 py-2 rounded-md hover:bg-[#5A7176] transition-colors duration-200"
              onClick={logout}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
