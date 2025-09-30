import { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  CardActionArea,
  Rating,
  Fade,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteButton from "./FavoriteButton";

const cardStyle = {
  maxWidth: 300,
  borderRadius: "16px",
  overflow: "hidden",
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
  borderRadius: "16px 16px 0 0",
  "&:hover + .summaryBox": {
    opacity: 1,
    transform: "translateY(0)",
  },
};

function GamesCard({ gameName, cover, rating, releaseDate, summary, cardID }) {
  const navigate = useNavigate();
  const convertedRating = rating / 10 / 2;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCardClick = () => {
    navigate(`/gameprofile/${cardID}`);
  };

  const shareLink = `${window.location.origin}/gameprofile/${cardID}`;

  const handleShareOpen = async (e) => {
    e.stopPropagation();
    setOpenShareModal(true);

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpenShareModal(false);
      }, 2000);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
      // Modal will still show for manual copying
    }
  };

  const handleCopyClick = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Card sx={cardStyle}>
      <CardActionArea disableRipple onClick={handleCardClick}>
        <Box
          sx={{
            position: "relative",
            borderRadius: "16px 16px 0 0",
          }}
        >
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
          <Tooltip title="Share this game">
            <Button
              size="small"
              variant="contained"
              startIcon={<ShareIcon />}
              onClick={handleShareOpen}
              sx={{
                bgcolor: "#13151A",
                color: "white",
                textTransform: "none",
                fontWeight: "medium",
                borderRadius: "8px",
                px: 2,
                "&:hover": {
                  bgcolor: "#2d3748",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(19, 21, 26, 0.4)",
                },
                transition: "all 0.2s ease",
              }}
            >
              Share
            </Button>
          </Tooltip>
          <FavoriteButton gameID={cardID} gameName={gameName} cover={cover} />
        </CardActions>
      </CardActionArea>
      <Modal
        open={openShareModal}
        onClose={() => setOpenShareModal(false)}
        closeAfterTransition
      >
        <Fade in={openShareModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: 340, sm: 450 },
              bgcolor: "background.paper",
              borderRadius: "16px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
              p: 0,
              outline: "none",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                pb: 2,
                borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <ShareIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "600",
                    color: "#1a202c",
                  }}
                >
                  Share Game
                </Typography>
              </Box>
              <IconButton
                onClick={() => setOpenShareModal(false)}
                sx={{
                  color: "#64748b",
                  "&:hover": { bgcolor: "#f1f5f9" },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ p: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#374151",
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Share "{gameName}" with your friends!
              </Typography>

              {/* Link Box */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  p: 2,
                  mb: 3,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    color: "#475569",
                    wordBreak: "break-all",
                    fontSize: "0.875rem",
                    fontFamily: "monospace",
                  }}
                >
                  {shareLink}
                </Typography>
                <Tooltip title={copied ? "Copied!" : "Copy link"}>
                  <IconButton
                    onClick={handleCopyClick}
                    sx={{
                      ml: 1,
                      color: copied ? "#10b981" : "#6b7280",
                      "&:hover": {
                        bgcolor: copied ? "#ecfdf5" : "#f3f4f6",
                      },
                    }}
                  >
                    {copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Status Message */}
              {copied && (
                <Fade in={copied}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      p: 2,
                      bgcolor: "#ecfdf5",
                      borderRadius: "8px",
                      border: "1px solid #d1fae5",
                    }}
                  >
                    <CheckCircleIcon sx={{ color: "#10b981", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{ color: "#065f46", fontWeight: "medium" }}
                    >
                      Link copied to clipboard!
                    </Typography>
                  </Box>
                </Fade>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Card>
  );
}

export default GamesCard;
