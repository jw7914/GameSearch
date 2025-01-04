import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { firebaseapp } from "../../../firebase/firebaseConfig.jsx";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth(firebaseapp);

  useEffect(() => {
    // Check if user is authenticated
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
    return <div>Loading...</div>;
  }

  // Redirect to home if logged in
  if (isAuthenticated) {
    navigate("/"); // Redirect to home page if already logged in
    return null; // Render nothing while redirecting
  }

  // Render the protected route's children if not authenticated
  return children;
};

export default ProtectedRoute;
