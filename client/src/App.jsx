import { BrowserRouter, Route, Routes } from "react-router-dom";
import Redirect from "./components/pages/Redirect";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/pages/Home";
import Result from "./components/pages/Result";
import SearchResults from "./components/pages/SearchResults";
import GenreResults from "./components/pages/GenreResults";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route
          path="/search"
          element={<Redirect element={<SearchResults />} />}
        />
        <Route
          path="/genre"
          element={<Redirect element={<GenreResults />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
