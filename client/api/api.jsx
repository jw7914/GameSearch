import axios from "axios";

export const api = axios.create({
  //Use for deployment
  // baseURL: "https://game-rho-seven.vercel.app/",
  //Use for local testing
  baseURL: "http://localhost:8080",
});

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

export const handleSearch = async (
  search_term,
  setLoading,
  setGames,
  setError
) => {
  try {
    setLoading(true);
    setError("");
    const response = await api.get(
      `/games?search_term=${encodeURIComponent(search_term)}`
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

export const handleGenreSearch = async (
  genre,
  setLoading,
  setGames,
  setError
) => {
  try {
    setLoading(true);
    setError("");
    const response = await api.get(
      `/genres?genre=${encodeURIComponent(genre)}`
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
