import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const query = useQuery();
  const searchTerm = query.get("query");

  useEffect(() => {
    const handleSearch = async (searchTerm) => {
      try {
        setLoading(true); // Set loading state
        const response = await axios.get(
          `http://localhost:8080/games?search_term=${searchTerm}`
        );
        const data = response.data;

        // Update state with the game names
        const gameNames = data.map((el) => el.name);
        setGames(gameNames);
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games");
        setLoading(false);
      }
    };

    if (searchTerm) {
      handleSearch(searchTerm); // Trigger search based on the URL query parameter
    }
  }, [searchTerm]); // Run when searchTerm changes

  return (
    <Container sx={{ marginTop: "50px" }}>
      <h2>Search Results for: {searchTerm}</h2>

      {loading && <p>Loading games...</p>}

      {error && <p>{error}</p>}

      {!loading && games.length > 0
        ? games.map((name, index) => <p key={index}>{name}</p>)
        : !loading && <p>No results found</p>}
    </Container>
  );
}

export default SearchResults;
