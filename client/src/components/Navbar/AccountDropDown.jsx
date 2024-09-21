import React, { useState } from "react";

function AccountDropDown() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
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
        Account
      </a>
      <ul className="dropdown-menu" aria-labelledby="accountDropdown">
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
          <a className="dropdown-item" href="/logout">
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
}

export default AccountDropDown;
