import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Tab,
  Tabs,
  CircularProgress,
} from "@mui/material";
import { getFirebaseUser } from "../../../firebase/firebaseUtility";

function UserProfilePage() {
  const [value, setValue] = useState("1"); // State to track the active tab
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user } = getFirebaseUser();

  useEffect(() => {
    if (isLoggedIn && user) {
      setUserDetails(user);
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#132151",
          color: "white",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Container disableGutters maxWidth="100%">
      <Box
        sx={{
          backgroundColor: "#132151",
          width: "100%",
          color: "white",
          paddingBottom: 10,
          paddingTop: 10,
          paddingLeft: 5,
          paddingRight: 5,
          alignItems: "center",
          textAlign: "center", // Center the text
        }}
      >
        <Typography variant="h4" gutterBottom>
          {userDetails
            ? `Welcome ${
                userDetails.displayName || userDetails.email || "Guest"
              } to your Game List`
            : "Welcome to your Game List"}
        </Typography>
        <Typography>
          Here you can see all the games you have bookmarked or favorited in the
          past.
        </Typography>
      </Box>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{ marginLeft: 1, borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="All" value="1" />
          <Tab label="Recently Released" value="2" />
          <Tab label="Upcoming" value="3" />
        </Tabs>
        {value === "1" && <Box sx={{ padding: 2 }}>All Games</Box>}
        {value === "2" && (
          <Box sx={{ padding: 2 }}>Recently Released Games</Box>
        )}
        {value === "3" && <Box sx={{ padding: 2 }}>Upcoming Games</Box>}
      </Box>
    </Container>
  );
}

export default UserProfilePage;
