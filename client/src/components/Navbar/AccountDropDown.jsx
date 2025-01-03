import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../../firebase/firebaseConfig.jsx";
import { useNavigate } from "react-router-dom";

function AccountDropDown() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Track the user's auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null);
      alert("Logged out successfully!");
      window.location.reload();
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div className="dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        id="accountDropdown"
        role="button"
        aria-expanded={open ? "true" : "false"}
        onClick={handleClick}
        data-bs-toggle="dropdown"
      >
        {isLoggedIn ? `Hello, ${user.displayName || user.email}` : "Account"}
      </a>
      <ul className="dropdown-menu" aria-labelledby="accountDropdown">
        {isLoggedIn ? (
          <>
            <li>
              <a className="dropdown-item" href="/profile">
                Profile
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/settings">
                Settings
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a className="dropdown-item" href="#" onClick={handleLogout}>
                Logout
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a className="dropdown-item" href="/login">
                Login
              </a>
            </li>
            <hr className="dropdown-divider" />
            <li>
              <a className="dropdown-item" href="/register">
                Register
              </a>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default AccountDropDown;
