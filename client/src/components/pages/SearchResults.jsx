import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSearch, handleGenreSearch } from "../../../api/api";
import GameCard from "../Gamecard";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import "./SearchResults.css";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        handleSearch(queryTerm, setLoading, setGames, setError);
      } else if (type === "genre") {
        handleGenreSearch(queryTerm, setLoading, setGames, setError);
      }
    }
  }, [queryTerm, type]);

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
      {error && (
        <Stack sx={{ width: "100%", marginBottom: "2rem" }} spacing={2}>
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Stack>
      )}

      {!loading && games.length > 0 ? (
        <div className="grid-container">
          {games.map((game, index) => (
            <GameCard
              key={index}
              gameName={game.name}
              cover={game.cover}
              summary={game.summary}
              releaseDate={game.release}
              rating={game.rating}
              cardId={index}
            />
          ))}
        </div>
      ) : (
        !loading &&
        !error && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="filled" severity="error">
              No Results Found
            </Alert>
          </Stack>
        )
      )}
    </Container>
  );
}

export default SearchResults;
