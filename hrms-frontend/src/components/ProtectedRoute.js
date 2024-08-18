import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("access") !== null;
  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
