import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import {
    FaTachometerAlt,
    FaUser,
    FaCheck,
    FaCog,
  } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";


function SecurityLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/security" },
    { icon: <FaCheck />, description: "Verify Visitors", route: "/security/visitor" },
    { icon: <FaUser />, description: "Profile", route: "/security/profile" },
    { icon: <FaCog />, description: "Settings", route: "/security/settings" },
  ];

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      {isSidebarVisible && (
        <div
          className="fixed inset-0  bg-opacity-50 z-10"
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
          userName="Kevin"
          userRole="Staff account"
          pageTitle={sidebarItems.find((item) => item.route === window.location.pathname)?.description}
          pageSubtitle="Security"
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

export default SecurityLayout;
