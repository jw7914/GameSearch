import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FavoriteButton from "./FavoriteButton";

const cardStyle = {
  maxWidth: 300,
  borderRadius: "8px",
  overflow: "visible",
  color: "white",
  position: "relative",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const summaryStyle = {
  position: "absolute",
  top: "100%",
  left: "0%",
  transform: "translateX(-50%) translateY(20px)",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white",
  padding: "2rem 2rem",
  borderRadius: "4px",
  width: "100%",
  opacity: 0,
  pointerEvents: "none",
  zIndex: 10,
  transition: "transform 0.3s ease, opacity 0.3s ease",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.75)",
};

const imageStyle = {
  height: 160,
  objectFit: "cover",
  backgroundPosition: "center",
  position: "relative",
  "&:hover + .summaryBox": {
    opacity: 1,
    transform: "translateY(0)",
  },
};

function GamesCard({ gameName, cover, rating, releaseDate, summary, cardID }) {
  const navigate = useNavigate();
  const convertedRating = rating / 10 / 2;
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleCardClick = () => {
    navigate(`/gameprofile/${cardID}`);
  };

  const handleShareOpen = (e) => {
    e.stopPropagation();
    setOpenShareModal(true);
    const shareLink = `${window.location.origin}/gameprofile/${cardID}`;
    navigator.clipboard.writeText(shareLink);
    setTimeout(() => setOpenShareModal(false), 3000);
  };

  return (
    <Card sx={cardStyle}>
      <CardActionArea disableRipple onClick={handleCardClick}>
        <Box sx={{ position: "relative" }}>
          <CardMedia sx={imageStyle} image={cover} title={gameName} />
          <Box sx={summaryStyle} className="summaryBox">
            <Typography gutterBottom variant="h5" component="div">
              {gameName}
            </Typography>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{ color: "white", paddingRight: "8px" }}
              >
                <b>Rating:</b>
              </Typography>
              {convertedRating > 0 ? (
                <Rating
                  name="read-only"
                  value={convertedRating}
                  readOnly
                  precision={0.1}
                  max={5}
                  sx={{ "& .MuiRating-iconEmpty": { color: "white" } }}
                />
              ) : (
                <Typography variant="body2" sx={{ color: "white" }}>
                  N/A
                </Typography>
              )}
            </div>
            <Typography variant="body2" sx={{ color: "white" }}>
              <b>Release Date: </b> {releaseDate}
            </Typography>
            <Typography variant="body2" sx={{ color: "white" }}>
              <b>Summary:</b>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "white",
                maxHeight: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 8,
                paddingTop: "8px",
              }}
            >
              {summary.length > 550
                ? `${summary.substring(0, 550)} ...`
                : summary}
            </Typography>
          </Box>
        </Box>
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: "bold",
              color: "black",
            }}
          >
            {gameName}
          </Typography>
        </CardContent>
        <CardActions
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: 2,
            pb: 2,
          }}
        >
          <Button
            size="small"
            variant="contained"
            onClick={handleShareOpen}
            sx={{ bgcolor: "#13151A" }}
          >
            Share
          </Button>
          <FavoriteButton gameID={cardID} gameName={gameName} cover={cover} />
        </CardActions>
      </CardActionArea>
      <Modal open={openShareModal} onClose={() => setOpenShareModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 350,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 2,
          }}
        >
          <Typography>The link has been copied to your clipboard!</Typography>
        </Box>
      </Modal>
    </Card>
  );
}

export default GamesCard;
