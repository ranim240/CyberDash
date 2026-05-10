import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import InstructorDashboard from "../pages/instructor/Dashboard";
import { SidebarProvider } from "../context/SidebarContext";
import Dashboard from "../pages/learner/Dashboard.jsx";
import SessionPage from "../pages/learner/SessionPage.jsx";
import CreateChallengePage from "../pages/instructor/CreateChallengePage.jsx";
import Login from "../pages/auth/login";
import Register from "../pages/auth/register";
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

const AppRouter = () => {
  return (
    <BrowserRouter>
    <SidebarProvider>
      <Routes>
        {/* ── Racine ── */}
        <Route path="/" element={<Home />} />
        {/* ── Learner (protégé) ── */}
        <Route
          path="/learner/dashboard"
          element={
            //<PrivateRoute role="learner">
              <Dashboard />
           // </PrivateRoute>
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
            //<PrivateRoute role="learner">
              <BrowseChallenges />
            //</PrivateRoute>
          }
        />
        <Route
          path="/learner/challenges/:id"
          element={
            //<PrivateRoute role="learner">
              <ChallengeDetailPage />
            //</PrivateRoute>
          }
        />
        <Route
          path="/learner/sessions/:sessionId"
          element={
            //<PrivateRoute role="learner">
              <SessionPage />
            //</PrivateRoute>
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
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        {/* Public Routes */}
        <Route path="/courses" element={<CoursesListingPage />} />
        <Route path="/learner/courses/:courseId" element={<CourseLearnerPage />} />
        {/* Learner Routes */}
        {/* <Route path="/learner/dashboard" element={<LearnerDashboard />} /> */}
        <Route path="/learner/dashboard" element={<Navigate to="/challenges" replace />} />
        <Route path="/challenges" element={<BrowseChallenges />} />
        <Route path="/challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="/learner/leaderboard" 
          element={
          //<PrivateRoute role="learner">
          <LeaderboardPage />
          //</PrivateRoute>
          } />
          <Route path="/learner/report-incident" element={
            //<PrivateRoute role="learner">
              <ReportIncidentPage />
            //</PrivateRoute>
          }/>
        {/* Instructor Routes */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<MyCoursesPage />} />
        <Route path="/instructor/courses/create" element={<CreateCoursePage />} />
        <Route path="/instructor/courses/:id" element={<CourseContentPage />} />
        <Route path="/instructor/challenges"         element={<MyChallengesPage />} />
        <Route path="/instructor/challenges/:id"     element={<ChallengeContentPage />} />
        <Route path="/instructor/challenges/create"     element={<CreateChallengePage />} />
                
      </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default AppRouter;