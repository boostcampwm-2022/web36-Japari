import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import LandingPage from "./pages/landing";
import LobbyPage from "./pages/lobby";
import PlayingPage from "./pages/playing";
import WaitingPage from "./pages/waiting";

function App() {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/waiting/:id" element={<WaitingPage />} />
          <Route path="/playing/:id" element={<PlayingPage />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
