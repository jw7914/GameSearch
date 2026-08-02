import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Card,
  CardMedia,
  CardContent,
  Fade,
  Chip,
  Button,
  Paper,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getLatestGames, getPopularGames, getTopRatedGames, getUpcomingGames } from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import StarIcon from "@mui/icons-material/Star";
import EventIcon from "@mui/icons-material/Event";
import GameCarousel from "../GameCarousel";
import GameGrid from "../GameGrid";

function Home() {
  const [games, setGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [topRatedGames, setTopRatedGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularError, setPopularError] = useState(null);
  const [topRatedError, setTopRatedError] = useState(null);
  const [upcomingError, setUpcomingError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Refs
  const popularSliderRef = useRef(null);

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const popularSliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    fade: true,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    pauseOnHover: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
  };

  // Get number of cards to show per slide based on screen size
  const getCardsPerView = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 4;
  };

  const cardsPerView = getCardsPerView();

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
      try {
        await getTopRatedGames(setLoading, setTopRatedGames, setTopRatedError);
      } catch (err) {
        setTopRatedError(err.message || "Failed to fetch top rated games.");
        setLoading(false);
      }
      try {
        await getUpcomingGames(setLoading, setUpcomingGames, setUpcomingError);
      } catch (err) {
        setUpcomingError(err.message || "Failed to fetch upcoming games.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading ...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Hero Section - Featured/Popular Games */}
      <Box sx={{ position: "relative", mb: 6 }}>
        {popularError ? (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              Error fetching popular games: {popularError}
            </Alert>
          </Container>
        ) : (
          <Box
            sx={{ height: { xs: "60vh", md: "80vh" }, position: "relative" }}
          >
            <Slider ref={popularSliderRef} {...popularSliderSettings}>
              {popularGames.map((game, index) => (
                <Box
                  key={game.id}
                  sx={{
                    height: { xs: "60vh", md: "80vh" },
                    position: "relative",
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      height: "100%",
                      position: "relative",
                      overflow: "hidden",
                      "&:hover .game-overlay": {
                        bgcolor: "rgba(0,0,0,0.3)",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={
                        game.artworks && game.artworks.length
                          ? game.artworks[0]
                          : game.cover
                      }
                      alt={game.name}
                      sx={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                    <Box
                      className="game-overlay"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background:
                          "linear-gradient(transparent, rgba(0,0,0,0.8))",
                        color: "white",
                        p: { xs: 2, md: 4 },
                        pb: { xs: 6, md: 8 },
                        transition: "all 0.3s ease-in-out",
                      }}
                    >
                      <Container maxWidth="lg">
                        <Fade in={currentSlide === index} timeout={800}>
                          <Box>
                            <Typography
                              variant={isMobile ? "h4" : "h2"}
                              component="h1"
                              sx={{
                                fontWeight: "bold",
                                mb: 2,
                                textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                              }}
                            >
                              {game.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                mb: 2,
                                flexWrap: "wrap",
                              }}
                            >
                              <Chip
                                icon={<TrendingUpIcon />}
                                label="Popular"
                                color="primary"
                                size="small"
                                sx={{ bgcolor: "primary.main", color: "white" }}
                              />
                            </Box>
                            <Button
                              variant="contained"
                              size="large"
                              startIcon={<PlayArrowIcon />}
                              onClick={() =>
                                navigate(`/gameprofile/${game.id}`)
                              }
                              sx={{
                                bgcolor: "primary.main",
                                "&:hover": { bgcolor: "primary.dark" },
                                borderRadius: 2,
                                px: 3,
                              }}
                            >
                              View Details
                            </Button>
                          </Box>
                        </Fade>
                      </Container>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Slider>

            {/* Custom indicators for Hero */}
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
                zIndex: 10,
              }}
            >
              {popularGames.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    popularSliderRef.current?.slickGoTo(index);
                  }}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor:
                      currentSlide === index
                        ? "white"
                        : "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor:
                        currentSlide === index
                          ? "white"
                          : "rgba(255,255,255,0.7)",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Latest Games Section */}
      <Box sx={{ bgcolor: "background.default" }}>
        <GameCarousel
          title="Latest Releases"
          subtitle="Discover the newest games"
          icon={NewReleasesIcon}
          games={games}
          error={error}
          cardsPerView={cardsPerView}
        />
      </Box>

      {/* Top Rated Games Section (Using Grid) */}
      <GameGrid
        title="Top Rated"
        subtitle="Highest rated games of all time"
        icon={StarIcon}
        games={topRatedGames}
        error={topRatedError}
      />

      {/* Upcoming Games Section */}
      <Box sx={{ bgcolor: "background.default" }}>
        <GameCarousel
          title="Upcoming Games"
          subtitle="Games you don't want to miss"
          icon={EventIcon}
          games={upcomingGames}
          error={upcomingError}
          cardsPerView={cardsPerView}
        />
      </Box>
    </Box>
  );
}

export default Home;
