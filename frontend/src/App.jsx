import { BrowserRouter, Routes, Route } from "react-router-dom";
import BrowseChallenges from "./pages/learner/BrowseChallenges";
import ChallengeDetailPage from "./pages/learner/ChallengeDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/challenges" element={<BrowseChallenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;