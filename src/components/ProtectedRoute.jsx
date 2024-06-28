import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ element: Component }) => {
  const { isAuthenticated, loading } = useAuth();
  console.log(
    "ProtectedRoute: isAuthenticated:",
    isAuthenticated,
    "loading:",
    loading
  );

  if (loading) {
    // You can render a loading spinner or a placeholder here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
