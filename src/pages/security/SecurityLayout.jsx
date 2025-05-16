import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaCheck } from "react-icons/fa";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";

function SecurityLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
   const [userName, setUserName] = useState(""); // 🔹 new state for username

   // 🔹 Load userName from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.username) {
      setUserName(storedUser.username);
    }
  }, []);


  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/security" },
    {
      icon: <FaCheck />,
      description: "Verify Visitors",
      route: "/security/visitor",
    },
    { icon: <FaUser />, description: "Profile", route: "/security/profile" },
  ];

  // Dynamic page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/security") return "Dashboard";
    if (path === "/security/visitor") return "Verify Visitors";
    if (path === "/security/profile") return "Profile";
    return "Security"; // Fallback
  };

  return (
    <div className="flex h-screen w-full bg-white relative">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20`}
      >
        <Sidebar
          items={sidebarItems}
          hide={() => setSidebarVisible(false)}
          onItemClick={(route) => {
            navigate(route);
            setSidebarVisible(false);
          }}
        />
      </div>

      {/* Overlay when sidebar is visible */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={() => setSidebarVisible(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div
          className={`transition-all duration-300 ${
            isSidebarVisible ? "blur-xs pointer-events-none" : ""
          }`}
        >
          <Headerbar
            toggleSidebar={() => setSidebarVisible(!isSidebarVisible)}
            userName={userName || "Host"} // 🔹 use dynamic username
            userRole="Staff account"
            pageTitle={getPageTitle()}
            pageSubtitle="Security"
          />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default SecurityLayout;
