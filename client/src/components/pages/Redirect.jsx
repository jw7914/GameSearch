import React from "react";
import { useLocation, Navigate } from "react-router-dom";

const Redirect = ({ element }) => {
  const location = useLocation();
  // Check if the path is "/search" and there are no query parameters
  if (location.pathname === "/search" && !location.search) {
    return <Navigate to="/" replace />;
  }
  return element;
};

export default Redirect;
