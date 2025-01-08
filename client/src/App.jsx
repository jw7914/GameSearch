import { BrowserRouter, Route, Routes } from "react-router-dom";
import Redirect from "./components/utility/Redirect";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home";
import NotFoundPage from "./components/pages/NotFound";
import SearchResults from "./components/pages/SearchResults";
import GameProfile from "./components/pages/GameProfile";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/ResgisterPage";
import UserProfilePage from "./components/pages/UserProfile";
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

      {/* Protected Routes (Logged in users can't access these routes) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes (Not logged in users can't access these routes) */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
