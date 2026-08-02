import React from "react";
import {
  Box,
  Typography,
  Alert,
  Container,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ModernGameCard from "./ModernGameCard";

function GameCarousel({
  title,
  subtitle,
  icon: Icon,
  games,
  error,
  cardsPerView,
}) {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: cardsPerView,
    slidesToScroll: cardsPerView,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "900",
              mb: 1,
              letterSpacing: "-0.5px",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {Icon && (
              <Icon
                sx={{ mr: 2, verticalAlign: "middle", fontSize: "40px" }}
              />
            )}
            {title}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            {subtitle}
          </Typography>
        </Box>

        {error ? (
          <Alert severity="error" sx={{ borderRadius: 2, mb: 4 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ px: { xs: 2, md: 6 }, pb: 4 }}>
            <Slider {...settings}>
              {games?.map((game) => (
                <Box key={game.id} sx={{ p: 2, height: "100%" }}>
                  <ModernGameCard game={game} />
                </Box>
              ))}
            </Slider>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default GameCarousel;
