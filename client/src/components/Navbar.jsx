import { Link } from "react-router-dom";

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
          <form className="container-fluid mt-2">
            <div
              className="input-group"
              style={{ paddingLeft: "5vw", paddingRight: "5vw" }}
            >
              <input
                type="text"
                className="form-control bg-dark-subtle"
                placeholder="Search"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
              <span
                className="input-group-text bg-body-secondary"
                id="basic-addon1"
              >
                <Link to={"/result"} style={{ color: "black" }}>
                  <i className="fa fa-search"></i>
                </Link>
              </span>
            </div>
          </form>
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
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasExampleLabel">
            Genres
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div>Some placeholder content for the offcanvas.</div>
          <ul className="list-unstyled">
            <li>
              <a href="#" className="text-decoration-none">
                Link 1
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Link 2
              </a>
            </li>
            <li>
              <a href="#" className="text-decoration-none">
                Link 3
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
