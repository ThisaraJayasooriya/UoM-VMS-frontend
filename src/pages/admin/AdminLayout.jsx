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
} from "react-icons/fa";

function AdminLayout() {
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
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/admin" },
    { icon: <FaBook />, description: "User Details", route: "/admin/userdetails" },

    
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
    "/admin/AdminReports": "Reports",
    "/admin/adminInsights": "Insights",
    "/admin/settings": "Settings",
    "/admin/VisitorLogbook": "Visitor Logbook",       
    "/admin/VisitorHistoryReport": "Visitor History Report"  
  };
   
   
  // Dynamic page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/userdetails/visitor")) return "Visitor Details";
    if (path.includes("/admin/userdetails/host")) return "Host Details";
    if (path.includes("/admin/userdetails/security")) return "Security Details";
    if (path.includes("/admin/userdetails/admin")) return "Admin Details";
    if (path.includes("/admin/userdetails")) return "User Details"; // Default if inside userdetails
    if (path.includes("/admin/visitorlogbook")) return "Visitor Logbook";
    if (path.includes("/admin/visitorhistoryreport")) return "Visitor History Report";
    if (path.includes("/admin/settings")) return "Settings";
    return "Dashboard"; // fallback
  };

  return (
    <div className="h-screen w-full bg-white relative">
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={hideSidebar}
        ></div>
      )}
      <div className={`transition-all duration-300 ${isSidebarVisible ? "blur-xs pointer-events-none" : ""}`}>
        <Headerbar
          toggleSidebar={toggleSidebar}
          userName="Nick"
          userRole="Admin account"
          pageTitle={getPageTitle()} // <-- dynamic page title
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
  );
}

export default AdminLayout;
