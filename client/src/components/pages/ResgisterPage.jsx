import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardActions,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { firebaseapp } from "../../../firebase/firebaseConfig.jsx";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const auth = getAuth(firebaseapp);
  const navigate = useNavigate();

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    let formIsValid = true;

    // Reset error messages
    setErrorEmail("");
    setErrorPassword("");
    setErrorConfirmPassword("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorConfirmPassword("Passwords do not match.");
      formIsValid = false;
    }

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Please enter a valid email address.");
      formIsValid = false;
    } else {
      setErrorEmail("");
    }

    // Validate password
    if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters.");
      formIsValid = false;
    } else {
      setErrorPassword("");
    }

    if (!formIsValid) return;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signOut(auth);
      onAuthStateChanged(auth, (user) => {
        if (!user) {
          navigate("/login");
        }
      });
    } catch (err) {
      setErrorEmail(mapFirebaseErrorToMessage(err.code));
    }
  };

  // Map Firebase error codes to user-friendly messages
  const mapFirebaseErrorToMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "The email address is not valid.";
      case "auth/email-already-in-use":
        return "The email address is already in use by another account.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password.";
      case "auth/network-request-failed":
        return "Network error. Please check your connection and try again.";
      default:
        return "An unexpected error occurred. Please try again later.";
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
      <Card sx={{ width: "100%", padding: 4 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ marginBottom: "1.5rem", fontWeight: "bold" }}
        >
          Sign up with <EmailIcon fontSize="large" />
        </Typography>

        <Box
          component="form"
          onSubmit={handleRegister}
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
            error={!!errorEmail} // Error check for email field
            helperText={errorEmail}
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
            error={!!errorPassword} // Error check for password field
            helperText={errorPassword}
          />
          <TextField
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            required
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={!!errorConfirmPassword} // Error check for confirm password field
            helperText={
              errorConfirmPassword ||
              (password !== confirmPassword && "Passwords do not match")
            }
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
        </Box>

        <CardActions sx={{ justifyContent: "center", width: "100%" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Button size="small" onClick={() => navigate("/login")}>
              Login
            </Button>
          </Typography>
        </CardActions>
      </Card>
    </Container>
  );
};

export default RegisterPage;
