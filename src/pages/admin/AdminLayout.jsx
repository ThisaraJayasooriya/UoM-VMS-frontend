import React from 'react'
import { Outlet } from 'react-router-dom'
import { useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import {
  FaTachometerAlt,
  FaUser,
  FaChalkboardTeacher,
  FaCog,
  FaUsers,
  FaBook,
  FaChartBar,
} from "react-icons/fa";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";


function AdminLayout() {
    const [isSidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/admin" },
    {
      icon: <FaBook />,
      description: "User Details",
      route: "/admin/userdetails",
    },
    { icon: <FaUsers />, description: "Staff Registration", route: "/admin/staffregistration" },
    {
      icon: <FaChalkboardTeacher />,
      description: "Visitor Logbook",
      route: "/admin/visitorlogbook",
    },

    {
        icon: <FaChartBar/>,
        description: "Reports & Analytics",
        route: "/admin/adminreports",
      },

    
    { icon: <FaCog />, description: "Settings", route: "/admin/settings" },
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
        userName="Nick"
        userRole="Admin account"
        pageTitle={sidebarItems.find((item) => item.route === window.location.pathname)?.description}
        pageSubtitle="Admin"
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

export default AdminLayout
