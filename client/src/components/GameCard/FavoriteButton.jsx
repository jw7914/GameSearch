import { React, useState, useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton from "@mui/material/IconButton";
import {
  addFavoriteGame,
  removeFavoriteGame,
  retrieveFavorites,
} from "../../../api/api";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";
import { useNavigate } from "react-router-dom";

function FavoriteButton({ gameID, gameName, cover }) {
  const [liked, setLiked] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState({});
  const { isLoggedIn, user } = getFirebaseUser();
  const navigate = useNavigate();

  // Edit favorite status
  const editFavoriteStatus = (e) => {
    e.stopPropagation(); // Prevents the event from propagating to the parent CardActionArea
    if (isLoggedIn && user) {
      if (!liked) {
        setLiked(true);
        addFavoriteGame({ user, gameID, gameName, cover });
      } else {
        setLiked(false);
        removeFavoriteGame({ user, gameID });
      }
    } else {
      navigate("/login");
    }
  };

  // Fetch favorite games when user is available
  useEffect(() => {
    if (user) {
      const fetchFavorites = async () => {
        await retrieveFavorites({ user, setFavoriteGames });
      };
      fetchFavorites();
    }
  }, [user]);

  // Check if the current game is in the favorites list
  useEffect(() => {
    if (favoriteGames && favoriteGames[String(gameID)] !== undefined) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [favoriteGames, gameID]);

  return (
    <IconButton
      onClick={(e) => editFavoriteStatus(e)} // Pass the event object to stop propagation
      sx={{
        "&:hover": {
          backgroundColor: "action.hover",
          transform: "scale(1.05)",
        },
        backgroundColor: "background.default",
        border: 1,
        borderColor: "divider",
        borderRadius: "50%",
        padding: "8px",
        margin: "5px",
        transition: "all 0.2s ease",
      }}
    >
      {liked ? (
        <FavoriteIcon
          sx={{
            color: "#FF6347",
          }}
        />
      ) : (
        <FavoriteBorderIcon />
      )}
    </IconButton>
  );
}

export default FavoriteButton;
