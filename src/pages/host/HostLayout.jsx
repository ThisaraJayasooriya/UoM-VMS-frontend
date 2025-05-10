import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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

function HostLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userName, setUserName] = useState(""); // 🔹 new state for username

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  // 🔹 Load userName from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData")); // adjust key based on your login
    if (storedUser && storedUser.username) {
      setUserName(storedUser.username);
    }
  }, []);

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

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(
      (item) =>
        location.pathname === item.route ||
        (item.route !== "/host" && location.pathname.startsWith(item.route))
    );
    return currentItem?.description || "Appointment Details";
  };

  return (
    <div className="h-screen w-full bg-white relative">
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={hideSidebar}
        ></div>
      )}
      <div
        className={`transition-all duration-300 ${
          isSidebarVisible ? "blur-xs pointer-events-none" : ""
        }`}
      >
        <Headerbar
          toggleSidebar={toggleSidebar}
          userName={userName || "Host"} // 🔹 use dynamic username
          userRole="Staff account"
          type={state.name}
          pageTitle={getCurrentPageTitle()}
          pageSubtitle="Host"
        />

        <Outlet />
      </div>
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
    </div>
  );
}

export default HostLayout;
