import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Stack,
} from "@mui/material";
import { getLatestGames } from "../../../api/api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" align="center" sx={{ marginBottom: "30px" }}>
        Latest Games
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      <Grid container spacing={3} justifyContent="center">
        {games.map((game) => (
          <Grid item key={game.id} xs={12} sm={6} md={3} lg={2.5}>
            <Card
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 4,
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" },
                maxWidth: "100%",
              }}
              onClick={() => navigate(`/gameprofile/${game.id}`)}
            >
              <CardMedia
                component="img"
                height="280px"
                width="100%"
                image={game.cover}
                alt={`${game.name} cover`}
                sx={{
                  objectFit: "cover",
                }}
              />
              <CardContent sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ marginTop: 1 }}
                >
                  {game.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Home;
