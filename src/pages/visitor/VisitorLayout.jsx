import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaTachometerAlt, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function VisitorLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/visitor" },
    { icon: <FaUser />, description: "Profile", route: "/visitor/profile" },
    { icon: <IoMdNotificationsOutline />, description: "Notification", route: "/visitor/notification" },
  ];

  // Function to get current page title based on route
  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => 
      location.pathname === item.route || 
      (item.route !== '/visitor' && location.pathname.startsWith(item.route))
    );
    return currentItem?.description || 'Dashboard';
  };

  return (
    <div className="h-screen w-full bg-white relative">
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
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
          pageTitle={getCurrentPageTitle()}
          pageSubtitle="Visitor"
        />
      
        <Outlet />
      </div>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-20 w-64`}
      >
        <Sidebar
          items={sidebarItems}
          hide={hideSidebar}
          onItemClick={(route) => {
            navigate(route);
            hideSidebar();
          }}
          currentPath={location.pathname}
        />
      </div>
    </div>
  );
}

export default VisitorLayout;