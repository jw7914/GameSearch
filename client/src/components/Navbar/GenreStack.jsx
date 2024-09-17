import * as React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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

  const fetchGenres = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/genres");
      const data = response.data;
      setGenres(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setError("Failed to load genres");
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      {loading && <p>Loading games...</p>}
      {error && <p>{error}</p>}
      <Stack spacing={2.5}>
        {genres.map((el) => (
          <Link
            to={`/genre?genre=${el.name}`}
            style={{ textDecoration: "none" }}
            key={el.id} // Move key prop here
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
