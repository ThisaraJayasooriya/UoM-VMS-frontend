import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You do not have permission to view this page.</p>
        <Link to="/" className="text-blue-600 underline">Go back to Home</Link>
      </div>
    </div>
  );
};

export default Unauthorized;
