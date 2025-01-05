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
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false); // Track if redirect is happening
  const auth = getAuth(firebaseapp);
  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();
  const navigate = useNavigate();

  // Handle authentication (email and password or Google/GitHub login)
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setModalMessage("Login successful!");
      setOpenSuccessModal(true);
      setIsRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setModalMessage(mapFirebaseErrorToMessage(err.code));
      setOpenErrorModal(true);
    }
  };

  // Handle social logins (Google, GitHub)
  const handleLogin = async (providerType) => {
    try {
      if (providerType === "google") {
        await signInWithPopup(auth, googleProvider);
        setModalMessage("Google login successful!");
        setOpenSuccessModal(true);
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else if (providerType === "github") {
        await signInWithPopup(auth, githubProvider);
        setModalMessage("GitHub login successful!");
        setOpenSuccessModal(true);
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      setModalMessage(mapFirebaseErrorToMessage(err.code));
      setOpenErrorModal(true);
    }
  };

  const handleModalClose = () => {
    // Close modal and ensure redirect only happens once
    if (!isRedirecting) {
      setOpenErrorModal(false);
      setOpenSuccessModal(false);
    } else {
      setOpenSuccessModal(false); // Close success modal only
      if (isRedirecting) {
        navigate("/"); // Redirect after modal close
      }
    }
  };

  // Map Firebase error codes to user-friendly messages
  const mapFirebaseErrorToMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/user-disabled":
        return "This user account has been disabled.";
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      default:
        return "An error occurred, please try again.";
    }
  };

  // Success Modal
  const SuccessModal = () => (
    <Dialog open={openSuccessModal} onClose={handleModalClose}>
      <DialogTitle>Success</DialogTitle>
      <DialogContent>
        <Typography>{modalMessage}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModalClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );

  // Error Modal
  const ErrorModal = () => (
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
  );

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
      <Card sx={{ width: "100%", padding: 2 }} elevation={12} >
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

      {/* Modals */}
      <SuccessModal />
      <ErrorModal />
    </Container>
  );
};

export default LoginPage;
