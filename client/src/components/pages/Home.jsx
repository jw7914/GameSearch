import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Stack, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getLatestGames } from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Fetch latest games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        await getLatestGames(setLoading, setGames, setError);
      } catch (err) {
        setError(err.message || "Failed to fetch games.");
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
        },
      },
    ],
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Stack sx={{ width: "100%" }} spacing={2} my={4}>
        <Alert variant="filled" severity="error">
          Error fetching latest games: {error}
        </Alert>
      </Stack>
    );
  }

  // Render the slider
  return (
    <Box sx={{ marginY: "2rem" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 3 }}>
        Latest Games
      </Typography>
      <Box
        className="slider-container"
        sx={{
          overflow: "hidden",
          mb: 4,
          px: { xs: 2, md: 4 },
          py: 2,
        }}
      >
        <Slider ref={sliderRef} {...sliderSettings}>
          {games.map((game) => (
            <Box
              key={game.id}
              sx={{ px: 2, py: 2 }}
              onClick={() => navigate(`/gameprofile/${game.id}`)}
            >
              <Box
                className="card"
                sx={{
                  transition: "transform 0.3s ease-in-out",
                  transform: "scale(1)",
                  "&:hover": {
                    transform: "scale(1.05)",
                    cursor: "pointer",
                  },
                }}
              >
                <img
                  src={game.cover}
                  alt={game.name}
                  style={{ height: "300px", width: "100%" }}
                />
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ py: 2, fontWeight: "bold", fontSize: "1rem" }}
                >
                  {game.name}
                </Typography>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

export default Home;
