import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
// Import common pages
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';
// import NotFound from './pages/common/NotFound'; // Import trang NotFound cho các trang không tìm thấy

// Import dashboards for Learner, Instructor, and Admin
import LearnerDashboard from './pages/learner/LearnerDashboard';
import ViewExamResults from './pages/learner/ViewExamResults';
import LearnerExamHistory from './pages/learner/ExamHistory';
import ClassList from './pages/learner/ClassList';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Import PrivateRoute for protecting routes
import PrivateRoute from './components/PrivateRoute';
import LearnerProfile from './pages/learner/LearnerProfile';
import QuestionLibrary from './pages/instructor/QuestionLibrary';
import InstructorProfile from './components/instructor/InstructorProfile'; // Import InstructorProfile
import QuizCard from 'pages/learner/TakeExam/QuizCard';
import Exam1 from 'pages/learner/TakeExam/Exam';
import Exam from "./pages/instructor/Exam/Exam";
import ExamHistory from './pages/learner/ExamHistory';
import ClassRoom from "./pages/instructor/ClassRoom/ViewClassList";
import ChooseRole from './pages/common/ChooseRole'; // Đường dẫn đến file ChooseRole.js

function App() {
  return (
    <Router>
      <div>
        <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/choose-role" element={<ChooseRole />} />
          {/* Learner Dashboard */}
          <Route
            path="/learner/dashboard" element={
              <PrivateRoute>
                <LearnerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/profile" element={
              <PrivateRoute>
                <LearnerProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/ViewExamResults" element={
              <PrivateRoute>
                <ViewExamResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/TakeExam/:examId"
            element={
              <PrivateRoute>
                <QuizCard />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/TakeExam/:examId/:submissionId"
            element={
              <PrivateRoute>
                <Exam1 />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/ViewExamResults/:submissionId"
            element={
              <PrivateRoute>
                <ViewExamResults />
              </PrivateRoute>
            }
          />

          <Route
            path="/instructor/exam/:examId"
            element={
              <PrivateRoute>
                <Exam />
              </PrivateRoute>
            }
          />
          <Route
            path="/learner/exam/history"
            element={
              <PrivateRoute role="learner">
                <ExamHistory />
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
          {/* Instructor Dashboard */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute role="instructor">
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Instructor Dashboard */}
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
            path="/instructor/dashboard/class"
            element={
              <PrivateRoute role="instructor">
                <ClassRoom />
              </PrivateRoute>
            }
          />

          {/* Profile for Instructor */}
          <Route
            path="/instructor/profile"
            element={
              <PrivateRoute role="instructor">
                <InstructorProfile />
              </PrivateRoute>
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
