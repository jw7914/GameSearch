import React from "react";
import { useState, useEffect, useNavigate } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Stack,
  Alert,
  Container,
  CircularProgress,
} from "@mui/material";
import { getLatestGames } from "../../../api/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLatestGames(setLoading, setGames, setError);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Stack sx={{ width: "100%" }} spacing={2}>
        <Alert variant="filled" severity="error">
          Error fetching latest games: {error}
        </Alert>
      </Stack>
    );
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 3 }}>
        Latest Games
      </Typography>
      <div
        className="slider-container"
        style={{
          overflow: "hidden",
          marginBottom: "2rem",
          padding: "2rem 3rem",
        }}
      >
        <Slider {...settings}>
          {games.map((game) => (
            <div key={game.id} className="px-4">
              <div
                className="card"
                style={{
                  transition: "transform 0.3s ease-in-out",
                  transform: "scale(1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.cursor = "pointer";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <img
                  src={game.cover}
                  alt={game.name}
                  style={{ height: "300px", width: "100%" }}
                />
                <div className="card-body">
                  <p className="card-text" style={{ textAlign: "center" }}>
                    {game.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </Box>
  );
}

export default Home;
