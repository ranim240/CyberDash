import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import LearnerDashboard from "../pages/learner/Dashboard.jsx";
import Home from "../pages/Home";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword from "../pages/auth/resetPassword";
import BrowseChallenges from "../pages/learner/BrowseChallenges";
import ChallengeDetailPage from "../pages/learner/ChallengeDetailPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        
        {/* Learner Routes */}
        {/* <Route path="/learner/dashboard" element={<LearnerDashboard />} /> */}
        <Route path="/challenges" element={<BrowseChallenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;