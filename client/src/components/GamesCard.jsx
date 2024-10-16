import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Rating } from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: 0,
  left: "50%",
  transform: "translateX(-50%)",
  width: 350,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 2,
};

function GamesCard({ gameName, cover, rating, releaseDate, summary, cardID }) {
  const convertedRating = rating / 10 / 2;
  const [openShareModal, setOpenShareModal] = React.useState(false);

  const handleShareOpen = () => {
    setOpenShareModal(true);
    const shareLink = `${window.location.origin}/gameprofile/${cardID}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        console.log("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
    setTimeout(() => {
      setOpenShareModal(false);
    }, 3000);
  };

  const handleShareClose = () => setOpenShareModal(false);
  const handleDetailsOpen = () => setOpenDetailsModal(true);
  const handleDetailsClose = () => setOpenDetailsModal(false);

  return (
    <Card
      sx={{
        maxWidth: 345,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingBottom: "2rem",
        marginX: "0.75rem",
      }}
    >
      <CardMedia
        sx={{
          objectFit: "cover",
          height: 200,
          backgroundPosition: "center",
        }}
        image={cover}
        title={gameName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {gameName}
        </Typography>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary", paddingRight: "8px" }}
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
            />
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              N/A
            </Typography>
          )}
        </div>

        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <b>Release Date: </b> {releaseDate}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          <b>Summary:</b>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            maxHeight: "150px",
            overflowY: "auto",
            overflowX: "hidden",
            paddingTop: "8px",
          }}
        >
          {summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" variant="contained" onClick={handleShareOpen}>
          Share
        </Button>
        <Button size="small" variant="contained" onClick={handleDetailsOpen}>
          <Link
            to={`/gameprofile/${cardID}`}
            style={{ textDecoration: "none", color: "white" }}
          >
            Learn More
          </Link>
        </Button>

        <Modal
          open={openShareModal}
          onClose={handleShareClose}
          aria-labelledby="share-modal-title"
          aria-describedby="share-modal-description"
        >
          <Box sx={style}>
            <Typography id="share-modal-description" sx={{ mt: 0 }}>
              The link has been copied to your clipboard!
            </Typography>
          </Box>
        </Modal>
      </CardActions>
    </Card>
  );
}

export default GamesCard;
