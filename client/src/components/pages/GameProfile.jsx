import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Paper,
  Button,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getSpecificGame } from "../../../api/api";

const CoverImage = styled("img")(({ theme }) => ({
  width: "100%",
  height: "auto",
  maxWidth: "250px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const InfoPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const GameSummaryContainer = styled(Box)(({ theme }) => ({
  maxHeight: "200px", // Limit height for overflow
  overflowY: "auto", // Scroll when content exceeds height
}));

function GameProfile() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const toogleStoryline = () => {
    setIsExpanded((prev) => !prev);
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
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Box mt={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h2" align="left" mt={4} gutterBottom>
        {gameData.name}
      </Typography>
      <InfoPanel>
        <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={3}>
          <Box flexShrink={0}>
            <CoverImage src={gameData.cover} alt="Game Cover" />
          </Box>

          <Box flexGrow={2}>
            <Typography variant="h6" gutterBottom>
              Game Summary
            </Typography>
            <GameSummaryContainer>
              <Typography variant="body1" gutterBottom>
                {gameData.summary || "No description available."}
              </Typography>
            </GameSummaryContainer>

            <Typography variant="h6" mt={2} gutterBottom>
              Genres
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
              {gameData.genres.map((genre) => (
                <Chip key={genre} label={genre} variant="outlined" />
              ))}
            </Stack>

            <Box display="flex" alignItems="center" mb={2}>
              <Button
                onClick={toogleStoryline}
                startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                {isExpanded ? "Hide Storyline" : "View Storyline"}
              </Button>
            </Box>

            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              <Typography variant="h6" gutterBottom>
                Storyline
              </Typography>
              <Typography variant="body1">
                {gameData.storyline || "No storyline available."}
              </Typography>
            </Collapse>
          </Box>
        </Box>
      </InfoPanel>
      {gameData.screenshots?.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" align="center" gutterBottom>
            Screenshots
          </Typography>
          <Box position="relative">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={20}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {gameData.screenshots.map((screenshot, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Box>
      )}
      {gameData.videos && gameData.videos.length > 0 && gameData.videos[0] ? (
        <Box mt={4}>
          <Typography variant="h6" align="center" gutterBottom>
            Trailer
          </Typography>
          <Box
            sx={{
              maxWidth: "100%",
              margin: "0 auto",
              marginTop: "1rem",
              position: "relative",
              paddingBottom: "56.25%",
              height: 0,
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <iframe
              width="100%" // Make the iframe fill the container width
              height="100%" // Make the iframe fill the container height
              src={gameData.videos[0]}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
              }}
            ></iframe>
          </Box>
        </Box>
      ) : null}
    </Container>
  );
}

export default GameProfile;
