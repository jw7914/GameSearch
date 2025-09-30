import React, { useEffect, useState, useCallback } from "react";
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
  Alert,
  Fade,
  Chip,
  Avatar,
  Divider,
  Paper,
  Skeleton,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  NewReleases as NewReleasesIcon,
  Person as PersonIcon,
  GamepadOutlined as GamepadIcon,
} from "@mui/icons-material";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { retrieveFavorites, removeFavoriteGame } from "../../../api/api";
import { useNavigate } from "react-router-dom";

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState({});
  const [error, setError] = useState("");
  const [removingGameId, setRemovingGameId] = useState(null);
  const { isLoggedIn, user } = getFirebaseUser();
  const navigate = useNavigate();

  // Load user details
  useEffect(() => {
    if (isLoggedIn && user) {
      setUserDetails(user);
      setLoading(false);
    } else if (!isLoggedIn) {
      setLoading(false);
      setError("Please log in to view your profile");
    }
  }, [isLoggedIn, user]);

  // Load favorites with better error handling
  const loadFavorites = useCallback(async () => {
    if (!isLoggedIn || !user) return;

    try {
      setFavoritesLoading(true);
      setError("");
      await retrieveFavorites({ user, setFavoriteGames });
    } catch (err) {
      console.error("Error loading favorites:", err);
      setError("Failed to load your favorite games. Please try again.");
    } finally {
      setFavoritesLoading(false);
    }
  }, [isLoggedIn, user]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCardClick = (gameId) => {
    navigate(`/gameprofile/${gameId}`);
  };

  const handleRemoveFavorite = async (gameId) => {
    if (!user) return;

    try {
      setRemovingGameId(gameId);
      await removeFavoriteGame({ user, gameID: gameId });
      setFavoriteGames((prevGames) => {
        const newGames = { ...prevGames };
        delete newGames[gameId];
        return newGames;
      });
    } catch (err) {
      console.error("Error removing favorite:", err);
      setError("Failed to remove game from favorites. Please try again.");
    } finally {
      setRemovingGameId(null);
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = () => {
    if (!userDetails) return "Guest";
    return (
      userDetails.displayName || userDetails.email?.split("@")[0] || "User"
    );
  };

  // Helper function to get user avatar
  const getUserAvatar = () => {
    if (userDetails?.photoURL) return userDetails.photoURL;
    return null;
  };

  // Filter games based on active tab (placeholder for future implementation)
  const getFilteredGames = () => {
    const gamesArray = Object.entries(favoriteGames);

    switch (activeTab) {
      case "favorites":
        return gamesArray;
      case "recent":
        // Placeholder for recently released games
        return gamesArray.filter(() => false); // Empty for now
      case "upcoming":
        // Placeholder for upcoming games
        return gamesArray.filter(() => false); // Empty for now
      default:
        return gamesArray;
    }
  };

  // Loading screen with better UX
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#132151",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Box sx={{ textAlign: "center", color: "white", mb: 4 }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your profile...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state for unauthenticated users
  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#132151",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: "center",
              backgroundColor: "white",
              borderRadius: 3,
            }}
          >
            <PersonIcon sx={{ fontSize: 80, color: "#132151", mb: 2 }} />
            <Typography variant="h4" gutterBottom color="#132151">
              Please Log In
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              You need to be logged in to view your profile and manage your
              favorite games.
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#132151",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          backgroundColor: "#132151",
          color: "white",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "center", sm: "flex-start" },
              gap: 3,
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {/* Avatar */}
            <Avatar
              src={getUserAvatar()}
              sx={{
                width: { xs: 80, md: 120 },
                height: { xs: 80, md: 120 },
                bgcolor: "#1976d2",
                fontSize: { xs: "2rem", md: "3rem" },
                border: "4px solid white",
                boxShadow: 3,
              }}
            >
              {getUserDisplayName()[0]?.toUpperCase()}
            </Avatar>

            {/* User Info */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", md: "3rem" },
                  mb: 1,
                }}
              >
                Welcome, {getUserDisplayName()}!
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  opacity: 0.9,
                  mb: 2,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                Manage your favorited games
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Chip
                  icon={<GamepadIcon />}
                  label={`${Object.keys(favoriteGames).length} Favorites`}
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {/* Error Alert */}
        {error && (
          <Fade in={!!error}>
            <Alert
              severity="error"
              onClose={() => setError("")}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Navigation Tabs */}
        <Paper
          elevation={2}
          sx={{
            backgroundColor: "white",
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              backgroundColor: "#f8f9fa",
              "& .MuiTabs-indicator": {
                backgroundColor: "#132151",
                height: 3,
              },
            }}
          >
            <Tab
              icon={<FavoriteIcon />}
              label="Favorites"
              value="favorites"
              sx={{
                color: "#666",
                "&.Mui-selected": { color: "#132151" },
                py: 2,
              }}
            />
            <Tab
              icon={<NewReleasesIcon />}
              label="Recent Releases"
              value="recent"
              sx={{
                color: "#666",
                "&.Mui-selected": { color: "#132151" },
                py: 2,
              }}
            />
            <Tab
              icon={<ScheduleIcon />}
              label="Upcoming"
              value="upcoming"
              sx={{
                color: "#666",
                "&.Mui-selected": { color: "#132151" },
                py: 2,
              }}
            />
          </Tabs>

          <Divider />

          {/* Tab Content */}
          <Box sx={{ p: { xs: 2, md: 3 }, minHeight: 400 }}>
            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <FavoriteGamesContent
                favoriteGames={favoriteGames}
                favoritesLoading={favoritesLoading}
                removingGameId={removingGameId}
                handleCardClick={handleCardClick}
                handleRemoveFavorite={handleRemoveFavorite}
                onRetry={loadFavorites}
              />
            )}

            {/* Recent Releases Tab */}
            {activeTab === "recent" && (
              <ComingSoonContent
                title="Recently Released Games"
                description="This feature will show games that have been released recently and match your preferences."
                icon={
                  <NewReleasesIcon
                    sx={{ fontSize: 80, color: "#132151", opacity: 0.5 }}
                  />
                }
              />
            )}

            {/* Upcoming Tab */}
            {activeTab === "upcoming" && (
              <ComingSoonContent
                title="Upcoming Games"
                description="This feature will show highly anticipated games coming soon that you might be interested in."
                icon={
                  <ScheduleIcon
                    sx={{ fontSize: 80, color: "#132151", opacity: 0.5 }}
                  />
                }
              />
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

// Separate component for favorites content
function FavoriteGamesContent({
  favoriteGames,
  favoritesLoading,
  removingGameId,
  handleCardClick,
  handleRemoveFavorite,
  onRetry,
}) {
  const gamesArray = Object.entries(favoriteGames);

  if (favoritesLoading) {
    return (
      <Box>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#132151", fontWeight: "bold" }}
        >
          Your Favorite Games
        </Typography>
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ borderRadius: 3, overflow: "hidden" }}>
              <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={80}
                  sx={{ borderRadius: 2, flexShrink: 0 }}
                />
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="30%" height={20} />
                </Box>
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  if (gamesArray.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <FavoriteIcon
          sx={{ fontSize: 80, color: "#132151", opacity: 0.5, mb: 2 }}
        />
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "#132151", fontWeight: "bold" }}
        >
          No Favorite Games Yet
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 3, maxWidth: 400, mx: "auto" }}
        >
          Start building your gaming library by exploring games and adding them
          to your favorites!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ color: "#132151", fontWeight: "bold" }}>
          Your Favorite Games
        </Typography>
        <Chip
          label={`${gamesArray.length} ${
            gamesArray.length === 1 ? "Game" : "Games"
          }`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Stack spacing={2}>
        {gamesArray.map(([gameId, gameData]) => (
          <Fade key={gameId} in timeout={300}>
            <Card
              sx={{
                borderRadius: 3,
                overflow: "hidden",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
                border: "1px solid #e0e0e0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CardActionArea
                  onClick={() => handleCardClick(gameId)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexGrow: 1,
                    p: 2,
                    "&:hover .game-title": {
                      color: "#132151",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      flexShrink: 0,
                      objectFit: "cover",
                      border: "2px solid #f0f0f0",
                    }}
                    image={gameData.gameCover}
                    alt={gameData.gameName}
                  />
                  <CardContent sx={{ flexGrow: 1, pl: 3, py: 0 }}>
                    <Typography
                      variant="h6"
                      className="game-title"
                      sx={{
                        fontWeight: "600",
                        color: "#333",
                        transition: "color 0.2s ease",
                        mb: 0.5,
                      }}
                    >
                      {gameData.gameName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Click to view details
                    </Typography>
                  </CardContent>
                </CardActionArea>

                <Box sx={{ px: 2 }}>
                  <IconButton
                    aria-label="Remove from favorites"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleRemoveFavorite(gameId);
                    }}
                    disabled={removingGameId === gameId}
                    sx={{
                      color: "#d32f2f",
                      "&:hover": {
                        backgroundColor: "rgba(211, 47, 47, 0.1)",
                      },
                      "&:disabled": {
                        color: "#ccc",
                      },
                    }}
                  >
                    {removingGameId === gameId ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Card>
          </Fade>
        ))}
      </Stack>
    </Box>
  );
}

// Coming soon component for placeholder tabs
function ComingSoonContent({ title, description, icon }) {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      {icon}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ color: "#132151", fontWeight: "bold", mt: 2 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: 500, mx: "auto" }}
      >
        {description}
      </Typography>
      <Chip
        label="Coming Soon"
        color="primary"
        variant="outlined"
        sx={{ mt: 3 }}
      />
    </Box>
  );
}

export default UserProfilePage;
