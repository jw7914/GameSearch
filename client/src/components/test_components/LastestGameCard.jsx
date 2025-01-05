import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function LastestGameCard({
  gameName,
  cover,
}) {
  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: {
          xs: "column",
          sm: "row",
        },
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        overflow: "hidden",  
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          objectFit: "cover",
        }}
        image={cover}
        title={gameName}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            position: "absolute",
            top: 0,        
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)", 
            color: "white",
            padding: "16px",
            opacity: 0, 
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 1,
            },
          }}
        >
          <Typography variant="h5">{gameName}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
