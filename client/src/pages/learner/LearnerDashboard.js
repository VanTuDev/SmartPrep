import React from 'react';
import HeaderComponent from '../../components/learner/LearnerHeader';
import CardComponent from '../../components/learner/Card.js';
import { Video, FileQuestion } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className=" bg-gray-50">
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
          <CardComponent
            icon={<FileQuestion className="h-12 w-12 text-red-500" />}
            title="Bài kiểm tra"
            description="Hiện tại không có bài trắc nghiệm nào trong lịch sử gần đây"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
