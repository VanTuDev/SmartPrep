// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';

// Import các trang chung (Common pages)
import HomePage from "./pages/common/HomePage";
import LoginPage from "./pages/common/LoginPage";
import RegisterPage from "./pages/common/RegisterPage";

// Import các trang Learner
import LearnerDashboard from './pages/learner/LearnerDashboard';
import ViewExamResults from './pages/learner/ViewExamResults';
import LearnerExamHistory from './pages/learner/ExamHistory';
import ClassList from './pages/learner/ClassList';
import LearnerProfile from './components/learner/LearnerProfile';
import QuizCard from './pages/learner/TakeExam/QuizCard';
import Exam1 from './pages/learner/TakeExam/Exam';
import ClassDetailforLeaner from './pages/learner/ClassDetail';

// Import các trang Instructor
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import Exam from './pages/instructor/Exam/Exam';
import UpdateExamForm from './pages/instructor/Exam/ExamUpdate/UpdateExamForm';
import QuestionLibrary from './pages/instructor/QuestionLibrary';
import InstructorProfile from './components/instructor/InstructorProfile';
import ClassRoom from './pages/instructor/ClassRoom/ViewClassList';
import ClassDetail from 'pages/instructor/ClassRoom/ClassDetail';

// Import các trang Admin
import AdminLayout from 'layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import LearnerTable from 'pages/admin/UserManagement/LearnerTable';
import InstructorTable from 'pages/admin/UserManagement/InstructorTable';
import AdminTable from 'pages/admin/UserManagement/AdminTable';
import InstructorApplicationsTable from 'pages/admin/UserManagement/InstructorApplicationsTable ';
import ClassTable from 'pages/admin/ClassManagement/ClassTable';
import ExamTable from 'pages/admin/ExamManagement/ExamTable';

// Import các thành phần chung
import PrivateRoute from './components/PrivateRoute';
import InstructorRegistration from 'pages/instructor/InstructorRegistration/InstructorRegistration';
import ForgotPassword from 'pages/common/ForgotPassword';
import ResetPassword from 'pages/common/ResetPassword';
import ChoseRolePage from 'pages/common/ChoseRolePage';
import Room from "pages/videoChat/Room";
import OnlineLearningDashboard from "pages/instructor/OnlineLearning/OnlineLearningDashboard";
import Submission from "pages/instructor/Exam/Submission/Submission";
import SubmissionDetail from "pages/instructor/Exam/Submission/SubmissionDetail";

function App() {
  return (
    <Router>
      <div>
        <ToastContainer /> {/* Hiển thị thông báo */}

        <Routes>
          {/* ========== Common Pages ========== */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<ChoseRolePage />} />
          <Route path="/register_role" element={<RegisterPage />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/room' element={<Room/>} />
          <Route path="/room/:roomName" element={<Room />} /> {/* Thêm route động */}

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
          <Route
            path="/learner/dashboard/class/detail/:classId"
            element={
              <PrivateRoute role="learner">
                <ClassDetailforLeaner />
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
            path="/instructor/exam/exam-create"
            element={
              <PrivateRoute role="instructor">
                <Exam />
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
            path="/instructor/exam/:examId/update"
            element={
              <PrivateRoute role="instructor">
                <UpdateExamForm />
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
            path="/instructor/exam/submissions/:examId"
            element={
              <PrivateRoute role="instructor">
                <Submission />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/exam/submission-detail/:submissionId"
            element={
              <PrivateRoute role="instructor">
                <SubmissionDetail />
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
          <Route
            path="/instructor/dashboard/class/detail/:classId"
            element={
              <PrivateRoute role="instructor">
                <ClassDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="instructor/online-learning"
            element={
              <PrivateRoute role="instructor">
                <OnlineLearningDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/instructor/registration"
            element={
              <PrivateRoute role="instructor">
                <InstructorRegistration />
              </PrivateRoute>
            }
          />

          {/* ========== Admin Pages ========== */}
          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users/learner" element={<LearnerTable />} />
            <Route path="users/instructor" element={<InstructorTable />} />
            <Route path="users/admin" element={<AdminTable />} />
            <Route path="users/instructor-application" element={<InstructorApplicationsTable />} />
            <Route path="mainfeature/exam" element={<ExamTable />} />
            <Route path="mainfeature/class" element={<ClassTable />} />
          </Route>

          {/* ========== Catch-All Route (for 404 Pages) ========== */}
          {/* Uncomment and implement NotFound component if needed */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
