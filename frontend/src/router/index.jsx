import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import InstructorDashboard from "../pages/instructor/Dashboard";
// import LearnerDashboard from "../pages/learner/Dashboard.jsx";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword from "../pages/auth/resetPassword";
import BrowseChallenges from "../pages/learner/BrowseChallenges";
import ChallengeDetailPage from "../pages/learner/ChallengeDetailPage";
import MyCoursesPage from "../pages/instructor/MyCoursesPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        
        {/* Learner Routes */}
        {/* <Route path="/learner/dashboard" element={<LearnerDashboard />} /> */}
        <Route path="/learner/dashboard" element={<Navigate to="/challenges" replace />} />
        <Route path="/challenges" element={<BrowseChallenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<MyCoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;