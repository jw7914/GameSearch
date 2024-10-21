import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { Container, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { getSpecificGame } from "../../../api/api";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function GameProfile() {
  const { id } = useParams();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGameData = async () => {
      if (id) {
        await getSpecificGame(id, setLoading, setError, setGameData);
      }
    };
    fetchGameData();
  }, [id]);

  return (
    <Container>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      )}

      {error && (
        <Stack
          sx={{ width: "100%", marginBottom: "2rem", marginTop: "2rem" }}
          spacing={2}
        >
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Stack>
      )}

      {
        !loading && !error

        /* //  error ? (
      //   <Stack sx={{ width: "100%", marginTop: "2rem" }} spacing={2}>
      //     <Alert variant="filled" severity="error">
      //       {error}
      //     </Alert>
      //   </Stack> */
      }
      {/* ) : gameData ? (
        <>
          <Typography variant="h4" component="h1" align="center" mt={4}>
            {gameData.name}
          </Typography>
          {gameData.videos &&
          gameData.videos.length > 1 &&
          gameData.videos[0] ? (
            <Box
              sx={{
                maxWidth: "800px",
                margin: "0 auto",
                marginTop: "2rem",
              }}
            >
              <iframe
                width="800"
                height="450"
                src={gameData.videos[0]}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </Box>
          ) : (
            <Box sx={{ marginTop: "2rem" }}>
              <Typography variant="h6" component="h2" align="center">
                Screenshots
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                sx={{ marginTop: "1rem", justifyContent: "center" }}
              >
                {gameData.screenshots.map((screenshot, index) => (
                  <img
                    key={index}
                    src={screenshot} // Assuming screenshots array has URLs
                    alt={`Screenshot ${index + 1}`}
                    style={{
                      width: "100%", // Allows the image to take the full width of the container
                      maxWidth: "200px", // Ensures the image doesn't exceed 500px in width
                      height: "auto", // Maintains the aspect ratio
                      maxHeight: "300px", // Ensures the image doesn't exceed 300px in height
                      objectFit: "contain", // Ensures the entire image fits within the bounds without cropping
                      borderRadius: "8px", // Adds rounded corners
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Stack
            direction="row"
            spacing={3}
            sx={{ margin: "2rem auto", justifyContent: "center" }}
          >
            <Item>Item 1</Item>
            <Item>Item 2</Item>
            <Item>Item 3</Item>
          </Stack>
          <Typography variant="h6" component="h2" mt={4}>
            Game Data (for Debugging):
          </Typography>
          <pre>{JSON.stringify(gameData, null, 2)}</pre>
        </>
      ) : null */}
    </Container>
  );
}

export default GameProfile;
