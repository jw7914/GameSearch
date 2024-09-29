import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSearch, handleGenreSearch } from "../../../api/api"; // Ensure handleGenreSearch is imported
import MUIcard from "../MUIcard";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import "./SearchResults.css";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  // Destructure the 'type' prop
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [covers, setCovers] = useState([]);
  const query = useQuery();

  let queryTerm = "";
  if (type === "search") {
    queryTerm = query.get("query");
  } else if (type === "genre") {
    queryTerm = query.get("genre");
  }

  useEffect(() => {
    if (queryTerm && queryTerm.trim()) {
      if (type === "search") {
        handleSearch(queryTerm, setLoading, setGames, setCovers, setError);
      } else if (type === "genre") {
        handleGenreSearch(queryTerm, setLoading, setGames, setCovers, setError);
      }
    }
  }, [queryTerm, type]); // Added 'type' to dependencies

  return (
    <Container sx={{ marginTop: "2rem", marginBottom: "5rem" }}>
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "auto",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
          marginBottom: "30px",
        }}
      >
        Search Results for: {queryTerm}
      </h2>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      )}
      {error && <p>{error}</p>}

      {!loading && games.length > 0 ? (
        <div className="grid-container">
          {games.map((name, index) => (
            <MUIcard
              elevation={25}
              key={index}
              gameName={name}
              cover={covers[index]}
              cardId={index}
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
