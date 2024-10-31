import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChoseRolePage() {
  const navigate = useNavigate();

  const handleCardClick = (selectedRole) => {
    navigate(`/register_role`, { state: { role: selectedRole } });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Logo */}
      <div className="mb-6">
        <img src="/image/logo.svg" alt="Logo" className="h-20 w-20" />
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold mb-8">
        Bạn muốn đăng ký với chức năng nào trong trang web của chúng tôi?
      </h2>

      {/* Cards for Roles */}
      <div className="flex gap-6">
        {/* Student Card */}
        <div
          className="cursor-pointer p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition flex items-center"
          onClick={() => handleCardClick('learner')}
        >
          <img src="/image/noExam.png" alt="" className="w-20 mr-4" />
          <h3 className="text-lg font-bold">Học sinh</h3>
        </div>

        {/* Teacher Card */}
        <div
          className="cursor-pointer p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition flex items-center"
          onClick={() => handleCardClick('instructor')}
        >
          <img src="/image/public.avif" alt="" className="w-20 mr-4" />
          <h3 className="text-lg font-bold">Giáo viên</h3>
        </div>
      </div>
    </div>
  );
}

export default ChoseRolePage;
