import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Rating } from "@mui/material";

export default function MUIcard({
  gameName,
  cover,
  rating,
  releaseDate,
  summary,
}) {
  return (
    <Card
      sx={{
        maxWidth: 345,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        paddingBottom: "2rem",
      }}
    >
      <CardMedia
        sx={{
          objectFit: "cover",
          height: 200,
          backgroundPosition: "center",
        }}
        elevation={24}
        image={cover}
        title={gameName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {gameName}
        </Typography>

        <Rating name="read-only" value={rating} readOnly precision={0.1} />

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
        <Button size="small" variant="contained">
          Share
        </Button>
        <Button size="small" variant="contained">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
}
