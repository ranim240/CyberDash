import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

// ── Auth pages ────────────────────────────────────────────────────────────────
import Login          from "../pages/auth/login";
import Register       from "../pages/auth/register";
import ForgotPassword from "../pages/auth/forgotPassword";

import ResetPassword from "../pages/auth/resetPassword";
import BrowseChallenges from "../pages/learner/BrowseChallenges";
import ChallengeDetailPage from "../pages/learner/ChallengeDetailPage";
import MyCoursesPage from "../pages/instructor/MyCoursesPage";
import CourseContentPage from "../pages/instructor/CourseContentPage";
import CreateCoursePage from "../pages/instructor/CreateCoursePage";
import MyChallengesPage from "../pages/instructor/MyChallengesPage";
import ChallengeContentPage from "../pages/instructor/ChallengeContentPage";
import CoursesListingPage from "../pages/courses/coursesListingPage";
import CourseLearnerPage from "../pages/courses/courseLearnerPage";
import CoursesPage from "../pages/learner/CoursesPage.jsx";
import CourseProgressPage from "../pages/learner/CourseProgressPage.jsx";
import LeaderboardPage       from "../pages/learner/LeaderboardPage.jsx";
import ReportIncidentPage    from "../pages/learner/ReportIncidentPage.jsx";
import Home from "../pages/Home.jsx";

// ── Learner pages ─────────────────────────────────────────────────────────────
import Dashboard         from "../pages/learner/Dashboard.jsx";
// import Profile           from "../pages/learner/Profile.jsx";
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
        <Route path="/" element={<Home />} />


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
        {/* <Route
          path="/learner/profile"
          element={
            <PrivateRoute role="learner">
              <Profile />
            </PrivateRoute>
          }
        /> */}
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
          path="/learner/courses"
          element={
            //<PrivateRoute role="learner">
              <CoursesPage />
            //</PrivateRoute>
          }
        />
        <Route
          path="/learner/courses/:courseId/progress"
          element={

            //<PrivateRoute role="learner">
              <CourseProgressPage />
            //</PrivateRoute>
          }
        />

        {/* ── 404 fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;