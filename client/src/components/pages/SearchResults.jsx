import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleSearch, handleGenreSearch } from "../../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import GamesCard from "../GamesCard";
import Pagination from "@mui/material/Pagination";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 16;
  const query = useQuery();

  let queryTerm = "";
  if (type === "search") {
    queryTerm = query.get("query");
  } else if (type === "genre") {
    queryTerm = query.get("genre");
  }

  //Change page and scroll to top of page
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (queryTerm && queryTerm.trim()) {
      if (type === "search") {
        handleSearch(queryTerm, setLoading, setGames, setError);
        setCurrentPage(1); //Always reset page when making a new api request (number of games might differ)
      } else if (type === "genre") {
        handleGenreSearch(queryTerm, setLoading, setGames, setError);
        setCurrentPage(1);
      }
    }
  }, [queryTerm, type]);

  // Calculate the total number of pages (always round up to show all games)
  const totalPages = Math.ceil(games.length / gamesPerPage);

  // Get the games for the current page
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  return (
    <Container
      sx={{ marginTop: "2rem", marginBottom: "5rem" }}
      alignItems="center"
    >
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

      {!loading && (
        <>
          {games.length > 0 ? (
            <>
              <div className="container">
                <div className="row">
                  {currentGames.map((game, index) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5"
                      key={game.id}
                    >
                      <GamesCard
                        gameName={game.name}
                        cover={game.cover}
                        summary={game.summary}
                        releaseDate={game.release}
                        rating={game.rating}
                        cardId={index}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Box display="flex" justifyContent="center" my={4}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  siblingCount={0}
                  defaultPage={1}
                  size="large"
                />
              </Box>
            </>
          ) : (
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert variant="filled" severity="error">
                No Results Found
              </Alert>
            </Stack>
          )}
        </>
      )}
    </Container>
  );
}

export default SearchResults;
