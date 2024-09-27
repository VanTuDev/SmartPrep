import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import common pages
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';

// Import dashboards for Learner, Instructor, and Admin
import LearnerDashboard from './pages/learner/LearnerDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Import PrivateRoute for protecting routes
import PrivateRoute from './components/PrivateRoute';
import ExamCreate from './pages/instructor/Exam/ExamCreate';

function App() {
  return (
    <Router>
      <div>
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

          {/* Instructor Dashboard */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Instructor Dashboard */}
          <Route
            path="/instructor/exam/exam-create"
            element={
              // <PrivateRoute>
                <ExamCreate />
              // {/* </PrivateRoute> */}
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
