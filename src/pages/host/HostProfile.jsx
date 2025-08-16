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
import { fetchUserProfile } from "../../services/userProfileService"; 

const HostProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRemember");
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("userData");
    navigate("/");
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsInitialLoading(true);
        // Add a small delay to show the loading animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const userData = JSON.parse(localStorage.getItem("userData"));
        if (userData?.id) {
          const data = await fetchUserProfile(userData.id);
          setProfile(data);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (!profile && !isInitialLoading) return <div className="pt-20 px-4">Loading profile...</div>;

  // Skeleton Loading Component
  const SkeletonLoader = () => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-[#124E66] p-6">
        <div className="flex items-center">
          <div className="bg-[#748D92] p-3 rounded-full mr-4 w-14 h-14"></div>
          <div>
            <div className="h-6 bg-[#748D92] rounded w-48 mb-2"></div>
            <div className="flex items-center">
              <div className="h-4 bg-[#748D92] rounded w-12 mr-3"></div>
              <div className="h-4 bg-[#748D92] rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Skeleton */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="bg-[#F8FAF9] p-4 rounded-lg border border-[#D3D9D2]">
              <div className="flex items-center mb-3">
                <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          ))}
        </div>

        {/* Status Skeleton */}
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="bg-[#F8FAF9] px-6 py-4 border-t border-[#D3D9D2] flex justify-end">
        <div className="h-9 w-20 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  // Inject CSS keyframes for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes bounceGentle {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-4px); }
        60% { transform: translateY(-2px); }
      }
      
      @keyframes pulseSlow {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      
      .animate-fade-in { animation: fadeIn 0.6s ease-out; }
      .animate-slide-up { animation: slideUp 0.5s ease-out; }
      .animate-slide-in { animation: slideIn 0.5s ease-out; }
      .animate-bounce-gentle { animation: bounceGentle 2s infinite; }
      .animate-pulse-slow { animation: pulseSlow 3s ease-in-out infinite; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="pt-20 px-4 lg:px-20 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Show skeleton loader while initial loading */}
        {isInitialLoading ? (
          <div className="animate-slide-up">
            <SkeletonLoader />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="bg-[#124E66] p-6 text-white">
              <div className="flex items-center">
                <div className="bg-[#748D92] p-3 rounded-full mr-4 animate-pulse-slow">
                  <FaUser className="text-2xl animate-bounce-gentle" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{profile?.name}</h1>
                  <div className="flex items-center mt-1">
                    <span className="bg-[#2E3944] text-xs px-2 py-1 rounded-full animate-slide-in">
                      Host
                    </span>
                    <span className="ml-3 text-sm opacity-90">
                      ID: {profile?.userID}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileField
                  icon={<FaIdCard />}
                  label="NIC Number"
                  value={profile?.nicNumber || "N/A"}
                />
                <ProfileField
                  icon={<FaEnvelope />}
                  label="Email Address"
                  value={profile?.email}
                />
                <ProfileField
                  icon={<FaPhone />}
                  label="Phone Number"
                  value={profile?.phone || "N/A"}
                />
                <ProfileField
                  icon={<FaUserGraduate />}
                  label="Faculty"
                  value={profile?.faculty || "N/A"}
                />
                <ProfileField
                  icon={<FaLandmark />}
                  label="Department"
                  value={profile?.department || "N/A"}
                />
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
        )}
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
