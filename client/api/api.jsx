import axios from "axios";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const api = axios.create({
  baseURL: isLocal
    ? "http://localhost:8080" // Local URL
    : "https://game-rho-seven.vercel.app/", // Vercel URL
});

const endpointMap = {
  query: `/games?search_term=`,
  genre: `/genres?genre=`,
  // More maps for future API calls
};

export const fetchGenres = async (setLoading, setGenres, setError) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get("/genres?genre");
    const data = response.data;
    setGenres(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching genres:", error);
    setError("Failed to load genres");
    setLoading(false);
  }
};

export const getSpecificGame = async (
  gameID,
  setLoading,
  setError,
  setGameData
) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get(`${gameID}`);
    const data = response.data[0];
    setGameData(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching game:", error);
    setError("Failed to load game");
    setLoading(false);
  }
};

export const getLatestGames = async (setLoading, setGames, setError) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get("/");
    const data = response.data;
    setGames(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching latest games:", error);
    setError("Failed to load latest games");
    setLoading(false);
  }
};

export const getTopRatedGames = async (setLoading, setGames, setError) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get("/top-rated");
    const data = response.data;
    setGames(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching top rated games:", error);
    setError("Failed to load top rated games");
    setLoading(false);
  }
};

export const getUpcomingGames = async (setLoading, setGames, setError) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get("/upcoming");
    const data = response.data;
    setGames(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
    setError("Failed to load upcoming games");
    setLoading(false);
  }
};

export const handleGameSearch = async (
  queryTerm,
  type,
  setLoading,
  setGames,
  setError
) => {
  try {
    setLoading(true);
    setError("");

    const endpoint = endpointMap[type];
    if (!endpoint) {
      throw new Error("Invalid search type");
    }

    const response = await api.get(
      `${endpoint}${encodeURIComponent(queryTerm)}`
    );
    const data = response.data;
    const gamesWithDetails = data.map((el) => ({
      id: el.id,
      name: el.name,
      cover: el.cover,
      summary: el.summary,
      release: el.first_release_date ?? "N/A",
      rating: el.total_rating ?? 0,
    }));
    setGames(gamesWithDetails);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching games:", error);
    setError("Failed to load games");
    setLoading(false);
  }
};

export const handleLoginVerification = async (idToken) => {
  try {
    const response = await api.post("/login", { idToken });
    if (response.status === 200) {
      console.log("Login successful!");
    } else {
      console.error("Login failed:");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
  }
};

export const getPopularGames = async (setLoading, setGames, setError) => {
  try {
    setError("");
    setLoading(true);
    const response = await api.get("/popular");
    const data = response.data;
    setGames(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching popular games:", error);
    setError("Failed to load popular games");
    setLoading(false);
  }
};

export const addFavoriteGame = async ({ user, gameID, gameName, cover, releaseDate }) => {
  try {
    const idToken = await user.getIdToken();
    const response = await api.post("/addGame", {
      idToken: idToken,
      gameID: gameID,
      gameName: gameName,
      cover: cover,
      releaseDate: releaseDate || null,
    });
    if (response.status === 200) {
      console.log("Game Favorited successful!");
    } else {
      console.error("Game Favorited failed");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const removeFavoriteGame = async ({ user, gameID }) => {
  try {
    const idToken = await user.getIdToken();
    const response = await api.post("/removeGame", {
      idToken: idToken,
      gameID: gameID,
    });
    if (response.status === 200) {
      console.log("Game Removed successful!");
    } else {
      console.error("Game Removed failed");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const retrieveFavorites = async ({ user, setFavoriteGames }) => {
  try {
    const idToken = await user.getIdToken();
    const response = await api.post("/retrieveFavorite", {
      idToken,
    });
    setFavoriteGames(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const updateUserProfile = async ({ user, bio, genres, displayName, avatar, isPublic }) => {
  try {
    const idToken = await user.getIdToken();
    const response = await api.post("/updateProfile", {
      idToken,
      bio,
      genres,
      displayName,
      avatar,
      isPublic,
    });
    if (response.status === 200) {
      console.log("Profile updated successfully!");
    } else {
      console.error("Profile update failed");
    }
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};

export const getUserProfile = async ({ user, setBio, setGenres, setDisplayName, setAvatar, setIsPublic }) => {
  try {
    const idToken = await user.getIdToken();
    const response = await api.post("/getProfile", {
      idToken,
    });
    setBio(response.data.bio || "");
    setGenres(response.data.genres || []);
    setDisplayName(response.data.displayName || "");
    setAvatar(response.data.avatar || "");
    if (setIsPublic) setIsPublic(response.data.isPublic || false);
  } catch (error) {
    console.error("Error retrieving profile:", error.response?.data || error.message);
  }
};

export const getPublicUserProfile = async ({ uid, setBio, setGenres, setDisplayName, setAvatar, setFavoriteGames, setError }) => {
  try {
    const response = await api.get(`/getPublicProfile/${uid}`);
    setBio(response.data.bio || "");
    setGenres(response.data.genres || []);
    setDisplayName(response.data.displayName || "");
    setAvatar(response.data.avatar || "");
    setFavoriteGames(response.data.games || {});
  } catch (error) {
    console.error("Error retrieving public profile:", error.response?.data || error.message);
    if (error.response?.status === 403) {
      setError("This profile is private.");
    } else if (error.response?.status === 404) {
      setError("User not found.");
    } else {
      setError("Failed to load profile.");
    }
  }
};
