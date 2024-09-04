import { Link, resolvePath } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function Navbar() {
    const [genres, setGenres] = useState([]);
    const fetchGenres = async () => {
        try {
            const response = await axios.get("http://localhost:8080/genres");
            const data = response.data;
            setGenres(data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };
    
    useEffect(()=> {
        fetchGenres();
    }, [])
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
            <ul>
                {genres.map((el) => (
                <li
                    key={el.id}
                    className="list-group-item bg-dark"
                    style={{
                    borderColor: "black",
                    borderWidth: "2px",
                    marginTop: "0.5rem",
                    textAlign: "center",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2), 0 -1px 2px rgba(0, 0, 0, 0.1) inset",
                    }}
                >
                    <Link to={`/genre-${el.name}`} style={{ color: "white", textDecoration: "none" }}>
                    {el.name}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
