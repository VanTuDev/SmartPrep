// CardExamInClass.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ClipboardList, BookOpen, Layers, List, Globe } from 'lucide-react';
import dayjs from 'dayjs';

const CardExamInClass = ({ exam = {}, grades = {}, subjects = {} }) => {
   const [examStatus, setExamStatus] = useState(exam.status);
   const [infoMessage, setInfoMessage] = useState(''); // State để hiển thị thông báo
   const navigate = useNavigate();

   useEffect(() => {
      const now = dayjs();
      const start = dayjs(exam.start_date);
      const end = dayjs(exam.end_date);

      if (now.isBefore(start)) {
         setExamStatus('published'); // Exam chưa bắt đầu
      } else if (now.isAfter(end)) {
         setExamStatus('end'); // Exam đã kết thúc
      } else {
         setExamStatus('ongoing'); // Exam đang diễn ra
      }
   }, [exam.start_date, exam.end_date, exam.status]);

   const handleExamClick = () => {
      const now = dayjs();
      const start = dayjs(exam.start_date);
      const end = dayjs(exam.end_date);

      if (now.isBefore(start)) {
         setInfoMessage("Bài kiểm tra chưa bắt đầu. Vui lòng quay lại sau."); // Thông báo chưa bắt đầu
      } else if (now.isAfter(end)) {
         setInfoMessage("Bài kiểm tra đã kết thúc. Bạn không thể tham gia vào thời điểm này."); // Thông báo đã kết thúc
      } else {
         navigate(`/learner/TakeExam/${exam._id}`);
      }
   };

   const statusColor = examStatus === 'published' ? 'text-green-600'
      : examStatus === 'end' ? 'text-gray-500'
         : 'text-blue-600';

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full shadow-lg hover:shadow-xl transition-shadow duration-300"
         onClick={handleExamClick}>
         <div className="font-semibold text-gray-800 mb-4 text-lg">
            {exam.title || 'Untitled Exam'}
         </div>

         {/* Hiển thị thông báo nếu có */}
         {infoMessage && (
            <div className="text-red-500 text-sm mb-4">
               {infoMessage}
            </div>
         )}

         <div className="text-sm text-gray-600 space-y-2">
            <div className="flex items-center">
               <ClipboardList className="mr-2 text-gray-500" />
               <span className="font-semibold">Mô tả:</span> {exam.description || "Không có mô tả"}
            </div>
            <div className="flex items-center">
               <Clock className="mr-2 text-gray-500" />
               Thời gian làm bài: {exam.duration || 0} phút
            </div>
            <div className="flex items-center">
               <List className="mr-2 text-gray-500" />
               Số câu hỏi: {exam.questions_id ? exam.questions_id.length : 0}
            </div>
            <div className="flex items-center">
               <Layers className="mr-2 text-gray-500" />
               Khối: {grades[exam.grade_id] || 'N/A'}
            </div>
            <div className="flex items-center">
               <BookOpen className="mr-2 text-gray-500" />
               Môn học: {subjects[exam.category_id] || 'N/A'}
            </div>
            <div className="flex items-center">
               <Calendar className="mr-2 text-gray-500" />
               Ngày bắt đầu: {dayjs(exam.start_date).format('DD/MM/YYYY HH:mm') || 'N/A'}
            </div>
            <div className="flex items-center">
               <Calendar className="mr-2 text-gray-500" />
               Ngày kết thúc: {dayjs(exam.end_date).format('DD/MM/YYYY HH:mm') || 'N/A'}
            </div>
         </div>

         <div className="mt-6 flex justify-between items-center">
            <span className={`text-sm font-semibold ${statusColor}`}>
               <Globe className="mr-2 text-gray-500" /> {examStatus}
            </span>
         </div>
      </div>
   );
};

export default CardExamInClass;
