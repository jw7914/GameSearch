import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleGameSearch } from "../../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
import { Container, Chip } from "@mui/material";
import Alert from "@mui/material/Alert";
import GamesCard from "../GameCard/GamesCard";
import PaginationItem from "@mui/material/PaginationItem";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import {
  TextField,
  Box,
  Button,
  InputAdornment,
  IconButton,
  Pagination,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

// Custom hook to get query parameters (page, query, genre)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = useQuery();
  const navigate = useNavigate();
  const currentPage = parseInt(query.get("page") || "1");
  const [page, setPage] = useState(currentPage);
  const [gamesPerPage, setGamesPerPage] = useState(24); // Added state for games per page
  const totalPages = Math.ceil(games.length / gamesPerPage);
  const indexOfLastGame = page * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);
  const [inputPage, setInputPage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const typeMap = {
    query: query.get("query"),
    genre: query.get("genre"),
  };
  const queryTerm = typeMap[type]
    ? decodeURIComponent(typeMap[type]).trim()
    : "";

  // Fetch games based on query term
  useEffect(() => {
    if (queryTerm && queryTerm.trim()) {
      handleGameSearch(queryTerm, type, setLoading, setGames, setError);
    }
  }, [queryTerm, type]);

  // Handle page change from pagination
  const handlePageChange = (event, newPage) => {
    const params = new URLSearchParams(query);
    params.set("page", newPage);
    setPage(newPage);
    setInputPage("");
    window.scrollTo(0, 0);
  };

  // Handle page input from text field
  const handlePageInput = () => {
    const pageNumber = parseInt(inputPage, 10);
    const params = new URLSearchParams(query);
    params.set("page", pageNumber);
    navigate(`?${params.toString()}`);
    setPage(pageNumber);
    setInputPage("");
    window.scrollTo(0, 0);
  };

  const handlePageInputError = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Check if page is out of bounds
  useEffect(() => {
    if (
      (currentPage > totalPages || currentPage < 0) &&
      !loading &&
      totalPages !== 0
    ) {
      const params = new URLSearchParams(query);
      params.set("page", 1); // Set the page to 1
      navigate(`?${params.toString()}`);
    }
  }, [currentPage, totalPages, loading, query, navigate]);

  // Update page state when query changes
  useEffect(() => {
    setPage(currentPage);
    setInputPage("");
  }, [currentPage, location.search]);

  // Handle changes in the number of games per page
  const handleGamesPerPageChange = (event) => {
    const newGamesPerPage = event.target.value;
    setGamesPerPage(newGamesPerPage);
    setPage(1); // Reset to the first page
  };

  if (error) {
    return (
      <Container sx={{ marginTop: "2rem", marginBottom: "5rem" }}>
        <h2
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          Results for: {queryTerm}
        </h2>
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
    <Container sx={{ marginTop: "2rem", marginBottom: "5rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          width: "100%",
          flexDirection: { xs: "column", sm: "row" }, // Change layout on smaller screens
        }}
      >
        <Chip
          label={
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "white",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Results for: {queryTerm}
            </Typography>
          }
          sx={{
            bgcolor: "black",
            color: "white",
            borderRadius: "30px",
            px: 4,
            py: 2,
            height: "auto",
            width: "fit-content",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
            maxWidth: "75%",
          }}
        />

        <FormControl
          sx={{
            minWidth: 120,
            marginTop: { xs: "1rem", sm: 0 },
            maxWidth: "25%",
          }}
        >
          <InputLabel id="games-per-page-label">Cards per Page</InputLabel>
          <Select
            labelId="games-per-page-label"
            value={gamesPerPage}
            label="Cards per Page"
            onChange={handleGamesPerPageChange}
          >
            <MenuItem value={12}>12</MenuItem>
            <MenuItem value={24}>24</MenuItem>
            <MenuItem value={36}>36</MenuItem>
            <MenuItem value={48}>48</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      )}

      {!loading && games.length > 0 && (
        <>
          <Grid container spacing={3}>
            {currentGames.map((game, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={index}
                sx={{
                  paddingLeft: 1,
                  paddingRight: 1,
                  left: { xs: "5rem", sm: "0" },
                }}
              >
                <GamesCard
                  gameName={game.name}
                  cover={game.cover}
                  summary={game.summary}
                  releaseDate={game.release}
                  rating={game.rating}
                  cardID={game.id}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
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

          {/* Page input field */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
          >
            <TextField
              label="Go to page"
              variant="outlined"
              size="small"
              sx={{ width: "250px" }}
              value={inputPage}
              onChange={(event) => {
                const value = event.target.value;
                if (/^\d*$/.test(value)) {
                  setInputPage(value);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (
                    inputPage.trim() === "" ||
                    isNaN(inputPage) ||
                    parseInt(inputPage, 10) <= 0 ||
                    parseInt(inputPage, 10) > totalPages
                  ) {
                    handlePageInputError();
                    return;
                  }
                  handlePageInput();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        if (
                          inputPage.trim() === "" ||
                          isNaN(inputPage) ||
                          parseInt(inputPage, 10) <= 0 ||
                          parseInt(inputPage, 10) > totalPages
                        ) {
                          handlePageInputError();
                          return;
                        }
                        handlePageInput();
                      }}
                    >
                      <KeyboardReturnIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      )}
      {!loading && games.length === 0 && (
        <Stack sx={{ width: "100%" }} spacing={2}>
          <Alert variant="filled" severity="error">
            No Results Found
          </Alert>
        </Stack>
      )}

      {/* Error Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "0.375rem",
            paddingY: "20px",
            backgroundColor: "#fff",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: "500",
            color: "red",
            borderBottom: "1px solid #dee2e6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Error
        </DialogTitle>
        <DialogContent sx={{ marginTop: "2rem", textAlign: "center" }}>
          Enter a valid page number.
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#3f51b5", color: "#fff" }}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SearchResults;
