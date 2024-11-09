import React, { useState } from 'react';
import HeaderComponent from '../../components/learner/LearnerHeader';
import CardComponent from '../../components/learner/Card.js';
import ViewExamResults from '../../pages/learner/ViewExamLeaner';
import { Video, FileQuestion } from 'lucide-react';
import ViewExamLeaner from '../../pages/learner/ViewExamLeaner';

const Dashboard = () => {
  const [examCount, setExamCount] = useState(0); // State để lưu số lượng bài kiểm tra

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <HeaderComponent />

      {/* Main Content */}
      <div className="px-8 py-12">
        {/* Lịch học */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-700">Lịch học</h2>
          <CardComponent
            icon={<Video className="h-12 w-12 text-indigo-500" />}
            title="Lịch học"
            description="Hiện tại không có lớp học"
          />
        </div>

        {/* Bài kiểm tra */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-700">Bài kiểm tra</h2>
          {/* Điều kiện kiểm tra và hiển thị component */}

          <ViewExamLeaner onFetchExamCount={(count) => setExamCount(count)} />

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
