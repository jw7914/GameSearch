import * as React from "react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { handleGameSearch } from "../../../api/api";
import CircularProgress from "@mui/material/CircularProgress";
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
  useMediaQuery,
  useTheme,
} from "@mui/material";

// Custom hook to get query parameters (page, query, genre)
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ type }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const query = useQuery();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
          paddingTop: "2rem",
          paddingBottom: "5rem",
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            textAlign: "center",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            margin: "0 2rem",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: "2rem",
            }}
          >
            Results for: {queryTerm}
          </Typography>
          <Alert
            variant="filled"
            severity="error"
            sx={{
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        paddingTop: "2rem",
        paddingBottom: "5rem",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "16px 16px 0 0",
          padding: "2rem",
          borderBottom: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          margin: "0 2rem",
        }}
      >
        {/* Main Title and Search Term */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "700",
              color: "#1e293b",
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Search Results
          </Typography>
          <Box
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              fontWeight: "600",
              fontSize: "0.95rem",
              borderRadius: "12px",
              padding: "12px 20px",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(10px)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                borderRadius: "12px",
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 20px rgba(102, 126, 234, 0.5)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                position: "relative",
                zIndex: 1,
                fontWeight: "600",
                letterSpacing: "0.5px",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              "{queryTerm}"
            </Typography>
          </Box>
        </Box>

        {/* Results Count and Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexWrap: "wrap",
              justifyContent: { xs: "center", sm: "flex-start" },
            }}
          >
            {games.length > 0 && (
              <Box
                sx={{
                  backgroundColor: "#f1f5f9",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#1e293b",
                    fontWeight: "600",
                    fontSize: "0.875rem",
                  }}
                >
                  Showing {indexOfFirstGame + 1}-
                  {Math.min(indexOfLastGame, games.length)}
                </Typography>
              </Box>
            )}

            <Typography
              variant="body1"
              sx={{
                color: "#64748b",
                fontWeight: "500",
              }}
            >
              {games.length} total results
            </Typography>
          </Box>

          <FormControl
            sx={{
              minWidth: 140,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
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
      </Box>

      {/* Loading State */}
      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            backgroundColor: "white",
            padding: "4rem 2rem",
            borderTop: "1px solid #e2e8f0",
            margin: "0 2rem",
          }}
        >
          <CircularProgress
            size={60}
            sx={{
              color: "#3b82f6",
            }}
          />
        </Box>
      )}

      {/* Games Grid */}
      {!loading && games.length > 0 && (
        <>
          <Box
            sx={{
              backgroundColor: "white",
              padding: "2rem",
              borderTop: "1px solid #e2e8f0",
              margin: "0 2rem",
            }}
          >
            <Grid container spacing={3}>
              {currentGames.map((game, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
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
          </Box>

          {/* Pagination Section */}
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "0 0 16px 16px",
              padding: { xs: "1rem", sm: "2rem" },
              borderTop: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              margin: "0 2rem",
            }}
          >
            <Pagination
              siblingCount={isMobile ? 0 : 1}
              size={isMobile ? "medium" : "large"}
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              sx={{
                "& .MuiPaginationItem-root": {
                  borderRadius: "8px",
                  fontWeight: "500",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  minWidth: { xs: "32px", sm: "40px" },
                  height: { xs: "32px", sm: "40px" },
                  "&:hover": {
                    backgroundColor: "#f1f5f9",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#3b82f6",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#2563eb",
                    },
                  },
                },
                "& .MuiPagination-ul": {
                  flexWrap: "nowrap",
                  overflowX: { xs: "auto", sm: "visible" },
                  paddingBottom: { xs: "4px", sm: "0" },
                },
              }}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  to={`?${type}=${queryTerm}&page=${item.page}`}
                  {...item}
                />
              )}
            />

            {/* Page Jump Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight="500"
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  textAlign: { xs: "center", sm: "left" },
                }}
              >
                Jump to page:
              </Typography>
              <TextField
                label="Page number"
                variant="outlined"
                size="small"
                sx={{
                  width: { xs: "120px", sm: "160px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    paddingRight: "4px",
                  },
                  "& .MuiInputBase-input": {
                    paddingRight: "8px",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
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
                    <InputAdornment position="end" sx={{ marginLeft: "8px" }}>
                      <IconButton
                        size="small"
                        sx={{
                          color: "#3b82f6",
                          padding: "4px",
                          "&:hover": {
                            backgroundColor: "#f1f5f9",
                          },
                        }}
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
                        <KeyboardReturnIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </>
      )}

      {/* No Results */}
      {!loading && games.length === 0 && (
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: "0 0 16px 16px",
            padding: "4rem 2rem",
            textAlign: "center",
            borderTop: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            margin: "0 2rem",
          }}
        >
          <Alert
            variant="filled"
            severity="error"
            sx={{
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            No Results Found for "{queryTerm}"
          </Alert>
        </Box>
      )}

      {/* Error Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: "16px",
            padding: "1rem",
            backgroundColor: "white",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#dc2626",
            textAlign: "center",
            paddingBottom: "1rem",
          }}
        >
          Invalid Page Number
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "1rem 2rem" }}>
          <Typography variant="body1" color="text.secondary">
            Please enter a valid page number between 1 and {totalPages}.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", padding: "1rem" }}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#3b82f6",
              borderRadius: "8px",
              padding: "10px 30px",
              fontWeight: "600",
              "&:hover": {
                backgroundColor: "#2563eb",
              },
            }}
            onClick={handleCloseModal}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default SearchResults;
