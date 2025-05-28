import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { 
  FiUsers, 
  FiShield, 
  FiHome, 
  FiUserCheck,
  FiUserPlus,
  FiKey,
  FiSettings,
  FiClipboard
} from "react-icons/fi";

const UserDetailsMain = () => {
  // Hooks to navigate programmatically and get the current route path
  const navigate = useNavigate();
  const location = useLocation();

  // Configuration for each user management card (icon, title, description, and route)
  const cards = [
    {
      title: "Visitors",
      description: "Manage visitor accounts and permissions",
      icon: <FiUsers className="text-3xl" />,
      secondaryIcon: <FiUserPlus className="absolute -right-2 -bottom-2 text-xl bg-[#124E66] p-1 rounded-full" />,
      route: "/admin/userdetails/visitor",
    },
    {
      title: "Hosts",
      description: "Manage host accounts and properties",
      icon: <FiHome className="text-3xl" />,
      secondaryIcon: <FiKey className="absolute -right-2 -bottom-2 text-xl bg-[#124E66] p-1 rounded-full" />,
      route: "/admin/userdetails/host",
    },
    {
      title: "Security",
      description: "Manage security personnel access",
      icon: <FiShield className="text-3xl" />,
      secondaryIcon: <FiSettings className="absolute -right-2 -bottom-2 text-xl bg-[#124E66] p-1 rounded-full" />,
      route: "/admin/userdetails/security",
    },
    {
      title: "Admins",
      description: "Manage administrator privileges",
      icon: <FiUserCheck className="text-3xl" />,
      secondaryIcon: <FiClipboard className="absolute -right-2 -bottom-2 text-xl bg-[#124E66] p-1 rounded-full" />,
      route: "/admin/userdetails/admin",
    },
  ];

  // Check if current path is exactly "/admin/userdetails" to show the card view
  const isBasePath = location.pathname === "/admin/userdetails";

  return (
    <div className="pt-25 px-4 lg:px-2">
      {/* If on the base route, show the dashboard cards */}
      {isBasePath && (
        <>
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#212A31] mb-2">User Management Portal</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Centralized dashboard for managing all user accounts and access privileges
            </p>
          </div>

          {/* Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => navigate(card.route)} // Navigate to respective user role route
               className={`rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group border 
                ${card.title === "Visitors"
                  ? "bg-gradient-to-br  from-[#212A31] to-[#00b7ff] border-[#4f7381]"
                  : "bg-gradient-to-br from-[#212A31] to-[#2f7e9d] border-[#2E6B82]"
                }`}

              >
                <div className="flex flex-col items-center text-center text-white h-full">
                  {/* Icon and secondary badge */}
                  <div className="relative mb-6">
                    <div className="bg-[#124E66] p-4 rounded-full group-hover:bg-[#2E6B82] transition-all">
                      {card.icon}
                    </div>
                    {card.secondaryIcon}
                  </div>
                  {/* Title and description */}
                  <h3 className="text-2xl font-bold mb-3">{card.title}</h3>
                  <p className="text-blue-200 mb-6">{card.description}</p>
                  {/* View Details CTA */}
                  <div className="w-full mt-auto">
                    <div className="w-full py-2 text-blue-100 group-hover:text-white font-medium rounded-lg transition-colors">
                      View Details →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Render nested routes when navigating to details pages */}
      <Outlet />
    </div>
  );
};

export default UserDetailsMain;
