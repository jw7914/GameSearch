import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGenres } from "../../../api/api";

const StyledGenreItem = styled(Paper)(({ theme }) => ({
  backgroundColor: "#2C3E50",
  background: "linear-gradient(135deg, #2C3E50 0%, #34495E 100%)",
  padding: theme.spacing(1.8, 2.5),
  textAlign: "center",
  color: "#FFFFFF",
  borderRadius: "12px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
    transition: "left 0.5s",
  },
  "&:hover": {
    backgroundColor: "#3498DB",
    background: "linear-gradient(135deg, #3498DB 0%, #2980B9 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(52, 152, 219, 0.3)",
    "&::before": {
      left: "100%",
    },
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

function GenreStack() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres(setLoading, setGenres, setError);
  }, []);

  return (
    <Box sx={{ width: "100%", padding: "8px" }}>
      {/* Loading Spinner */}
      {loading && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          my={4}
        >
          <CircularProgress
            sx={{
              color: "#3498DB",
              mb: 2,
            }}
          />
          <Box
            sx={{
              color: "#BDC3C7",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            Loading genres...
          </Box>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <Paper
            elevation={3}
            sx={{
              padding: 2,
              backgroundColor: "#E74C3C",
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid #C0392B",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <span>⚠️</span>
              {error}
            </Box>
          </Paper>
        </Box>
      )}

      {/* Genre Count */}
      {!loading && !error && genres.length > 0 && (
        <Box
          sx={{
            textAlign: "center",
            mb: 2,
            color: "#BDC3C7",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {genres.length} genres available
        </Box>
      )}

      <Stack spacing={1.5}>
        {genres.map((el, index) => (
          <Box
            key={el.id}
            data-bs-dismiss="offcanvas"
            sx={{
              animation: `slideIn 0.4s ease-out ${index * 0.05}s both`,
              "@keyframes slideIn": {
                "0%": {
                  opacity: 0,
                  transform: "translateX(-20px)",
                },
                "100%": {
                  opacity: 1,
                  transform: "translateX(0)",
                },
              },
            }}
          >
            <Link
              to={`/genre?genre=${encodeURIComponent(el.name)}&page=1`}
              style={{ textDecoration: "none" }}
              aria-label={`View games in ${el.name} genre`}
            >
              <StyledGenreItem elevation={2}>
                <Box
                  sx={{
                    fontSize: "16px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {el.name}
                </Box>
              </StyledGenreItem>
            </Link>
          </Box>
        ))}
      </Stack>

      {/* Empty State */}
      {!loading && !error && genres.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 4,
            color: "#7F8C8D",
          }}
        >
          <Box sx={{ fontSize: "48px", mb: 2 }}>🎮</Box>
          <Box sx={{ fontSize: "16px", fontWeight: 500 }}>No genres found</Box>
          <Box sx={{ fontSize: "14px", mt: 1 }}>Please try again later</Box>
        </Box>
      )}
    </Box>
  );
}

export default GenreStack;
