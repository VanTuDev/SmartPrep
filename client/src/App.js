import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
// Import common pages
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';

// Import dashboards for Learner, Instructor, and Admin
import LearnerDashboard from './pages/learner/LearnerDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ViewExamResults from './pages/learner/ViewExamResults';

// Import PrivateRoute for protecting routes
import PrivateRoute from './components/PrivateRoute';
import Exam from './pages/instructor/Exam/Exam';
import LearnerProfile from './pages/learner/LearnerProfile';
import QuestionLibrary from './pages/instructor/QuestionLibrary';

function App() {
  return (
    <Router>
      <div>
        <ToastContainer /> {/* Thêm ToastContainer ở đây */}
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

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

          {/* Instructor Dashboard */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Instructor Exam Creation */}
          <Route
            path="/instructor/exam/exam-create"
            element={
              <Exam />
            }
          />

          <Route
            path="/instructor/questions/library"
            element={
              <QuestionLibrary />
            }
          />

          {/* Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
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
