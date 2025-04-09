import React from 'react'
import { Outlet } from 'react-router-dom'
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import { IoMdNotificationsOutline } from "react-icons/io";
import {
  FaTachometerAlt,
  FaUser,
 
 
} from "react-icons/fa";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";


function VisitorLayout() {
     const [isSidebarVisible, setSidebarVisible] = useState(false);
    
      const navigate = useNavigate();
    
      const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
      };
    
      const hideSidebar = () => {
        setSidebarVisible(false);
      };
    
      const sidebarItems = [
        { icon: <FaTachometerAlt />, description: "Dashboard", route: "/visitor" },
        { icon: <FaUser />, description: "Profile", route: "/host/profile" },
        { icon: <IoMdNotificationsOutline />, description: "Notification", route: "/host/notification" },
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
            pageSubtitle="Visitor"
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

export default VisitorLayout
