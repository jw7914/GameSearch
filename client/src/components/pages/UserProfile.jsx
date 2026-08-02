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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Favorite as FavoriteIcon,
  Schedule as ScheduleIcon,
  NewReleases as NewReleasesIcon,
  Person as PersonIcon,
  GamepadOutlined as GamepadIcon,
  Edit as EditIcon,
  Share as ShareIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { 
  retrieveFavorites, 
  removeFavoriteGame, 
  getUserProfile, 
  updateUserProfile,
  getPublicUserProfile
} from "../../../api/api";
import GameGrid from "../GameGrid";
import { useNavigate, useParams } from "react-router-dom";

function UserProfilePage() {
  const [activeTab, setActiveTab] = useState("favorites");
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState({});
  const [error, setError] = useState("");
  const [removingGameId, setRemovingGameId] = useState(null);
  
  // Personalization State
  const [bio, setBio] = useState("");
  const [genres, setGenres] = useState([]);
  const [dbDisplayName, setDbDisplayName] = useState("");
  const [dbAvatar, setDbAvatar] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editGenres, setEditGenres] = useState([]);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { userId } = useParams();

  // Games for tabs
  const [recentGames, setRecentGames] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);

  const { isLoggedIn, user } = getFirebaseUser();
  const navigate = useNavigate();

  const AVAILABLE_GENRES = [
    "Action", "Adventure", "RPG", "Shooter", "Strategy", 
    "Sports", "Racing", "Fighting", "Puzzle", "Simulation", "Platformer", "Indie"
  ];

  const isOwner = !userId || (isLoggedIn && user && userId === user.uid);

  // Load user details and profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");

      if (isOwner) {
        if (isLoggedIn && user) {
          setUserDetails(user);
          await getUserProfile({ 
            user, 
            setBio, 
            setGenres, 
            setDisplayName: setDbDisplayName, 
            setAvatar: setDbAvatar,
            setIsPublic 
          });
          setLoading(false);
        } else {
          setLoading(false);
          // If accessing /profile directly without being logged in
          if (!userId) {
            setError("Please log in to view your profile");
          }
        }
      } else {
        // Public Profile View
        await getPublicUserProfile({
          uid: userId,
          setBio,
          setGenres,
          setDisplayName: setDbDisplayName,
          setAvatar: setDbAvatar,
          setFavoriteGames,
          setError
        });
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isLoggedIn, user, userId, isOwner]);

  // Derive games for tabs from favorites
  useEffect(() => {
    if (Object.keys(favoriteGames).length > 0) {
      const now = Math.floor(Date.now() / 1000); // Current time in Unix seconds
      const recent = [];
      const upcoming = [];

      Object.entries(favoriteGames).forEach(([gameId, data]) => {
        const releaseDate = data.releaseDate;
        if (releaseDate) {
          const gameObj = {
            id: gameId,
            name: data.gameName,
            cover: data.gameCover,
          };
          
          if (releaseDate > now) {
            upcoming.push(gameObj);
          } else if (releaseDate <= now && releaseDate > now - (6 * 30 * 24 * 60 * 60)) {
            // Released within the last 6 months
            recent.push(gameObj);
          }
        }
      });

      // Sort recent by newest first
      recent.sort((a, b) => favoriteGames[b.id].releaseDate - favoriteGames[a.id].releaseDate);
      // Sort upcoming by soonest first
      upcoming.sort((a, b) => favoriteGames[a.id].releaseDate - favoriteGames[b.id].releaseDate);

      setRecentGames(recent);
      setUpcomingGames(upcoming);
    } else {
      setRecentGames([]);
      setUpcomingGames([]);
    }
  }, [favoriteGames]);

  // Load favorites with better error handling
  const loadFavorites = useCallback(async () => {
    if (!isOwner || !isLoggedIn || !user) return;

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
  }, [isOwner, isLoggedIn, user]);

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
    if (dbDisplayName) return dbDisplayName;
    if (!userDetails) return "Guest";
    return (
      userDetails.displayName || userDetails.email?.split("@")[0] || "User"
    );
  };

  // Helper function to get user avatar
  const getUserAvatar = () => {
    if (dbAvatar) return dbAvatar;
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

  // Edit Profile Handlers
  const handleOpenEditModal = () => {
    setEditBio(bio);
    setEditGenres(genres);
    setEditDisplayName(getUserDisplayName());
    setEditAvatar(getUserAvatar() || "");
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({ 
        user, 
        bio: editBio, 
        genres: editGenres,
        displayName: editDisplayName,
        avatar: editAvatar,
        isPublic: isPublic // Keep existing visibility
      });
      setBio(editBio);
      setGenres(editGenres);
      setDbDisplayName(editDisplayName);
      setDbAvatar(editAvatar);
      setIsEditModalOpen(false);
      window.dispatchEvent(new Event("profileUpdated"));
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleVisibilityChange = async (event) => {
    const newIsPublic = event.target.checked;
    try {
      await updateUserProfile({
        user,
        bio,
        genres,
        displayName: dbDisplayName,
        avatar: dbAvatar,
        isPublic: newIsPublic,
      });
      setIsPublic(newIsPublic);
    } catch (err) {
      setError("Failed to update profile visibility.");
    }
  };

  const handleShareProfile = () => {
    setIsShareModalOpen(true);
    setCopied(false);
  };

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/profile/${user.uid}`;
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Loading screen with better UX
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
          <Box sx={{ textAlign: "center", color: "text.primary", mb: 4 }}>
            <CircularProgress color="primary" size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading your profile...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  // Error state for unauthenticated users trying to view their own profile
  if (!isLoggedIn && isOwner) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
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
              bgcolor: "background.paper",
              borderRadius: 3,
            }}
          >
            <PersonIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h4" gutterBottom color="text.primary">
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

  // Error state for private or non-existent profiles
  if (error === "This profile is private." || error === "User not found.") {
    const isPrivate = error === "This profile is private.";
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ py: 8, flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: "center",
              bgcolor: "background.paper",
              borderRadius: 3,
              maxWidth: 500,
              width: "100%",
            }}
          >
            {isPrivate ? (
              <LockIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            ) : (
              <PersonIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            )}
            <Typography variant="h4" gutterBottom color="text.primary" fontWeight="bold">
              {isPrivate ? "Private Profile" : "User Not Found"}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {isPrivate 
                ? "This user has chosen to keep their profile private." 
                : "The profile you are looking for does not exist."}
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
        bgcolor: "background.default",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          py: { xs: 4, md: 6 },
          px: { xs: 2, md: 4 },
          borderBottom: 1,
          borderColor: "divider",
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, flexWrap: "wrap", justifyContent: { xs: "center", sm: "flex-start" } }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: "bold",
                    fontSize: { xs: "2rem", md: "3rem" },
                  }}
                >
                  {getUserDisplayName()}
                </Typography>
                {isOwner && (
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<EditIcon />}
                    onClick={handleOpenEditModal}
                    sx={{ borderRadius: "20px" }}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>

              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mb: 2,
                  maxWidth: "600px",
                  mx: { xs: "auto", sm: 0 },
                  minHeight: "24px"
                }}
              >
                {bio || "No bio added yet. Click 'Edit Profile' to tell the world about your gaming journey!"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-start" },
                  mb: 2
                }}
              >
                {genres.map((g) => (
                  <Chip key={g} label={g} size="small" color="primary" />
                ))}
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                {isOwner && (
                  <>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={isPublic} 
                          onChange={handleVisibilityChange} 
                          color="primary"
                          size="small"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={0.5} minWidth="75px">
                          {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                          <Typography variant="body2">{isPublic ? "Public" : "Private"}</Typography>
                        </Box>
                      }
                      sx={{ 
                        m: 0, 
                        bgcolor: 'background.paper', 
                        pr: 2, 
                        pl: 1, 
                        py: 0.25, 
                        borderRadius: "20px",
                        border: "1px solid",
                        borderColor: "divider"
                      }}
                    />
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<ShareIcon />}
                      onClick={handleShareProfile}
                      sx={{ borderRadius: "20px" }}
                    >
                      Share Profile
                    </Button>
                  </>
                )}
                
                <Chip
                  icon={<GamepadIcon />}
                  label={`${Object.keys(favoriteGames).length} Favorites`}
                  variant="outlined"
                  sx={{
                    ml: { sm: "auto" },
                    color: "text.primary",
                    borderColor: "divider",
                    "&:hover": { backgroundColor: "action.hover" },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pb: 4 }}>
        {/* Generic Error Alert for other errors */}
        {error && error !== "This profile is private." && error !== "User not found." && (
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
            bgcolor: "background.paper",
            borderRadius: 3,
            overflow: "hidden",
            border: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              bgcolor: "background.default",
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTabs-indicator": {
                backgroundColor: "primary.main",
                height: 3,
              },
            }}
          >
            <Tab
              icon={<FavoriteIcon />}
              label="Favorites"
              value="favorites"
              sx={{
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
                py: 2,
              }}
            />
            <Tab
              icon={<NewReleasesIcon />}
              label="Recent Releases"
              value="recent"
              sx={{
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
                py: 2,
              }}
            />
            <Tab
              icon={<ScheduleIcon />}
              label="Upcoming"
              value="upcoming"
              sx={{
                color: "text.secondary",
                "&.Mui-selected": { color: "primary.main" },
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
                isOwner={isOwner}
              />
            )}

            {/* Recent Releases Tab */}
            {activeTab === "recent" && (
              <Box sx={{ mt: 2 }}>
                {recentGames.length > 0 ? (
                  <GameGrid title="Recently Released Favorites" games={recentGames} maxItems={12} />
                ) : (
                  <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                    None of your favorited games were released recently.
                  </Typography>
                )}
              </Box>
            )}

            {/* Upcoming Tab */}
            {activeTab === "upcoming" && (
              <Box sx={{ mt: 2 }}>
                {upcomingGames.length > 0 ? (
                  <GameGrid title="Upcoming Favorites" games={upcomingGames} maxItems={12} />
                ) : (
                  <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                    None of your favorited games are upcoming releases.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Edit Profile Modal */}
      <Dialog open={isEditModalOpen} onClose={handleCloseEditModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "background.paper" }}>Edit Profile</DialogTitle>
        <DialogContent sx={{ bgcolor: "background.paper", pt: "20px !important" }}>
          <TextField
            margin="dense"
            label="Display Name"
            fullWidth
            value={editDisplayName}
            onChange={(e) => setEditDisplayName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Avatar Image URL"
            fullWidth
            value={editAvatar}
            onChange={(e) => setEditAvatar(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Bio"
            fullWidth
            multiline
            rows={4}
            value={editBio}
            onChange={(e) => setEditBio(e.target.value)}
            placeholder="Tell us about your favorite games, consoles, and playstyle..."
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Favorite Genres</InputLabel>
            <Select
              multiple
              value={editGenres}
              onChange={(e) => setEditGenres(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
              input={<OutlinedInput label="Favorite Genres" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} size="small" />
                  ))}
                </Box>
              )}
            >
              {AVAILABLE_GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  <Checkbox checked={editGenres.indexOf(genre) > -1} />
                  <ListItemText primary={genre} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "background.paper", px: 3, pb: 3 }}>
          <Button onClick={handleCloseEditModal} color="inherit">Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained" color="primary">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Share Profile Modal */}
      <Dialog
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, bgcolor: "background.paper" }
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold", pb: 1 }}>
          Share Your Profile
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="text.secondary" mb={3}>
            {isPublic 
              ? "Your profile is public! Anyone with this link can view your curated gaming library."
              : "Your profile is currently private. You'll need to make it public for others to see your library."}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={user ? `${window.location.origin}/profile/${user.uid}` : ""}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={copied ? "Copied!" : "Copy Link"} placement="top">
                    <IconButton edge="end" color={copied ? "success" : "primary"} onClick={handleCopyLink}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              )
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsShareModalOpen(false)} variant="contained" color="primary" sx={{ borderRadius: 2, textTransform: "none" }}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
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
  isOwner,
}) {
  const gamesArray = Object.entries(favoriteGames);

  if (favoritesLoading) {
    return (
      <Box>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "text.primary", fontWeight: "bold" }}
        >
          Your Favorite Games
        </Typography>
        <Stack spacing={2}>
          {[...Array(3)].map((_, index) => (
            <Card key={index} sx={{ borderRadius: 3, overflow: "hidden", bgcolor: "background.paper" }}>
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
          sx={{ fontSize: 80, color: "text.secondary", opacity: 0.5, mb: 2 }}
        />
        <Typography
          variant="h5"
          gutterBottom
          sx={{ color: "text.primary", fontWeight: "bold" }}
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
        <Typography variant="h5" sx={{ color: "text.primary", fontWeight: "bold" }}>
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
                bgcolor: "background.default",
                border: 1,
                borderColor: "divider",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                  borderColor: "primary.main"
                },
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
                      border: 1,
                      borderColor: "divider",
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
                        color: "text.primary",
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

                {isOwner && (
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
                )}
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
