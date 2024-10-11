import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import các trang chung (Common pages)
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';

// Import các trang Learner
import LearnerDashboard from './pages/learner/LearnerDashboard';
import ViewExamResults from './pages/learner/ViewExamResults';
import LearnerExamHistory from './pages/learner/ExamHistory';
import ClassList from './pages/learner/ClassList';
import LearnerProfile from './pages/learner/LearnerProfile';
import QuizCard from './pages/learner/TakeExam/QuizCard';
import Exam1 from './pages/learner/TakeExam/Exam';

// Import các trang Instructor
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import Exam from './pages/instructor/Exam/Exam';
import QuestionLibrary from './pages/instructor/QuestionLibrary';
import InstructorProfile from './components/instructor/InstructorProfile';
import ClassRoom from './pages/instructor/ClassRoom/ViewClassList';

// Import các trang Admin
import AdminDashboard from './pages/admin/AdminDashboard';

// Import các thành phần chung
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
        <Routes>
          {/* ========== Common Pages ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ========== Learner Pages ========== */}
          <Route
            path="/learner/dashboard"
            element={
              <PrivateRoute role="learner">
                <LearnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/profile"
            element={
              <PrivateRoute role="learner">
                <LearnerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/exam/history"
            element={
              <PrivateRoute role="learner">
                <LearnerExamHistory />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/dashboard/class"
            element={
              <PrivateRoute role="learner">
                <ClassList />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/TakeExam/:examId"
            element={
              <PrivateRoute role="learner">
                <QuizCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/TakeExam/:examId/:submissionId"
            element={
              <PrivateRoute role="learner">
                <Exam1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/ViewExamResults/:submissionId"
            element={
              <PrivateRoute role="learner">
                <ViewExamResults />
              </PrivateRoute>
            }
          />

          {/* ========== Instructor Pages ========== */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute role="instructor">
                <InstructorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/exam/:examId"
            element={
              <PrivateRoute role="instructor">
                <Exam />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/exam/exam-create"
            element={
              <PrivateRoute role="instructor">
                <Exam />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/questions/library"
            element={
              <PrivateRoute role="instructor">
                <QuestionLibrary />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/profile"
            element={
              <PrivateRoute role="instructor">
                <InstructorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/dashboard/class"
            element={
              <PrivateRoute role="instructor">
                <ClassRoom />
              </PrivateRoute>
            }
          />

          {/* ========== Admin Pages ========== */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          {/* ========== Catch-All Route (for 404 Pages) ========== */}
          {/* Uncomment and implement NotFound component if needed */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
