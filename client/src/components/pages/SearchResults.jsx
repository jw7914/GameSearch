import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { handleGameSearch } from "../../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import GamesCard from "../GamesCard";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageError, setPageError] = useState(false);
  const query = useQuery();
  const currentPage = parseInt(query.get("page") || "1");
  console.log(currentPage);
  const [page, setPage] = useState(currentPage);
  const gamesPerPage = 16;
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const indexOfLastGame = page * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const typeMap = {
    search: query.get("query"),
    genre: query.get("genre"),
  };
  const queryTerm = typeMap[type];

  useEffect(() => {
    if (queryTerm && queryTerm.trim()) {
      handleGameSearch(queryTerm, type, setLoading, setGames, setError);
    }
  }, [queryTerm, type]);

  const handlePageChange = (event, newPage) => {
    const params = new URLSearchParams(query);
    params.set("page", newPage);
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  // Error checking if url is used to go to an page outside of bounds
  useEffect(() => {
    if (currentPage > totalPages && !loading && totalPages !== 0) {
      setPageError(true);
    } else {
      setPageError(false);
    }
  }, [currentPage, totalPages, loading]);
  if (pageError || error) {
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

        {pageError && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert variant="filled" severity="error">
              Page not found.
            </Alert>
          </Stack>
        )}

        {error && (
          <Stack sx={{ width: "100%", marginTop: "2rem" }} spacing={2}>
            <Alert variant="filled" severity="error">
              {error}
            </Alert>
          </Stack>
        )}
      </Container>
    );
  }

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
                      key={index}
                    >
                      <GamesCard
                        gameName={game.name}
                        cover={game.cover}
                        summary={game.summary}
                        releaseDate={game.release}
                        rating={game.rating}
                        cardID={game.id}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Box display="flex" justifyContent="center" my={4}>
                <Pagination
                  siblingCount={0}
                  size="large"
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  renderItem={(item) => (
                    <PaginationItem
                      component={Link}
                      to={`?${type}=${queryTerm}&page=${item.page}`}
                      {...item}
                    />
                  )}
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
