import { BrowserRouter, Route, Routes } from "react-router-dom";
import Redirect from "./components/utility/Redirect";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home";
import NotFoundPage from "./components/pages/NotFound";
import SearchResults from "./components/pages/SearchResults";
import GameProfile from "./components/pages/GameProfile";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/ResgisterPage";
import ProtectedRoute from "./components/utility/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/search"
        element={<Redirect element={<SearchResults type="query" />} />}
      />
      <Route
        path="/genre"
        element={<Redirect element={<SearchResults type="genre" />} />}
      />
      <Route path="/gameprofile/:id" element={<GameProfile />}></Route>
      <Route
        path="/login"
        element={
          <ProtectedRoute>
            <LoginPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/register"
        element={
          <ProtectedRoute>
            <RegisterPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
