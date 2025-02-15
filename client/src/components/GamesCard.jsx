import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

const cardStyle = {
  maxWidth: 300,
  borderRadius: "8px",
  overflow: "hidden",
  color: "white",
  position: "relative",
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

function GamesCard({ gameName, cover, cardID }) {
  const [openShareModal, setOpenShareModal] = React.useState(false);

  const handleShareOpen = () => {
    setOpenShareModal(true);
    const shareLink = `${window.location.origin}/gameprofile/${cardID}`;
    navigator.clipboard.writeText(shareLink);
    setTimeout(() => setOpenShareModal(false), 3000);
  };

  const handleShareClose = () => setOpenShareModal(false);

  return (
    <Card sx={cardStyle}>
      <CardActionArea disableRipple>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            sx={{
              height: 160,
              objectFit: "cover",
              backgroundPosition: "center",
            }}
            image={cover}
            title={gameName}
          />
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
