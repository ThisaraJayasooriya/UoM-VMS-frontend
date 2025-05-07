import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import HostDashboard from "./host/HostDashboard";
import SecurityDashboard from "./security/SecurityDashboard";

const StaffDashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  // Map roles to their respective dashboard components
  const dashboardComponents = {
    admin: AdminDashboard,
    host: HostDashboard,
    security: SecurityDashboard,
  };

  // Get the component for the given role, or null if invalid
  const DashboardComponent = dashboardComponents[role?.toLowerCase()];

  // If no valid component is found, show an error and redirect
  if (!DashboardComponent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Invalid Role: {role}
          </h2>
          <p className="text-gray-600 mb-6">
            The specified role is not recognized. Please check the URL or contact support.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // Render the appropriate dashboard component
  return (
    <div>
      <DashboardComponent />
    </div>
  );
};

export default StaffDashboard;