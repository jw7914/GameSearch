import { Link, resolvePath } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: 'grey',
  ...theme.typography.body2,
  padding: theme.spacing(1.05),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

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
          <form className="container-fluid mt-2" action="http://localhost:8080/test" method="GET">
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
       <div className="offcanvas-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h3 className="offcanvas-title" id="offcanvasExampleLabel">
          Genres
        </h3>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          style={{ position: 'absolute', right: '1.1rem', filter: 'invert(100%)', fontSize:"20px" }}
        ></button>
      </div>
        <div className="offcanvas-body" style={{ overflowY: 'scroll', height: '200px', scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          <Box sx={{ width: '100%' }}>
            <Stack spacing={2}>
              {genres.map((el) => (
                <Link to={`/genre-${el.name}`} style={{ textDecoration: "none" }}>
                  <Item key={el.id} style={{ color: "#E8E8E8", fontSize: "20px" }}>      
                    <b>{el.name}</b>
                  </Item>
                </Link>
              ))}
            </Stack>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Navbar;
