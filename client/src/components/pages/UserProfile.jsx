import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  CircularProgress,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActionArea, // Import CardActionArea for clickable cards
} from "@mui/material";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { retrieveFavorites } from "../../../api/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function UserProfilePage() {
  const [value, setValue] = useState("1");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteGames, setFavoriteGames] = useState({});
  const { isLoggedIn, user } = getFirebaseUser();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserDetails(user);
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (isLoggedIn && user) {
      retrieveFavorites({ user, setFavoriteGames });
    }
  }, [isLoggedIn, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCardClick = (gameId) => {
    navigate(`/gameprofile/${gameId}`); // Navigate to the game profile page
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#132151",
          color: "white",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth="100%">
      <Box
        sx={{
          backgroundColor: "#132151",
          width: "100%",
          color: "white",
          paddingBottom: 10,
          paddingTop: 10,
          paddingLeft: 5,
          paddingRight: 5,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          {userDetails
            ? `Welcome ${
                userDetails.displayName || userDetails.email || "Guest"
              } to your Game List`
            : "Welcome to your Game List"}
        </Typography>
        <Typography>
          Here you can see all the games you have bookmarked or favorited in the
          past.
        </Typography>
      </Box>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ marginLeft: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All" value="1" />
          <Tab label="Recently Released" value="2" />
          <Tab label="Upcoming" value="3" />
        </Tabs>
        {value === "1" && (
          <Box sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Favorite Games
            </Typography>
            {Object.keys(favoriteGames).length > 0 ? (
              <Stack spacing={2}>
                {Object.keys(favoriteGames).map((gameId) => (
                  <Card
                    key={gameId}
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      boxShadow: 3,
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleCardClick(gameId)} // Add onClick handler
                      sx={{ display: "flex", height: 150 }}
                    >
                      <CardContent sx={{ flex: 1, textAlign: "left" }}>
                        <Typography component="div" variant="h5">
                          {favoriteGames[gameId].gameName}
                        </Typography>
                      </CardContent>
                      <CardMedia
                        component="img"
                        sx={{ width: 100, height: "auto" }}
                        image={favoriteGames[gameId].gameCover}
                        alt={favoriteGames[gameId].gameName}
                      />
                    </CardActionArea>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography>You have no favorite games yet.</Typography>
            )}
          </Box>
        )}
        {value === "2" && (
          <Box sx={{ padding: 2 }}>Recently Released Games</Box>
        )}
        {value === "3" && <Box sx={{ padding: 2 }}>Upcoming Games</Box>}
      </Box>
    </Container>
  );
}

export default UserProfilePage;
