import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import {
  FaTachometerAlt,
  FaUser,
  FaCalendarAlt,
  FaCog,
  FaUsers,
  FaCalendarPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HostLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/host" },
    {
      icon: <FaCalendarPlus />,
      description: "Appointment Details",
      route: "/host/appointmentdetails",
    },
    { icon: <FaUsers />, description: "Visit Log", route: "/host/visitlog" },
    { icon: <FaCog />, description: "Profile", route: "/host/profile" },
  ];

  // Function to get current page title based on route
  const getCurrentPageTitle = () => {
    const path = location.pathname;
    if (path === "/host") return "Dashboard";
    if (path === "/host/appointmentdetails") return "Appointment Details";
    if (path === "/host/visitlog") return "Visit Log";
    if (path === "/host/profile") return "Profile";
    return "Host"; // Fallback
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
          hide={hideSidebar}
          onItemClick={(route) => {
            navigate(route);
            hideSidebar();
          }}
        />
      </div>

      {/* Overlay when sidebar is visible */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={hideSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Headerbar
          toggleSidebar={toggleSidebar}
          userName="John"
          userRole="Staff account"
          type={state.name || "Unknown"} // Fallback for undefined state.name
          pageTitle={getCurrentPageTitle()}
          pageSubtitle="Host"
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HostLayout;