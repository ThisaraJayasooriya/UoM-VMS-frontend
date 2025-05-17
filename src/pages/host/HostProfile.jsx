import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaUserGraduate,
  FaLandmark,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHostProfile } from "../../services/userProfileService"; 

const HostProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRemember");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.id) {
      fetchHostProfile(userData.id)
        .then((data) => setProfile(data))
        .catch((err) => {
          console.error("Error loading profile", err);
        });
    }
  }, []);

  if (!profile) return <div className="pt-20 px-4">Loading profile...</div>;

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div className="max-w-5xl mx-auto">
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
                  <span className="bg-[#2E3944] text-xs px-2 py-1 rounded-full">
                    Host
                  </span>
                  <span className="ml-3 text-sm opacity-90">
                    ID: {profile.userID}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField
                icon={<FaIdCard />}
                label="NIC Number"
                value={profile.nicNumber || "N/A"}
              />
              <ProfileField
                icon={<FaEnvelope />}
                label="Email Address"
                value={profile.email}
              />
              <ProfileField
                icon={<FaPhone />}
                label="Phone Number"
                value={profile.phone || "N/A"}
              />
              <ProfileField
                icon={<FaUserGraduate />}
                label="Faculty"
                value={profile.faculty || "N/A"}
              />
              <ProfileField
                icon={<FaLandmark />}
                label="Department"
                value={profile.department || "N/A"}
              />
            </div>

            {/* Status */}
            <div className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-[#748D92]">
                    Status
                  </h4>
                  <p
                    className={`font-medium ${
                      profile.status === "active"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {profile.status}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#F8FAF9] px-6 py-4 border-t border-[#D3D9D2] flex justify-end">
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

const ProfileField = ({ icon, label, value }) => (
  <div className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
    <div className="flex items-center mb-3">
      <div className="text-[#124E66] mr-2">{icon}</div>
      <h3 className="font-semibold text-[#212A31]">{label}</h3>
    </div>
    <p className="text-[#2E3944]">{value}</p>
  </div>
);

export default HostProfile;
