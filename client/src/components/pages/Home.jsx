import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getLatestGames, getPopularGames } from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const [games, setGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularError, setPopularError] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, dots: false },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getLatestGames(setLoading, setGames, setError);
      } catch (err) {
        setError(err.message || "Failed to fetch latest games.");
        setLoading(false);
      }
      try {
        await getPopularGames(setLoading, setPopularGames, setPopularError);
      } catch (err) {
        setPopularError(err.message || "Failed to fetch popular games.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Popular Games Section */}
      <h4 className="text-center my-3">Popular Games</h4>
      {error ? (
        <div className="alert alert-danger" role="alert">
          Error fetching latest games: {error}
        </div>
      ) : (
        <div
          id="gameCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            {games.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#gameCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : undefined}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {popularGames.map((game, index) => (
              <div
                key={game.id}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <div className="card text-center border-0">
                  <div className="position-relative overflow-hidden rounded mb-3">
                    <img
                      src={
                        game.artworks && game.artworks.length
                          ? game.artworks[0]
                          : game.cover
                      }
                      alt={game.name}
                      className="w-100"
                      style={{
                        height: "90vh",
                        maxHeight: "1080px",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      onClick={() => navigate(`/gameprofile/${game.id}`)}
                    />
                    <div className="position-absolute bottom-0 w-100 bg-dark bg-opacity-80 text-white text-center py-2">
                      <p className="mb-3 fw-bold" style={{ fontSize: "25px" }}>
                        {game.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bootstrap Navigation Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#gameCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#gameCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      )}

      {/* Latest Games Section */}
      <h4 className="text-center my-3">Latest Games</h4>
      {popularError ? (
        <div className="alert alert-danger" role="alert">
          Error fetching popular games: {popularError}
        </div>
      ) : (
        <Box
          className="slider-container"
          sx={{ overflow: "hidden", mb: 4, px: { xs: 2, md: 4 }, py: 2 }}
        >
          <Slider ref={sliderRef} {...sliderSettings}>
            {games.map((game) => (
              <Box key={game.id} sx={{ px: 2, py: 2 }}>
                <Box
                  className="card"
                  sx={{
                    transition: "transform 0.3s ease-in-out",
                    transform: "scale(1)",
                    "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
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
                    onClick={() => navigate(`/gameprofile/${game.id}`)}
                  >
                    {game.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </div>
  );
}

export default Home;
