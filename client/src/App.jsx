import { BrowserRouter, Route, Routes } from "react-router-dom";
import Redirect from "./components/pages/Redirect";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home";
import NotFoundPage from "./components/pages/NotFound";
import SearchResults from "./components/pages/SearchResults";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/search"
          element={<Redirect element={<SearchResults type="search" />} />}
        />
        <Route
          path="/genre"
          element={<Redirect element={<SearchResults type="genre" />} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
