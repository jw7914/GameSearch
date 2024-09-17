import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Container } from "@mui/material";
import GameCard from "../Gamecard";

// Function to extract query parameters from URL
function useQuery() {
  return new URLSearchParams(useLocation().search); // Fix: useLocation().search for query string
}

function GenreResults() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [covers, setCovers] = useState([]);
  const query = useQuery();
  const genre = query.get("genre"); // Fix: Correct query parameter name 'genre'

  useEffect(() => {
    const handleSearch = async (genre) => {
      console.log(genre);
      try {
        setLoading(true); // Set loading state
        const response = await axios.get(
          `http://localhost:8080/genres/${genre}`
        );
        const data = response.data;

        // Update state with the game names and covers
        const gameNames = data.map((el) => el.name);
        const gameCovers = data.map((el) => el.cover || "defaultCover.jpg"); // Handle missing covers
        setGames(gameNames);
        setCovers(gameCovers);
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games");
        setLoading(false);
      }
    };

    if (genre && genre.trim()) {
      handleSearch(genre); // Trigger search based on the URL query parameter
    }
  }, [genre]);

  return (
    <Container sx={{ marginTop: "50px" }}>
      <h2>Search Results for: {genre}</h2>

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
              cover={covers[index] || "fallbackCover.jpg"}
              style={{
                height: "300px", // Set a fixed height for the cards
                width: "100%", // Make sure it takes up the full width of the grid cell
              }}
            />
          ))}
        </div>
      ) : (
        !loading && <p>No results found</p>
      )}
    </Container>
  );
}

export default GenreResults;
