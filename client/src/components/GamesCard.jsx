import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const cardStyle = {
  maxWidth: 300,
  borderRadius: "8px",
  overflow: "visible", // Allow overflow for the summary box to be visible
  color: "white",
  position: "relative",
  transition: "all 0.3s ease", // Smooth transition for hover effect
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

// Blurb appearance
const summaryStyle = {
  position: "absolute",
  top: "100%",
  left: "0%",
  transform: "translateX(-50%) translateY(20px)",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white",
  padding: "10px 15px",
  borderRadius: "4px",
  width: "100%",
  opacity: 0,
  pointerEvents: "none",
  zIndex: 1, // Ensure it's above the card content
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
  const [openShareModal, setOpenShareModal] = useState(false);

  const handleShareOpen = () => {
    setOpenShareModal(true);
    const shareLink = `${window.location.origin}/gameprofile/${cardID}`;
    navigator.clipboard.writeText(shareLink);
    setTimeout(() => setOpenShareModal(false), 3000);
  };

  const handleShareClose = () => setOpenShareModal(false);

  return (
    <Card
      sx={cardStyle}
      onClick={() => {
        navigate(`/gameprofile/${cardID}`);
      }}
    >
      <CardActionArea disableRipple>
        <Box sx={{ position: "relative" }}>
          <CardMedia sx={imageStyle} image={cover} title={gameName} />

          {/* Summary Box with additional info */}
          <Box sx={summaryStyle} className="summaryBox">
            <Typography variant="body2">{summary}</Typography>
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
          <Button size="small" variant="contained" sx={{ bgcolor: "#13151A" }}>
            <Link
              to={`/gameprofile/${cardID}`}
              style={{ textDecoration: "none", color: "white" }}
            >
              View
            </Link>
          </Button>
        </CardActions>
      </CardActionArea>

      {/* Share Modal */}
      <Modal open={openShareModal} onClose={handleShareClose}>
        <Box sx={style}>
          <Typography>The link has been copied to your clipboard!</Typography>
        </Box>
      </Modal>
    </Card>
  );
}

export default GamesCard;
