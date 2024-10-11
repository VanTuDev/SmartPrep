import React from 'react';
import InstructorHeader from '../../components/instructor/InstructorHeader';
import NavBar from '../../components/instructor/NavBar';
import ExamDashboard from './ExamDashboard';

const InstructorDashboard = () => {
  return (
    <div>
      {/* Header - Thanh điều hướng chính */}
      <InstructorHeader />
      {/* NavBar - Điều hướng phụ */}
      <NavBar />
      {/* Nội dung chính của trang - ExamDashboard */}
      <div className="flex justify-center mt-8">
        <div className="w-10/12">
          {/* Nội dung của ExamDashboard */}
          <ExamDashboard />
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
