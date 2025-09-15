import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const userId = sessionStorage.getItem("userId"); // check if user is logged in
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;
