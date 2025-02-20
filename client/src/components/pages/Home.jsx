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

const carouselImgWrapper = {
  position: "relative",
  overflow: "hidden",
  borderRadius: "10px",
  marginBottom: "1rem",
};

const carouselImg = {
  width: "100%",
  height: "320px",
  objectFit: "cover",
  objectPosition: "center",
  transition: "transform 0.4s ease-in-out",
};

const carouselOverlay = {
  position: "absolute",
  bottom: 0,
  width: "100%",
  background: "rgba(0, 0, 0, 0.6)",
  padding: "15px",
  color: "white",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "1.2rem",
  borderBottomLeftRadius: "10px",
  borderBottomRightRadius: "10px",
};

function Home() {
  const [games, setGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularError, setPopularError] = useState(null);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 3 }}>
        Popular Games
      </Typography>
      {error ? (
        <Stack sx={{ width: "100%" }} spacing={2} my={4}>
          <Alert variant="filled" severity="error">
            Error fetching latest games: {error}
          </Alert>
        </Stack>
      ) : (
        <Box className="container overflow-hidden mb-4 px-1 py-2">
          <div
            id="gameCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            {/* Slide Indicators */}
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
                  <Box className="card text-center border-0">
                    <Box sx={carouselImgWrapper}>
                      <img
                        src={
                          game.artworks && game.artworks.length
                            ? game.artworks[0]
                            : game.cover
                        }
                        alt={game.name}
                        style={carouselImg}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.07)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                        onClick={() => navigate(`/gameprofile/${game.id}`)}
                      />
                      <Box sx={carouselOverlay}>
                        <Typography variant="body1" component="p">
                          {game.name}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </div>
              ))}
            </div>

            {/* Bootstrap Default Navigation Controls */}
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
        </Box>
      )}

      <Typography variant="h4" align="center" gutterBottom sx={{ mt: 3 }}>
        Latest Games
      </Typography>
      {popularError ? (
        <Stack sx={{ width: "100%" }} spacing={2} my={4}>
          <Alert variant="filled" severity="error">
            Error fetching popular games: {popularError}
          </Alert>
        </Stack>
      ) : (
        <Box
          className="slider-container"
          sx={{ overflow: "hidden", mb: 4, px: { xs: 2, md: 4 }, py: 2 }}
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
                    "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
                  }}
                >
                  <img
                    src={game.cover}
                    alt={game.name}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
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
      )}
    </Container>
  );
}

export default Home;
