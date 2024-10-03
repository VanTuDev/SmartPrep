import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import DraftExam from './DraftExam'; // Import component DraftExam

const ExamDashboard = () => {
   const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

   return (
      <div className="w-full flex justify-center items-start mt-0">
         <div className="w-10/12">
            {/* Thẻ div riêng cho nút "Tạo bài kiểm tra" */}
            <div className="flex justify-end mb-6">
               {/* Nút tạo bài kiểm tra với điều hướng */}
               <button
                  className="bg-violet-800 text-white px-4 py-1.5 rounded-md flex items-center space-x-2 hover:bg-violet-950 transition"
                  onClick={() => navigate('/instructor/exam/exam-create')} // Thêm onClick để điều hướng đến đường dẫn mới
               >
                  <span>Tạo bài kiểm tra</span>
                  <span className="ml-1">+</span>
               </button>
            </div>

            {/* Phần bài kiểm tra đang diễn ra */}
            <div>
               <div className="flex justify-between items-center">
                  <h1 className="text-xl font-semibold text-gray-700">Đang diễn ra</h1>
               </div>
               <div className="border-b border-gray-300 my-4"></div>
               <div className="flex flex-col justify-center items-center mt-12">
                  <img
                     src="/image/noExam.png"
                     alt="No Exams"
                     className="h-40 mb-6"
                  />
                  <p className="text-gray-300 text-lg">Hiện tại không có bài trắc nghiệm nào đang diễn ra</p>
               </div>
            </div>

            {/* Thêm component DraftExam vào */}
            <DraftExam />
         </div>
      </div>
   );
};

export default ExamDashboard;
