import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Button,
  Collapse,
  Card,
  CardContent,
  Grid,
  Divider,
  Fade,
  Dialog,
  IconButton,
  Rating,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import CategoryIcon from "@mui/icons-material/Category";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
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
import FavoriteButton from "../GameCard/FavoriteButton";
// --- Styled Components ---

const HeroSection = styled(Box)(({ theme, bgImage }) => ({
  position: "relative",
  minHeight: "50vh",
  background: bgImage
    ? `linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%), url(${bgImage})`
    : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
  backgroundSize: "cover",
  backgroundPosition: "center top",
  display: "flex",
  alignItems: "center",
  borderRadius: "0 0 32px 32px",
  overflow: "hidden",
}));

const CoverImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxWidth: "300px",
  borderRadius: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
  transition: "transform 0.3s ease-in-out",
  border: `4px solid ${theme.palette.background.paper}`,
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  border: `1px solid ${theme.palette.divider}`,
  overflow: "visible",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: "1.5rem",
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1.5),
  color: theme.palette.text.primary,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "24px",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
  color: "white",
}));

// Modal Styles
const ImageModal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "transparent",
    boxShadow: "none",
    maxWidth: "95vw",
    maxHeight: "95vh",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.92)",
  },
}));

const ModalImage = styled("img")({
  maxWidth: "100%",
  maxHeight: "90vh",
  objectFit: "contain",
  borderRadius: "8px",
});

// Helper to determine rating color
const getRatingColor = (rating) => {
  if (!rating) return "grey";
  if (rating >= 75) return "#4caf50"; // Green
  if (rating >= 50) return "#ff9800"; // Orange
  return "#f44336"; // Red
};

function GameProfile() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const toggleStoryline = () => setIsExpanded((prev) => !prev);

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
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const backgroundImage = gameData.screenshots?.[0] || gameData.cover;
  const ratingValue = gameData.total_rating
    ? Math.round(gameData.total_rating)
    : null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
      {/* --- HERO SECTION --- */}
      <HeroSection bgImage={backgroundImage}>
        <Container
          maxWidth="lg"
          sx={{ position: "relative", zIndex: 2, py: 8 }}
        >
          <Grid container spacing={6} alignItems="center">
            {/* Left Column: Cover Image */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Fade in timeout={1000}>
                <CoverImage src={gameData.cover} alt="Game Cover" />
              </Fade>
            </Grid>

            {/* Right Column: Title & Info */}
            <Grid item xs={12} md={8}>
              <Fade in timeout={1500}>
                <Box color="white">
                  {/* Title & Favorite Button Row */}
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                    sx={{ mb: 2 }}
                  >
                    <Typography
                      variant="h2"
                      component="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: "2.5rem", md: "4rem" },
                        textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
                        lineHeight: 1.1,
                        mb: 0,
                      }}
                    >
                      {gameData.name}
                    </Typography>

                    {/* Favorite Button */}
                    <Box sx={{ mt: 1 }}>
                      <FavoriteButton
                        gameID={gameData.id}
                        gameName={gameData.name}
                        cover={gameData.cover}
                      />
                    </Box>
                  </Box>

                  {/* Quick Metadata in Hero */}
                  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    {gameData.genres?.slice(0, 3).map((genre) => (
                      <Chip
                        key={genre}
                        label={genre}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.15)",
                          color: "white",
                          backdropFilter: "blur(4px)",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ mt: -8, position: "relative", zIndex: 3 }}>
        <Grid container spacing={4}>
          {/* --- LEFT COLUMN: CONTENT --- */}
          <Grid item xs={12} md={8}>
            <Stack spacing={4}>
              {/* About Card */}
              <StyledCard>
                <CardContent sx={{ p: 4 }}>
                  <SectionTitle variant="h4">
                    <CategoryIcon color="primary" />
                    About This Game
                  </SectionTitle>

                  <Typography
                    variant="body1"
                    paragraph
                    sx={{
                      fontSize: "1.1rem",
                      lineHeight: 1.8,
                      color: "text.secondary",
                    }}
                  >
                    {gameData.summary || "No description available."}
                  </Typography>

                  {/* Storyline Toggle */}
                  {(gameData.storyline || gameData.summary) && (
                    <>
                      <Divider sx={{ my: 3, opacity: 0.5 }} />
                      <Box display="flex" justifyContent="center">
                        <StyledButton
                          onClick={toggleStoryline}
                          startIcon={
                            isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />
                          }
                        >
                          {isExpanded ? "Hide Storyline" : "Read Full Story"}
                        </StyledButton>
                      </Box>
                      <Collapse in={isExpanded} timeout={500}>
                        <Box
                          sx={{
                            mt: 3,
                            p: 3,
                            borderRadius: 2,
                            bgcolor: "action.hover",
                            borderLeft: "4px solid",
                            borderColor: "primary.main",
                          }}
                        >
                          <Typography
                            variant="body1"
                            sx={{ fontStyle: "italic", color: "text.primary" }}
                          >
                            {gameData.storyline || gameData.summary}
                          </Typography>
                        </Box>
                      </Collapse>
                    </>
                  )}
                </CardContent>
              </StyledCard>

              {/* Screenshots Card */}
              {gameData.screenshots?.length > 0 && (
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    <SectionTitle variant="h4">
                      <PhotoLibraryIcon color="primary" />
                      Visuals
                    </SectionTitle>
                    <Swiper
                      modules={[Pagination, Navigation, EffectCoverflow]}
                      effect="coverflow"
                      grabCursor
                      centeredSlides
                      slidesPerView="auto"
                      coverflowEffect={{
                        rotate: 30,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: true,
                      }}
                      pagination={{ clickable: true, dynamicBullets: true }}
                      navigation
                      style={{ padding: "10px 0 50px" }}
                    >
                      {gameData.screenshots.map((screenshot, index) => (
                        <SwiperSlide key={index} style={{ width: "300px" }}>
                          <Box
                            component="img"
                            src={screenshot}
                            onClick={() => handleImageClick(screenshot)}
                            sx={{
                              width: "100%",
                              height: "200px",
                              objectFit: "cover",
                              borderRadius: 2,
                              cursor: "pointer",
                              boxShadow: 3,
                            }}
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </CardContent>
                </StyledCard>
              )}

              {/* Video Card */}
              {gameData.videos?.length > 0 && (
                <StyledCard>
                  <CardContent sx={{ p: 4 }}>
                    <SectionTitle variant="h4">
                      <PlayArrowIcon color="primary" />
                      Trailer
                    </SectionTitle>
                    <Box
                      sx={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        borderRadius: 3,
                        overflow: "hidden",
                        bgcolor: "black",
                        boxShadow: 4,
                      }}
                    >
                      <iframe
                        width="100%"
                        height="100%"
                        src={gameData.videos[0]}
                        title="Trailer"
                        frameBorder="0"
                        allowFullScreen
                        style={{ position: "absolute", top: 0, left: 0 }}
                      />
                    </Box>
                  </CardContent>
                </StyledCard>
              )}
            </Stack>
          </Grid>

          {/* --- RIGHT COLUMN: SIDEBAR INFO --- */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <StyledCard>
                <CardContent sx={{ p: 3 }}>
                  <SectionTitle
                    variant="h5"
                    sx={{ fontSize: "1.25rem", mb: 2 }}
                  >
                    Game Details
                  </SectionTitle>

                  {/*  Rating Section */}
                  {ratingValue && (
                    <Box
                      sx={{
                        mb: 3,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h3"
                          fontWeight="800"
                          color={getRatingColor(ratingValue)}
                        >
                          {ratingValue}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Score
                        </Typography>
                      </Box>
                      <Box textAlign="right">
                        <Rating
                          value={ratingValue / 20} // Convert 100 scale to 5 stars
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                        <Typography
                          variant="caption"
                          display="block"
                          color="text.secondary"
                        >
                          Based on {gameData.rating_count || 0} ratings
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  {/*  Player Perspectives */}
                  {gameData.player_perspectives?.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <VisibilityIcon fontSize="small" /> Perspective
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {gameData.player_perspectives.map((p) => (
                          <Chip
                            key={p.id}
                            label={p.name}
                            size="small"
                            variant="outlined"
                            sx={{ borderColor: "primary.light" }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {/* Genres */}
                  {gameData.genres?.length > 0 && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <CategoryIcon fontSize="small" /> Genres
                      </Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {gameData.genres.map((genre) => (
                          <Link
                            key={genre}
                            to={`/genre?genre=${genre}`}
                            style={{ textDecoration: "none" }}
                          >
                            <Chip
                              label={genre}
                              clickable
                              color="primary"
                              variant="filled"
                              size="small"
                            />
                          </Link>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </StyledCard>
            </Stack>
          </Grid>
        </Grid>

        {/* --- MODAL --- */}
        <ImageModal
          open={modalOpen}
          onClose={handleCloseModal}
          onClick={handleCloseModal}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                top: 16,
                right: 16,
                color: "white",
                bgcolor: "rgba(0,0,0,0.6)",
              }}
            >
              <CloseIcon />
            </IconButton>
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
