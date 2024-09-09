import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import axios from "axios";

function SearchBar() {
  const [input, setInput] = useState("");
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (input) {
      // Navigate to the search results page with the query in the URL
      navigate(`/search?query=${input}`);
    }
  };

  return (
    <form className="container-fluid mt-2" onSubmit={handleSearch}>
      <div
        className="input-group"
        style={{ paddingLeft: "5vw", paddingRight: "5vw" }}
      >
        <input
          type="text"
          className="form-control bg-dark-subtle"
          placeholder="Search"
          aria-label="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="input-group-text bg-body-secondary"
          id="basic-addon1"
        >
          <i className="fa fa-search" style={{ color: "black" }}></i>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
