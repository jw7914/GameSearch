import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  Collapse,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  Dialog,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import { getSpecificGame } from "../../../api/api";

// Hero Section with Background
const HeroSection = styled(Box)(({ theme, bgImage }) => ({
  position: "relative",
  minHeight: "50vh",
  background: bgImage
    ? `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${bgImage})`
    : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  borderRadius: "0 0 24px 24px",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(2px)",
  },
}));

const CoverImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxWidth: "320px",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  transition: "transform 0.3s ease-in-out",
  border: `4px solid ${theme.palette.background.paper}`,
  "&:hover": {
    transform: "scale(1.05)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.5rem",
  marginBottom: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
  "&::after": {
    content: '""',
    flex: 1,
    height: "2px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, transparent 100%)`,
    marginLeft: theme.spacing(2),
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "24px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1rem",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease-in-out",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
  },
}));

const ImageModal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "transparent",
    boxShadow: "none",
    maxWidth: "90vw",
    maxHeight: "90vh",
    overflow: "hidden",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
}));

const ModalImage = styled("img")(({ theme }) => ({
  maxWidth: "100%",
  maxHeight: "90vh",
  objectFit: "contain",
  borderRadius: "8px",
  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 16,
  right: 16,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "white",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  zIndex: 1,
}));

function GameProfile() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleStoryline = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchGameData = async () => {
      if (id) {
        try {
          await getSpecificGame(id, setLoading, setError, setGameData);
        } catch {
          setError("Failed to fetch game data.");
        }
      }
    };
    fetchGameData();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading game details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box mt={8}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  const backgroundImage = gameData.screenshots?.[0] || gameData.cover;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <HeroSection bgImage={backgroundImage}>
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2, py: 8 }}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            sx={{ minHeight: "50vh" }}
          >
            <Grid item xs={12} md={4}>
              <Fade in timeout={1000}>
                <Box
                  display="flex"
                  justifyContent="center"
                  sx={{ mt: { xs: 4, md: 0 } }}
                >
                  <CoverImage src={gameData.cover} alt="Game Cover" />
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={8}>
              <Fade in timeout={1500}>
                <Box>
                  <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "2.5rem", md: "3.5rem" },
                      color: "white",
                      textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
                      mb: 3,
                    }}
                  >
                    {gameData.name}
                  </Typography>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 3 }}>
        <Grid container spacing={4}>
          {/* Main Info Card */}
          <Grid item xs={12} md={8}>
            <StyledCard>
              <CardContent sx={{ p: 4 }}>
                <SectionTitle variant="h4">
                  <CategoryIcon />
                  About This Game
                </SectionTitle>

                <Typography
                  variant="body1"
                  paragraph
                  sx={{
                    fontSize: "1.1rem",
                    lineHeight: 1.8,
                    color: "text.primary",
                    textAlign: "justify",
                  }}
                >
                  {gameData.summary || "No description available."}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="center" mb={3}>
                  <StyledButton
                    onClick={toggleStoryline}
                    startIcon={
                      isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                    }
                    variant="contained"
                    size="large"
                  >
                    {isExpanded ? "Hide Storyline" : "Discover Storyline"}
                  </StyledButton>
                </Box>

                <Collapse in={isExpanded} timeout={800}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="h6" gutterBottom color="primary">
                      📖 Storyline
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "1.05rem",
                        lineHeight: 1.7,
                        fontStyle: "italic",
                      }}
                    >
                      {gameData.storyline || "No storyline available."}
                    </Typography>
                  </Box>
                </Collapse>
              </CardContent>
            </StyledCard>
          </Grid>

          {/* Side Info Card */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle variant="h5" sx={{ fontSize: "1.25rem" }}>
                    🎮 Game Info
                  </SectionTitle>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Genres
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {gameData.genres?.map((genre) => (
                        <Link
                          key={genre}
                          to={`/genre?genre=${genre}`}
                          style={{ textDecoration: "none" }} // Removes the blue underline from Link
                        >
                          <Chip
                            label={genre}
                            clickable // Makes the Chip show a pointer cursor and hover effect
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: 2,
                              fontWeight: 500,
                              margin: "2px",
                              // Optional: Custom hover styles if default isn't enough
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.1)",
                                borderColor: "primary.main",
                              },
                            }}
                          />
                        </Link>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </StyledCard>
            </Stack>
          </Grid>
        </Grid>

        {/* Screenshots Section */}
        {gameData.screenshots?.length > 0 && (
          <StyledCard sx={{ mt: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle variant="h4">
                <PhotoLibraryIcon />
                Screenshots
              </SectionTitle>

              <Swiper
                modules={[Pagination, Navigation, EffectCoverflow]}
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                slidesPerView="auto"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                navigation
                spaceBetween={30}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                style={{ padding: "20px 0 60px" }}
              >
                {gameData.screenshots.map((screenshot, index) => (
                  <SwiperSlide key={index} style={{ width: "auto" }}>
                    <Box
                      component="img"
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      onClick={() => handleImageClick(screenshot)}
                      sx={{
                        width: "100%",
                        height: "300px",
                        objectFit: "cover",
                        borderRadius: 3,
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        transition: "transform 0.3s ease-in-out, cursor 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
                        },
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </CardContent>
          </StyledCard>
        )}

        {/* Video Section */}
        {gameData.videos?.length > 0 && gameData.videos[0] && (
          <StyledCard sx={{ mt: 4, mb: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <SectionTitle variant="h4">
                <PlayArrowIcon />
                Game Trailer
              </SectionTitle>

              <Box
                sx={{
                  position: "relative",
                  paddingBottom: "56.25%",
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 3,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                  bgcolor: "black",
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src={gameData.videos[0]}
                  title="Game Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    borderRadius: "12px",
                  }}
                />
              </Box>
            </CardContent>
          </StyledCard>
        )}

        {/* Image Modal */}
        <ImageModal
          open={modalOpen}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
          aria-labelledby="image-modal-title"
          aria-describedby="image-modal-description"
        >
          <Box
            sx={{
              position: "relative",
              outline: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CloseButton
              onClick={handleCloseModal}
              aria-label="close"
              size="large"
            >
              <CloseIcon />
            </CloseButton>
            {selectedImage && (
              <ModalImage
                src={selectedImage}
                alt="Enlarged screenshot"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </Box>
        </ImageModal>
      </Container>
    </Box>
  );
}

export default GameProfile;
