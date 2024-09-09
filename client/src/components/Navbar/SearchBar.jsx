import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (input) {
      navigate(`/search?query=${input}`);
    }
  };

  return (
    <form
      className="container-fluid mt-2"
      onSubmit={handleSearch}
      name="searchBar"
    >
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
