import React from 'react';
import { Calendar, Clock, FileText, Users } from 'lucide-react';

const Examcard = ({ title, startTime, endTime, duration, questionCount, organization }) => {
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
         <div className="flex items-center text-gray-600 mb-4">
            <Users className="w-5 h-5 mr-2" />
            <span>{organization}</span>
         </div>

         {/* Nút Xem kết quả */}
         <button className="px-4 py-2 bg-white border border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-500 hover:text-white transition">
            Xem kết quả
         </button>
      </div>
   );
};

export default Examcard;