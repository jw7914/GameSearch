import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { getSpecificGame } from "../../../api/api";

function GameProfile() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (id) {
      getSpecificGame(id, setLoading, setError, setGameData);
    }
  }, [id]);
  if (error) return <div>Error: {error}</div>; // Show error state

  // Display the game object once fetched
  return (
    <Container>
      <h1>Game Profile</h1>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      ) : error ? (
        <Stack sx={{ width: "100%", marginBottom: "2rem" }} spacing={2}>
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Stack>
      ) : gameData ? (
        <pre>{JSON.stringify(gameData, null, 2)}</pre>
      ) : (
        <div>No game data available.</div>
      )}
    </Container>
  );
}

export default GameProfile;
