import { React, useState } from "react";
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
  const [favoriteGame, setFavorite] = useState([]);
  const { isLoggedIn, user } = getFirebaseUser();

  const navigate = useNavigate();
  const editFavoriteStatus = () => {
    if (isLoggedIn) {
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

  useEffect(() => {
    retrieveFavorites({ user });
  }, [liked]);

  return (
    <IconButton
      onClick={() => editFavoriteStatus()}
      sx={{
        "&:hover": {
          backgroundColor: "white",
        },
        backgroundColor: "white",
        borderRadius: "50%",
        padding: "5px",
        margin: "5px",
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
