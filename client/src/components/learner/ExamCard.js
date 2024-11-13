import React from 'react';
import { Calendar, Clock, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExamCard = ({ id, title, startTime, endTime, duration, questionCount, score, organization }) => {
   const navigate = useNavigate();

   // Hàm xử lý điều hướng tới trang kết quả khi nhấn nút
   const handleViewResult = () => {
      if (id) {
         navigate(`/learner/ViewExamResults/${id}`); // Chuyển hướng đến trang kết quả với id submission
      } else {
         console.error("Submission ID is undefined!");
      }
   };

   return (
      <div className="flex flex-col w-72 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
         {/* Tiêu đề bài kiểm tra */}
         <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>

         {/* Thông tin bài kiểm tra */}
         <div className="flex items-center text-gray-600 mb-2">
            <Clock className="w-5 h-5 mr-2" />
            <span>{startTime}</span>
         </div>
         <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="w-5 h-5 mr-2" />
            <span>{endTime}</span>
         </div>
         <div className="flex items-center text-gray-600 mb-2">
            <FileText className="w-5 h-5 mr-2" />
            <span>Thời gian làm bài: {duration}</span>
         </div>
         <div className="flex items-center text-gray-600 mb-2">
            <FileText className="w-5 h-5 mr-2" />
            <span>Số câu hỏi: {questionCount} câu</span>
         </div>

         {/* Nút Xem kết quả */}
         <button
            onClick={handleViewResult} // Thêm sự kiện `onClick` để điều hướng
            className="px-4 py-2 bg-white border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition"
         >
            Xem kết quả
         </button>
      </div>
   );
};

export default ExamCard;
