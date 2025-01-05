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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const auth = getAuth(firebaseapp);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  // Handle authentication (email and password or Google/GitHub login)
  const handleAuth = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark as submitted

    if (!email || !password) {
      return;
    }

    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setModalMessage(mapFirebaseErrorToMessage(err.code));
      setOpenErrorModal(true); // Show the error modal
    }
  };

  // Handle social logins (Google, GitHub)
  const handleLogin = async (providerType) => {
    try {
      if (providerType === "google") {
        await signInWithPopup(auth, googleProvider);
      } else if (providerType === "github") {
        await signInWithPopup(auth, githubProvider);
      }
    } catch (err) {
      setModalMessage(mapFirebaseErrorToMessage(err.code));
      setOpenErrorModal(true);
    }
  };

  const handleModalClose = () => {
    setOpenErrorModal(false);
  };

  // Map Firebase error codes to user-friendly messages
  const mapFirebaseErrorToMessage = (errorCode) => {
    console.log(errorCode);
    switch (errorCode) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-credential":
        return "Invalid login credential.";
      default:
        return "An error occurred, please try again.";
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
              onChange={(e) => {
                setEmail(e.target.value);
                if (submitted) setSubmitted(false); // Reset the submitted state when the user types
              }}
              error={submitted && !email} // Set error if submitted and no email
              helperText={submitted && !email ? "Email is required" : ""}
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (submitted) setSubmitted(false); // Reset the submitted state when the user types
              }}
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
              error={submitted && !password} // Set error if submitted and no password
              helperText={submitted && !password ? "Password is required" : ""}
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

      {/* Error Modal */}
      <Dialog open={openErrorModal} onClose={handleModalClose}>
        <DialogTitle color="red">Error</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LoginPage;
