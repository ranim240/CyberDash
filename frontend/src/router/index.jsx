import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// ── Auth pages ────────────────────────────────────────────────────────────────
import Login          from "../pages/auth/login";
import Register       from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotPassword";
import ResetPassword  from "../pages/auth/resetPassword";

// ── Learner pages ─────────────────────────────────────────────────────────────
import Dashboard         from "../pages/learner/Dashboard.jsx";
import Profile           from "../pages/learner/Profile.jsx";
import BrowseChallenges  from "../pages/learner/BrowseChallenges.jsx";
import ChallengeDetailPage from "../pages/learner/ChallengeDetailPage.jsx";
import SessionPage       from "../pages/learner/SessionPage.jsx";
// import LeaderboardPage       from "../pages/learner/LeaderboardPage.jsx";

// ── Guard : redirige vers /login si non authentifié ───────────────────────────
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null; // ou un <Loader /> global

  if (!user) return <Navigate to="/login" replace />;

  // si un rôle est requis et que l'utilisateur ne l'a pas
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

// ── Router principal ──────────────────────────────────────────────────────────
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Racine ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Auth (public) ── */}
        <Route path="/login"                          element={<Login />} />
        <Route path="/register"                       element={<Register />} />
        <Route path="/forgot-password"                element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token"  element={<ResetPassword />} />

        {/* ── Learner (protégé) ── */}
        <Route
          path="/learner/dashboard"
          element={
            <PrivateRoute role="learner">
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/learner/profile"
          element={
            <PrivateRoute role="learner">
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/learner/browse"
          element={
            <PrivateRoute role="learner">
              <BrowseChallenges />
            </PrivateRoute>
          }
        />
        <Route
          path="/learner/challenges/:id"
          element={
            <PrivateRoute role="learner">
              <ChallengeDetailPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/learner/sessions/:sessionId"
          element={
            <PrivateRoute role="learner">
              <SessionPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/learner/courses/:courseId/progress"
          element={
            <PrivateRoute role="learner">
              {/* CourseProgressPage à créer si besoin */}
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;