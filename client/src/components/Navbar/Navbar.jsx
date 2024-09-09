import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenreStack from "./GenreStack";

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
            className="collapse navbar-collapse"
            id="navbarNav"
            style={{ paddingRight: "5vw" }}
          >
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#offcanvasRight"
                  aria-controls="offcanvasRight"
                >
                  Genres
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Pricing
                </a>
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
