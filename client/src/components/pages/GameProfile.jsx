import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSpecificGame } from "../../../api/api";
function GameProfile() {
  const { id } = useParams(); // Get the game ID from the URL
  const [gameData, setGameData] = useState(null); // State to hold the game object
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle errors
  useEffect(() => {
    // Fetch game data when the component mounts or the ID changes
    if (id) {
      getSpecificGame(id, setLoading, setError, setGameData);
    }
  }, [id]);

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>Error: {error}</div>; // Show error state

  // Display the game object once fetched
  return (
    <>
      <h1>Game Profile</h1>
      {gameData ? (
        <pre>{JSON.stringify(gameData, null, 2)}</pre>
      ) : (
        <div>No game data available.</div>
      )}
    </>
  );
}

export default GameProfile;
