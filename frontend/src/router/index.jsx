import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LearnerDashboard from "../pages/learner/Dashboard";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword from "../pages/auth/resetPassword";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;