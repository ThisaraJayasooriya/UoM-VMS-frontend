import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";
import {
  FaTachometerAlt,
  FaUser,
  FaChalkboardTeacher,
  FaCog,
  FaBook,
  FaChartBar,
  FaUserTimes
} from "react-icons/fa";

function AdminLayout() {
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


  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const hideSidebar = () => {
    setSidebarVisible(false);
  };
 // Sidebar menu items with icons, labels, and routes
  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/admin" },
    { icon: <FaBook />, description: "User Details", route: "/admin/userdetails" },

    { 
    icon: <FaUserTimes />, 
    description: "Access Control", 
    route: "/admin/access-control" 
    },
    {
      icon: <FaChalkboardTeacher />,
      description: "Reports",
      route: "/admin/adminreports",
    },
    {
      icon: <FaChartBar />,
      description: "Insights",
      route: "/admin/adminInsights",
    },
    { icon: <FaCog />, description: "Settings", route: "/admin/settings" },
  ];

  /*const pageTitles = {
    "/admin": "Dashboard",
    "/admin/userdetails": "User Details",
    "/admin/access-control": "Access Control",
    "/admin/adminreports": "Reports",
    "/admin/adminInsights": "Insights",
    "/admin/settings": "Settings",
    "/admin/visitorlogbook": "Visitor Logbook",
    "/admin/visitorhistoryreport": "Visitor History Report", 
    "/admin/visitorfeedbackreview": "Visitor Feedback Review"
  };*/

  // Dynamic page title based on route
  const getPageTitle = () => {
    const path = location.pathname;
    console.log("Current path for title evaluation:", path);
    if (path.includes("/admin/userdetails/visitor")) return "Visitor Details";
    if (path.includes("/admin/userdetails/host")) return "Host Details";
    if (path.includes("/admin/userdetails/security")) return "Security Details";
    if (path.includes("/admin/userdetails/admin")) return "Admin Details";
    if (path.includes("/admin/userdetails")) return "User Details";
    if (path.includes("/admin/access-control")) return "Access Control";
    if (path.includes("/admin/adminreports")) return "Reports";
    if (path.includes("/admin/visitorlogbook")) return "Visitor Logbook";
    if (path.includes("/admin/visitorhistoryreport")) return "Visitor History Report";
    if (path.includes("/admin/visitorfeedbackreview")) return "Visitors' Feedback Review";
    if (path.includes("/admin/adminInsights")) return "Insights";
    if (path.includes("/admin/settings")) return "Settings";
    if (path.includes("/notifications")) return "All Notifications";
    return "Dashboard";
  };

  return (
  
    <div className="flex h-screen w-full bg-white relative">
        {/* Overlay behind sidebar (when open) */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={hideSidebar}
        ></div>
      )}
      <div className={`flex-1 flex flex-col w-full h-full transition-all duration-300 ${isSidebarVisible ? "blur-xs pointer-events-none" : ""}`}>
        {/* Header bar with page title, user info, and sidebar toggle */}
        <Headerbar
          toggleSidebar={toggleSidebar}
          userName={userName || "Admin"} // 🔹 use dynamic username
          userRole="Admin account"
          type={state.name}
          pageTitle={getPageTitle()}   // Dynamic title
          pageSubtitle="Admin"
        />
        <main className="flex-1 min-h-0">
          <Outlet />
          {console.log("Outlet rendered for path:", location.pathname)}
        </main>
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
            console.log("Navigating to:", route);
            navigate(route);
            hideSidebar();
          }}
        />
      </div>
    </div>
  );
}

export default AdminLayout;