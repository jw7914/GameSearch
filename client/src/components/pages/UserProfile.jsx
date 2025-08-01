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
  CardActionArea,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { retrieveFavorites, removeFavoriteGame } from "../../../api/api";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const [value, setValue] = useState("1");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteGames, setFavoriteGames] = useState({});
  const { isLoggedIn, user } = getFirebaseUser();
  const navigate = useNavigate();

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
    navigate(`/gameprofile/${gameId}`);
  };

  const handleRemoveFavorite = async (gameId) => {
    if (user) {
      await removeFavoriteGame({ user, gameID: gameId });
      setFavoriteGames((prevGames) => {
        const newGames = { ...prevGames };
        delete newGames[gameId];
        return newGames;
      });
    }
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
            <Typography variant="h6" gutterBottom sx={{ textAlign: "left" }}>
              Your Favorite Games
            </Typography>
            {Object.keys(favoriteGames).length > 0 ? (
              <Box sx={{ width: "95%", margin: "0 auto" }}>
                <Stack spacing={2}>
                  {Object.keys(favoriteGames).map((gameId) => (
                    <Card
                      onClick={() => handleCardClick(gameId)}
                      key={gameId}
                      sx={{
                        backgroundColor: "white",
                        color: "black",
                        boxShadow: 3,
                        // Removed the transition and hover transform to eliminate the scaling effect
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 4,
                        p: 1,
                      }}
                    >
                      {/* CardActionArea now wraps both the image and the title, making them one clickable section */}
                      <CardActionArea
                        disableRipple // Added to remove the ripple effect on click
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexGrow: 1,
                          "&:hover": {
                            backgroundColor: "white",
                          },
                        }}
                      >
                        <CardMedia
                          component="img"
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            flexShrink: 0,
                          }}
                          image={favoriteGames[gameId].gameCover}
                          alt={favoriteGames[gameId].gameName}
                        />
                        <CardContent sx={{ flexGrow: 1, pl: 2, p: 0 }}>
                          <Typography
                            component="div"
                            variant="h6"
                            style={{ marginLeft: "2rem" }}
                          >
                            {favoriteGames[gameId].gameName}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                      {/* IconButton remains outside the CardActionArea to keep its functionality separate */}
                      <IconButton
                        aria-label="remove from favorites"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleRemoveFavorite(gameId);
                        }}
                        sx={{
                          flexShrink: 0,
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Card>
                  ))}
                </Stack>
              </Box>
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
