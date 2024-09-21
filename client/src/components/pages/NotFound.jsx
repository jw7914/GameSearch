import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ marginBottom: "2rem" }}>
          Oops! Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "2rem" }}>
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/"
          sx={{ textTransform: "none" }}
        >
          Go to Home
        </Button>
      </Box>
    </Container>
  );
}

export default NotFoundPage;
