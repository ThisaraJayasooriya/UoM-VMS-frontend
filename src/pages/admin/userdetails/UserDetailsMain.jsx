import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

const UserDetailsMain = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const cards = [
    {
      title: "Visitor Details",
      description: "View, add, edit and manage visitors",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      route: "/admin/userdetails/visitor",
    },
    {
      title: "Host Details",
      description: "View, add, edit and manage hosts",
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      route: "/admin/userdetails/host",
    },
    {
      title: "Security Details",
      description: "View, add, edit and manage security users",
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
      route: "/admin/userdetails/security",
    },
    {
      title: "Admin Details",
      description: "View, add, edit and manage admins",
      color: "bg-red-50 border-red-200 hover:bg-red-100",
      route: "/admin/userdetails/admin",
    },
  ];

  // Check if we're on the exact /admin/userdetails path (no nested route)
  const isBasePath = location.pathname === "/admin/userdetails";

  return (
    <div className="pt-24 px-6 md:px-20">
      <h2 className="text-4xl font-extrabold text-center mb-12 text-[#124E66] tracking-wide">
        User Details Management
      </h2>

      {/* Show cards only on the base /admin/userdetails path */}
      {isBasePath && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className={`border ${card.color} rounded-2xl p-8 shadow-md hover:shadow-lg transition-all transform hover:scale-105 cursor-pointer`}
            >
              <div className="flex flex-col justify-center items-center">
                <h3 className="text-2xl font-bold mb-2 text-gray-700">{card.title}</h3>
                <p className="text-center text-gray-500">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render nested routes */}
      <Outlet />
    </div>
  );
};

export default UserDetailsMain;