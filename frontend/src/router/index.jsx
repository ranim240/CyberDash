import { BrowserRouter, Routes, Route } from "react-router-dom";
import InstructorDashboard from "../pages/instructor/Dashboard";
import LearnerDashboard from "../pages/learner/Dashboard";
import MyCoursesPage from "../pages/instructor/MyCoursesPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/learner/dashboard" element={<LearnerDashboard />} />
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
        <Route path="/instructor/courses" element={<MyCoursesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;