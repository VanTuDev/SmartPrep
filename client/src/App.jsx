import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/common/HomePage.jsx';
import LoginPage from './pages/common/LoginPage.jsx';
import RegisterPage from './pages/common/RegisterPage.jsx';

import LearnerDashboard from './pages/learner/LearnerDashboard.jsx';
import InstructorDashboard from './pages/Instructor/InstructorDashboard.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';

// Import PrivateRoute
import PrivateRoute from './components/PrivateRoute.js';

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
