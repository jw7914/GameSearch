import React, { useState, useRef, useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { getUserProfile } from "../../../api/api";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

function AccountDropDown() {
  const [open, setOpen] = useState(false);
  const { user, isLoggedIn } = getFirebaseUser();
  const navigate = useNavigate();
  const auth = getAuth();
  const [dbDisplayName, setDbDisplayName] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = () => {
      if (isLoggedIn && user) {
        getUserProfile({
          user,
          setBio: () => {},
          setGenres: () => {},
          setDisplayName: setDbDisplayName,
          setAvatar: () => {}
        });
      }
    };

    fetchProfile();

    window.addEventListener("profileUpdated", fetchProfile);
    return () => window.removeEventListener("profileUpdated", fetchProfile);
  }, [isLoggedIn, user]);

  const displayNameToUse = dbDisplayName || user?.displayName || user?.email;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      setLogoutMessage("Logged out successfully!");
      setIsLogoutModalOpen(true);
    } catch (error) {
      console.error("Error logging out: ", error);
      setLogoutMessage("An error occurred while logging out. Please try again.");
      setIsLogoutModalOpen(true);
    }
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
    if (logoutMessage === "Logged out successfully!") {
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        className="btn nav-link dropdown-toggle"
        id="accountDropdown"
        role="button"
        aria-expanded={open}
        onClick={handleToggle}
      >
        {isLoggedIn ? `Hello, ${displayNameToUse}` : "Account"}
      </button>
      <ul
        className={`dropdown-menu dropdown-menu-dark${open ? " show" : ""}`}
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

      {/* Logout Modal */}
      <Dialog
        open={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: "background.paper", minWidth: 300 }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {logoutMessage === "Logged out successfully!" ? "Goodbye!" : "Error"}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary">
            {logoutMessage}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleCloseLogoutModal} 
            variant="contained" 
            color="primary" 
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AccountDropDown;
