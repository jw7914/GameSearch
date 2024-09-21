import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenreStack from "./GenreStack";
import AccountDropDown from "./AccountDropDown";

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to={"/"} className="navbar-brand">
            <i className="fa-duotone fa-solid fa-gamepad"></i> Search
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <SearchBar />
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
            style={{ paddingRight: "5vw" }}
          >
            <ul className="navbar-nav">
              <li className="nav-item mx-1">
                <a
                  className="nav-link d-flex align-items-center"
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  <i className="fa fa-arrow-left me-2" aria-hidden="true"></i>
                  <span>Genres</span>
                </a>
              </li>
              <li className="nav-item mx-1">
                {" "}
                {/* Increased margin */}
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item mx-1">
                {" "}
                {/* Increased margin */}
                <AccountDropDown />
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div
        className="offcanvas offcanvas-end bg-dark text-white"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div
          className="offcanvas-header"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3 className="offcanvas-title" id="offcanvasExampleLabel">
            Genres
          </h3>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            style={{
              position: "absolute",
              right: "1.1rem",
              filter: "invert(100%)",
              fontSize: "20px",
            }}
          ></button>
        </div>
        <div
          className="offcanvas-body"
          style={{
            overflowY: "scroll",
            height: "200px",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <GenreStack />
        </div>
      </div>
    </>
  );
}

export default Navbar;
