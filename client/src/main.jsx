import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#020617', // Slate 950 (Very dark blue/black)
      paper: '#0f172a',   // Slate 900
    },
    primary: {
      main: '#3b82f6',    // Blue 500
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
