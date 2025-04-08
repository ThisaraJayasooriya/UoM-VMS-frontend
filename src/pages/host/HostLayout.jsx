
import { Outlet } from 'react-router-dom'
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
      description: "Meeting Requests",
      route: "/host/meeting",
    },
    { icon: <FaUsers />, description: "Visitors", route: "/host/visitor" },
    {
      icon: <FaCalendarAlt />,
      description: "Appointments",
      route: "/host/appointment",
    },
    { icon: <FaUser />, description: "Profile", route: "/host/profile" },
    { icon: <FaCog />, description: "Settings", route: "/host/settings" },
  ];

  return (
    <div className="h-screen w-full bg-white relative">
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
        userName="john"
        userRole="Staff account"
        pageTitle={sidebarItems.find((item) => item.route === window.location.pathname)?.description}
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
  )
}

export default HostLayout
