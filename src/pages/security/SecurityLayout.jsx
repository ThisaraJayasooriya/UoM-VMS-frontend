import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaUser, FaCheck } from "react-icons/fa";
import Sidebar from "../../components/common/Sidebar";
import Headerbar from "../../components/common/Headerbar";

function SecurityLayout() {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <FaTachometerAlt />, description: "Dashboard", route: "/security" },
    { icon: <FaCheck />, description: "Verify Visitors", route: "/security/visitor" },
    { icon: <FaUser />, description: "Profile", route: "/security/profile" },
  ];

  const currentTitle = sidebarItems.find(item => item.route === window.location.pathname)?.description;

  return (
    <div className="h-screen w-full bg-gray-100 relative">
      {isSidebarVisible && (
        <div className="fixed inset-0 bg-opacity-50 z-10" onClick={() => setSidebarVisible(false)}></div>
      )}
      <div className={`transition-all duration-300 ${isSidebarVisible ? "blur-xs pointer-events-none" : ""}`}>
        <Headerbar
          toggleSidebar={() => setSidebarVisible(!isSidebarVisible)}
          userName="Kevin"
          userRole="Staff account"
          pageTitle={currentTitle}
          pageSubtitle="Security"
        />
        <Outlet />
      </div>
      <div
        className={`fixed inset-y-0 left-0 transform ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out z-20`}
      >
        <Sidebar
          items={sidebarItems}
          hide={() => setSidebarVisible(false)}
          onItemClick={(route) => {
            navigate(route);
            setSidebarVisible(false);
          }}
        />
      </div>
    </div>
  );
}

export default SecurityLayout;
