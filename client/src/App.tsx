import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/landing";
import LobbyPage from "./pages/lobby";
import PlayingPage from "./pages/playing";
import WaitingPage from "./pages/waiting";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/waiting/:id" element={<WaitingPage />} />
        <Route path="/playing/:id" element={<PlayingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
