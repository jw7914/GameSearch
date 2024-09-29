import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSearch } from "../../../api/api";
import MUIcard from "../MUIcard";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";

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
    if (searchTerm && searchTerm.trim()) {
      handleSearch(searchTerm, setLoading, setGames, setCovers, setError); // Trigger search based on the URL query parameter
    }
  }, [searchTerm]);

  return (
    <Container sx={{ marginTop: "50px" }}>
      <h2
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "auto",
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        Search Results for: {searchTerm}
      </h2>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      )}
      {error && <p>{error}</p>}

      {!loading && games.length > 0 ? (
        <div
          className="grid-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "3rem",
            margin: "1rem",
            marginBottom: "-2rem",
          }}
        >
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
