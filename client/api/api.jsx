import axios from "axios";

export const api = axios.create({
  // Use for deployment
  baseURL: "https://game-rho-seven.vercel.app/",
  // Use for local testing
  // baseURL: "http://localhost:8080",
});

const endpointMap = {
  search: `/games?search_term=`,
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
