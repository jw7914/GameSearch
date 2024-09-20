import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchGenres } from "../../../api/api";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#60737F",
  ...theme.typography.body2,
  padding: theme.spacing(1.05),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function GenreStack() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGenres(setLoading, setGenres, setError);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {/* Loading Spinner */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Box display="flex" justifyContent="center" alignItems="center" my={2}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#f44336", color: "#fff" }}
          >
            {error}
          </Paper>
        </Box>
      )}

      <Stack spacing={2.5}>
        {genres.map((el) => (
          <Link
            to={`/genre?genre=${encodeURIComponent(el.name)}`}
            style={{ textDecoration: "none" }}
            key={el.id}
            aria-label={`View games in ${el.name} genre`}
          >
            <Item
              sx={{
                color: "#E8E8E8",
                fontSize: "20px",
                ":hover": { bgcolor: "#A0ABB2" },
              }}
            >
              <b>{el.name}</b>
            </Item>
          </Link>
        ))}
      </Stack>
    </Box>
  );
}

export default GenreStack;
