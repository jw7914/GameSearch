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

function GamesCard({ gameName, cover, rating, releaseDate, summary, cardID }) {
  const navigate = useNavigate();
  const convertedRating = rating / 10 / 2;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    <Card
      sx={{
        maxWidth: 300,
        borderRadius: "16px",
        overflow: "visible",
        position: "relative",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <CardMedia
          component="img"
          height="200"
          image={cover}
          alt={gameName}
          sx={{
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />

        {/* Comprehensive Info Overlay - appears on hover */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.95) 100%)",
            opacity: isHovered ? 1 : 0,
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "16px",
            color: "white",
          }}
        >
          {/* Top Section - Game Title */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                lineHeight: 1.2,
              }}
            >
              {gameName}
            </Typography>
          </Box>

          {/* Bottom Section - All Details */}
          <Box>
            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
              <Typography
                variant="body2"
                sx={{ mr: 1, fontWeight: "600", minWidth: "50px" }}
              >
                Rating:
              </Typography>
              {convertedRating > 0 ? (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    name="read-only"
                    value={convertedRating}
                    readOnly
                    precision={0.1}
                    max={5}
                    size="small"
                    sx={{
                      mr: 1,
                      "& .MuiRating-iconEmpty": {
                        color: "rgba(255,255,255,0.3)",
                      },
                      "& .MuiRating-iconFilled": { color: "#ffd700" },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontSize: "0.85rem", opacity: 0.9 }}
                  >
                    ({convertedRating.toFixed(1)}/5)
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                  N/A
                </Typography>
              )}
            </Box>

            {/* Release Date */}
            <Typography variant="body2" sx={{ mb: 1.5, fontWeight: "500" }}>
              <Box
                component="span"
                sx={{
                  fontWeight: "600",
                  minWidth: "70px",
                  display: "inline-block",
                }}
              >
                Released:
              </Box>
              {releaseDate || "Unknown"}
            </Typography>

            {/* Summary */}
            <Box>
              <Typography variant="body2" sx={{ fontWeight: "600", mb: 0.5 }}>
                Summary:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "0.8rem",
                  lineHeight: 1.3,
                  maxHeight: "60px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                }}
              >
                {summary && summary.length > 0
                  ? summary.length > 150
                    ? `${summary.substring(0, 150)}...`
                    : summary
                  : "No summary available"}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Extended Detail Panel - slides down from bottom */}
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.97)",
            backdropFilter: "blur(12px)",
            padding: "20px",
            borderRadius: "0 0 16px 16px",
            transform: isHovered ? "translateY(0)" : "translateY(20px)",
            opacity: isHovered ? 1 : 0,
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            zIndex: 10,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
            maxHeight: "200px",
            overflow: "auto",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              mb: 2,
              fontSize: "0.9rem",
            }}
          >
            📖 Full Summary
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: "0.85rem",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
            }}
          >
            {summary && summary.length > 0
              ? summary.length > 500
                ? `${summary.substring(0, 500)}...`
                : summary
              : "No detailed summary available for this game. Click to view more information on the game's profile page."}
          </Typography>

          {/* Additional metadata could go here */}
          <Box
            sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}
            >
              Click anywhere to view full game details
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Card Content */}
      <CardContent sx={{ pb: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: "600",
            color: "#1a1a1a",
          }}
        >
          {gameName}
        </Typography>
      </CardContent>

      {/* Card Actions */}
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
              bgcolor: "#2563eb",
              color: "white",
              textTransform: "none",
              fontWeight: "500",
              borderRadius: "8px",
              px: 2,
              "&:hover": {
                bgcolor: "#1d4ed8",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
              },
              transition: "all 0.2s ease",
            }}
          >
            Share
          </Button>
        </Tooltip>
        <FavoriteButton gameID={cardID} gameName={gameName} cover={cover} />
      </CardActions>
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
