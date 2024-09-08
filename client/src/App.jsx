import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/pages/Home'
import Result from './components/pages/Result'
import TBS from './components/pages/TBS'

function App() {
  return (
    <BrowserRouter>
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<Result />} />
        <Route path="/genre-Turn-based strategy (TBS)" element={<TBS></TBS>} /> {/* For links that have spaces dont need %20 characters in the route can just put the direct versions with spaces */}
      </Routes>
    </BrowserRouter>     

  )
}

export default App
