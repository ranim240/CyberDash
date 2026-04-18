import { BrowserRouter, Routes, Route } from "react-router-dom";
import LearnerDashboard from "../pages/learner/Dashboard";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;