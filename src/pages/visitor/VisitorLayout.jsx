import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useState,useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import { FaTachometerAlt, FaUser,FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";


function VisitorLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const [userName, setUserName] = useState("");

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

  const handleUserClick = () => {
    navigate("/visitor/settings");
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/visitor" },
    { icon: <FaCog />, description: "Settings", route: "/visitor/settings" },
    
   
  ];

  // Function to get current page title based on route
  const getCurrentPageTitle = () => {
    if (location.pathname === "/visitor/editprofile") {
      return "Edit Profile"; // Set the title for the Edit Profile page
    }
    if (location.pathname === "/visitor/settings") {
      return "Settings"; // Set the title for the Settings page
    }
  
    const currentItem = sidebarItems.find(item => 
      location.pathname === item.route || 
      (item.route !== '/visitor' && location.pathname.startsWith(item.route))
    );
    return currentItem?.description || 'Dashboard';
  };

  const selectedTitle = localStorage.getItem("name");


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
          userName={userName || "Visitor"} 
          userRole="Visitor account"
          type= {selectedTitle || "Dashboard"}
          pageTitle={getCurrentPageTitle()}
          pageSubtitle="Visitor"
          onUserClick={handleUserClick} // Pass the handler to Headerbar
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

