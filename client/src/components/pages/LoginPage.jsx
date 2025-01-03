import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardActions,
  Divider,
  Container,
  Grid,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "firebase/auth";
import { firebaseapp } from "../../../firebase/firebaseConfig.jsx";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GitHubIcon from "@mui/icons-material/GitHub";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth(firebaseapp);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  // Handle authentication (email and password or Google/GitHub login)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(mapFirebaseErrorToMessage(err.code));
    }
  };

  // Handle social logins (Google, GitHub)
  const handleLogin = async (providerType) => {
    try {
      if (providerType === "google") {
        await signInWithPopup(auth, googleProvider);
        alert("Google login successful!");
        navigate("/");
      } else if (providerType === "github") {
        await signInWithPopup(auth, githubProvider);
        alert("GitHub login successful!");
        navigate("/");
      }
    } catch (err) {
      setError(mapFirebaseErrorToMessage(err.code));
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ width: "100%", padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Login with Google and GitHub */}
          <CardActions sx={{ flexDirection: "column", width: "100%", gap: 2 }}>
            <Grid container spacing={2} direction="column" alignItems="stretch">
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => handleLogin("google")}
                  fullWidth
                  startIcon={<GoogleIcon />}
                >
                  Continue with Google
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  onClick={() => handleLogin("github")}
                  fullWidth
                  startIcon={<GitHubIcon />}
                >
                  Continue with GitHub
                </Button>
              </Grid>
            </Grid>
          </CardActions>

          <Divider sx={{ my: 2, width: "100%" }}>or</Divider>

          <Box
            component="form"
            onSubmit={handleAuth}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
            }}
          >
            <TextField
              label="Email Address"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Login
            </Button>
          </Box>

          <CardActions sx={{ justifyContent: "center", width: "100%" }}>
            <Typography variant="body2">
              Don’t have an account?
              <Button size="small" onClick={() => navigate("/register")}>
                Register
              </Button>
            </Typography>
          </CardActions>
        </Box>
      </Card>
    </Container>
  );
};

export default LoginPage;
