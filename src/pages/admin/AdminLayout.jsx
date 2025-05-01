import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
  FaClipboardList
} from "react-icons/fa";

function AdminLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Using location hook

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/admin" },
    { icon: <FaBook />, description: "User Details", route: "/admin/userdetails" },
    { icon: <FaUsers />, description: "Staff Registration", route: "/admin/staffregistration" },
    {
      icon: <FaChalkboardTeacher />,
      description: "Reports",
      route: "/admin/AdminReports",
    },

    {
        icon: <FaChartBar/>,
        description: "Insights",
        route: "/admin/adminInsights",
      },

    
    { icon: <FaCog />, description: "Settings", route: "/admin/settings" },
  ];

  const pageTitles = {
    "/admin": "Dashboard",
    "/admin/userdetails": "User Details",
    "/admin/staffregistration": "Staff Registration",
    "/admin/AdminReports": "Reports",
    "/admin/adminInsights": "Insights",
    "/admin/settings": "Settings",
    "/admin/VisitorLogbook": "Visitor Logbook",       
    "/admin/VisitorHistoryReport": "Visitor History Report"  
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
        className={`transition-all duration-300 ${isSidebarVisible ? "blur-xs pointer-events-none" : ""}`}
      >
        <Headerbar
          toggleSidebar={toggleSidebar}
          userName="Nick"
          userRole="Admin account"
          pageTitle={pageTitles[location.pathname] || "Unknown Page"} // Default to "Unknown Page"
          pageSubtitle="Admin"
        />

        <Outlet />
      </div>

      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-20`}
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

export default AdminLayout;
