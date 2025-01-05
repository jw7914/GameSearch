import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";

function AccountDropDown() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = getFirebaseUser();
  const navigate = useNavigate();
  const auth = getAuth();

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
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
      <button
        className="btn nav-link dropdown-toggle"
        id="accountDropdown"
        role="button"
        aria-expanded={open}
        onClick={handleToggle}
      >
        {isLoggedIn ? `Hello, ${user?.displayName || user?.email}` : "Account"}
      </button>
      <ul
        className={`dropdown-menu${open ? " show" : ""}`}
        aria-labelledby="accountDropdown"
      >
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
              <button className="dropdown-item" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <a className="dropdown-item" href="/login">
                Login
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
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
