import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchBar() {
  const [input, setInput] = useState("");
  const [prevInput, setPrevInput] = useState(""); // State to track previous input
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setPrevInput("");
    }
  }, [location]);

  function useQuery() {
    return new URLSearchParams(location.search);
  }

  const query = useQuery();

  const handleSearch = (e) => {
    e.preventDefault();

    if (input === prevInput) {
      return;
    }

    if (input) {
      const params = new URLSearchParams();
      params.set("query", encodeURIComponent(input));
      params.set("page", "1");

      navigate(`\search?${params.toString()}`);

      // Update previous input after submission
      setPrevInput(input);
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
