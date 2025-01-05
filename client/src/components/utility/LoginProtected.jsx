// Paths that shouldn't be able to be accessed when logged in

import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { firebaseapp } from "../../../firebase/firebaseConfig.jsx";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(firebaseapp);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  // Redirect to home if logged in
  if (!isAuthenticated) {
    navigate("/login"); // Redirect to login page if not authenticated
    return null;
  }

  // Render the protected route's children if authenticated
  return children;
};

export default ProtectedRoute;
