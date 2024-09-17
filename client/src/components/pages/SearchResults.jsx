import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";
import GameCard from "../Gamecard";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [covers, setCovers] = useState([]);
  const query = useQuery();
  const searchTerm = query.get("query");

  useEffect(() => {
    const handleSearch = async (searchTerm) => {
      try {
        setLoading(true); // Set loading state
        const response = await axios.get(
          `http://localhost:8080/games/${searchTerm}`
        );
        const data = response.data;

        // Update state with the game names and covers
        const gameNames = data.map((el) => el.name);
        const gameCovers = data.map((el) => el.cover); // Handle missing covers
        setGames(gameNames);
        setCovers(gameCovers);
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games");
        setLoading(false);
      }
    };

    if (searchTerm && searchTerm.trim()) {
      handleSearch(searchTerm); // Trigger search based on the URL query parameter
    }
  }, [searchTerm]);

  return (
    <Container sx={{ marginTop: "50px" }}>
      <h2>Search Results for: {searchTerm}</h2>

      {loading && <p>Loading games...</p>}

      {error && <p>{error}</p>}

      {!loading && games.length > 0 ? (
        <div
          className="grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)", // 4 equal columns
            gap: "1rem", // Space between grid items
            margin: "1rem",
            marginBottom: "-2rem",
          }}
        >
          {games.map((name, index) => (
            <GameCard
              elevation={25}
              key={index}
              gameName={name}
              cover={covers[index]}
            />
          ))}
        </div>
      ) : (
        !loading && <p>No results found</p>
      )}
    </Container>
  );
}

export default SearchResults;
