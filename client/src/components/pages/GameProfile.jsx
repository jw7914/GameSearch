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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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
        try {
          await getSpecificGame(id, setLoading, setError, setGameData);
        } catch (err) {
          setError("Failed to fetch game data");
        }
      }
    };
    fetchGameData();
  }, [id]);

  if (error) {
    return (
      <Container>
        <Stack sx={{ width: "100%", marginTop: "2rem" }} spacing={2}>
          <Alert variant="filled" severity="error">
            {error}
          </Alert>
        </Stack>
      </Container>
    );
  }

  return (
    <Container>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress size={50} />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h1" align="center" mt={4}>
            {gameData.name}
          </Typography>
          {gameData && (
            <Box
              sx={{
                display: "flex",
                maxWidth: "100%",
                margin: "0 auto",
                marginTop: "0.5rem",
              }}
            >
              {gameData.cover && (
                <img
                  className="img-fluid rounded shadow"
                  src={gameData.cover}
                  alt="Game Cover"
                  style={{
                    marginRight: "2rem",
                    width: "100%",
                    height: "auto",
                  }}
                />
              )}

              {gameData.screenshots && (
                <Swiper
                  spaceBetween={30}
                  centeredSlides={true}
                  pagination={{
                    clickable: true,
                  }}
                  scrollbar={{ draggable: true }}
                  navigation={true}
                  modules={[Pagination, Navigation, Scrollbar]}
                  className="swiper"
                >
                  {gameData.screenshots.map((screenshot, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={screenshot}
                        alt={`Screenshot ${index + 1}`}
                        style={{
                          width: "100%", // Keep the width 100% of the container
                          height: "auto", // Maintain aspect ratio
                          objectFit: "cover", // Ensures no stretching or compression
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </Box>
          )}
        </>
      )}

      {gameData && gameData.genres && (
        <>
          <Typography variant="h4" component="h1" align="center" mt={4}>
            Genres
          </Typography>
          <Stack spacing={4} justifyContent="center" alignItems="center" mt={2}>
            {gameData.genres.map((genre, index) => (
              <Item key={index} sx={{ margin: "auto" }}>
                {genre}
              </Item>
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
}

export default GameProfile;

{
  /* ) : gameData ? (
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
      ) : null */
}
// </Container>
//   );
// }

// export default GameProfile;
