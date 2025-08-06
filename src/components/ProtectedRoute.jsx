import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  // Get user data from localStorage (or from your auth context/store if you have one)
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  if (!user || !allowedRoles.includes(user.role)) {
    // Not logged in or role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
