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
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { getLatestGames, getPopularGames } from "../../../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

function Home() {
  const [games, setGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popularError, setPopularError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [latestGamesCurrentSlide, setLatestGamesCurrentSlide] = useState(0);

  // Refs
  const sliderRef = useRef(null);
  const popularSliderRef = useRef(null);
  const latestGamesCarouselRef = useRef(null); // Added ref for reliable DOM access

  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const popularSliderSettings = {
    dots: false,
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
    };
    fetchData();
  }, []);

  // Sync Latest Games Carousel State
  useEffect(() => {
    const carouselElement = latestGamesCarouselRef.current;

    if (carouselElement) {
      const handleSlide = (event) => {
        // 'event.to' contains the index of the slide being transitioned to
        setLatestGamesCurrentSlide(event.to);
      };

      // Changed to 'slide.bs.carousel' (fires immediately) instead of 'slid.bs.carousel' (fires after animation)
      carouselElement.addEventListener("slide.bs.carousel", handleSlide);

      return () => {
        carouselElement.removeEventListener("slide.bs.carousel", handleSlide);
      };
    }
  }, [games]); // Re-run when games are loaded so the ref is valid

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
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
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
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "bold",
              mb: 1,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            <NewReleasesIcon
              sx={{ mr: 1, verticalAlign: "middle", fontSize: "inherit" }}
            />
            Latest Releases
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover the newest games
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 4 }}>
            Error fetching latest games: {error}
          </Alert>
        ) : (
          <Box
            sx={{ position: "relative", maxWidth: "90%", mx: "auto", px: 8 }}
          >
            {/* Bootstrap Carousel with REF */}
            <div
              id="latestGamesCarousel"
              ref={latestGamesCarouselRef} // Attach Ref Here
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {Array.from({
                  length: Math.ceil(games.length / cardsPerView),
                }).map((_, slideIndex) => {
                  const startIndex = slideIndex * cardsPerView;
                  const endIndex = Math.min(
                    startIndex + cardsPerView,
                    games.length
                  );
                  const slideGames = games.slice(startIndex, endIndex);

                  return (
                    <div
                      key={slideIndex}
                      className={`carousel-item ${
                        slideIndex === 0 ? "active" : ""
                      }`}
                    >
                      <Grid container spacing={2} sx={{ px: 1 }}>
                        {slideGames.map((game) => (
                          <Grid
                            item
                            xs={12}
                            md={12 / cardsPerView}
                            key={game.id}
                          >
                            <Card
                              elevation={0}
                              sx={{
                                height: 420,
                                display: "flex",
                                flexDirection: "column",
                                cursor: "pointer",
                                transition:
                                  "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                border: "2px solid",
                                borderColor: "transparent",
                                borderRadius: 4,
                                overflow: "hidden",
                                position: "relative",
                                "&:hover": {
                                  transform: "scale(1.03) translateY(-5px)",
                                  boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                                  borderColor: "primary.main",
                                  "& .game-image": {
                                    transform: "scale(1.1)",
                                  },
                                  "& .game-overlay": {
                                    opacity: 1,
                                  },
                                },
                              }}
                              onClick={() =>
                                navigate(`/gameprofile/${game.id}`)
                              }
                            >
                              <Box
                                sx={{
                                  position: "relative",
                                  overflow: "hidden",
                                }}
                              >
                                <CardMedia
                                  className="game-image"
                                  component="img"
                                  height="300"
                                  image={game.cover}
                                  alt={game.name}
                                  sx={{
                                    objectFit: "cover",
                                    transition: "transform 0.4s ease",
                                  }}
                                />
                                <Box
                                  className="game-overlay"
                                  sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background:
                                      "linear-gradient(135deg, rgba(25, 118, 210, 0.8), rgba(66, 165, 245, 0.8))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    opacity: 0,
                                    transition: "opacity 0.3s ease",
                                  }}
                                >
                                  <Button
                                    variant="contained"
                                    size="large"
                                    startIcon={<PlayArrowIcon />}
                                    sx={{
                                      bgcolor: "white",
                                      color: "primary.main",
                                      "&:hover": {
                                        bgcolor: "grey.100",
                                      },
                                    }}
                                  >
                                    View Game
                                  </Button>
                                </Box>
                              </Box>
                              <CardContent
                                sx={{
                                  flexGrow: 1,
                                  p: 3,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  textAlign: "center",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  sx={{
                                    fontWeight: 700,
                                    lineHeight: 1.3,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    color: "text.primary",
                                  }}
                                >
                                  {game.name}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  );
                })}
              </div>
              {/* Bootstrap Carousel Controls */}
              {games.length > cardsPerView && (
                <>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#latestGamesCarousel"
                    data-bs-slide="prev"
                    style={{
                      background: "rgba(25, 118, 210, 0.8)",
                      borderRadius: "50%",
                      width: "45px",
                      height: "45px",
                      left: "-60px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "2px solid #1976d2",
                      zIndex: 10,
                      transition: "all 0.3s ease",
                      outline: "none",
                      boxShadow: "none",
                      userSelect: "none",
                    }}
                    // Prevent focus on mouse down
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#1976d2";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(25, 118, 210, 0.8)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                      style={{ userSelect: "none", pointerEvents: "none" }} // Fix for inner icon
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#latestGamesCarousel"
                    data-bs-slide="next"
                    style={{
                      background: "rgba(25, 118, 210, 0.8)",
                      borderRadius: "50%",
                      width: "45px",
                      height: "45px",
                      right: "-60px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      border: "2px solid #1976d2",
                      zIndex: 10,
                      transition: "all 0.3s ease",
                      outline: "none",
                      boxShadow: "none",
                    }}
                    // Prevent focus on mouse down
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#1976d2";
                      e.target.style.transform = "translateY(-50%) scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "rgba(25, 118, 210, 0.8)";
                      e.target.style.transform = "translateY(-50%) scale(1)";
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "none")}
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                      style={{ userSelect: "none", pointerEvents: "none" }} // Fix for inner icon
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </>
              )}

              {/* Custom Carousel Indicators - Hidden on Mobile */}
              {games.length > cardsPerView && !isMobile && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    gap: 1,
                  }}
                >
                  {Array.from({
                    length: Math.ceil(games.length / cardsPerView),
                  }).map((_, index) => (
                    <Box
                      key={index}
                      component="button"
                      type="button"
                      data-bs-target="#latestGamesCarousel"
                      data-bs-slide-to={index}
                      aria-label={`Slide ${index + 1}`}
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        border: "2px solid",
                        borderColor: "primary.main",
                        bgcolor:
                          index === latestGamesCurrentSlide
                            ? "primary.main"
                            : "transparent",
                        cursor: "pointer",
                        transition: "all 0.3s ease-in-out",
                        padding: 0,
                        margin: 0,
                        outline: "none",
                        "&:focus": {
                          outline: "none",
                        },
                        "&:hover": {
                          bgcolor:
                            index === latestGamesCurrentSlide
                              ? "primary.dark"
                              : "primary.light",
                          transform: "scale(1.2)",
                          boxShadow: "0 2px 8px rgba(25, 118, 210, 0.3)",
                        },
                      }}
                    />
                  ))}
                </Box>
              )}
            </div>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Home;
