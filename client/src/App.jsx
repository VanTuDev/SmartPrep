import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import các trang
import HomePage from './pages/common/HomePage';
import LoginPage from './pages/common/LoginPage';
import RegisterPage from './pages/common/RegisterPage';

// Import dashboard của Learner, Instructor, Admin
import LearnerDashboard from './pages/learner/LearnerDashboard';
import InstructorDashboard from './pages/instructor/InstructorDashboard.jsx'; // Không cần đuôi .jsx
import AdminDashboard from './pages/admin/AdminDashboard';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Trang chung */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Trang dành riêng cho Learner */}
          <Route
            path="/learner/dashboard"
            element={
              <PrivateRoute>
                <LearnerDashboard />
              </PrivateRoute>
            }
          />

          {/* Trang dành riêng cho Instructor */}
          <Route
            path="/instructor/dashboard"
            element={
              <PrivateRoute>
                <InstructorDashboard />
              </PrivateRoute>
            }
          />

          {/* Trang dành riêng cho Admin */}
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
