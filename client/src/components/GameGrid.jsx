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
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ModernGameCard from "./ModernGameCard";

// A modern grid layout for games
function GameGrid({ title, subtitle, icon: Icon, games, error, maxItems = 8 }) {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider", borderBottom: "1px solid" }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: "900",
              mb: 1,
              letterSpacing: "-0.5px",
              background: "linear-gradient(45deg, #1976d2, #9c27b0)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {Icon && <Icon sx={{ mr: 2, verticalAlign: "middle", fontSize: "40px" }} />}
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
          <Grid container spacing={4}>
            {games?.slice(0, maxItems).map((game) => (
              <Grid item xs={12} sm={6} md={3} key={game.id}>
                 <ModernGameCard game={game} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default GameGrid;
