import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Result from "./components/pages/Result";
import TBS from "./components/pages/TBS";
import SearchResults from "./components/pages/SearchResults"; // Import the SearchResults component

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/genre-Turn-based strategy (TBS)" element={<TBS />} />

        {/* Route for displaying search results */}
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
