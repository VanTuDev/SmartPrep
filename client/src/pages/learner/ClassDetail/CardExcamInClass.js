// CardExamInClass.js
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ClipboardList, BookOpen, Layers, Link, List, Globe } from 'lucide-react';
import dayjs from 'dayjs';

const CardExamInClass = ({ exam = {}, grades = {}, subjects = {} }) => {
   const [examStatus, setExamStatus] = useState(exam.status);

   // Set the status based on the current date relative to start and end dates
   useEffect(() => {
      const now = dayjs();
      const start = dayjs(exam.start_date);
      const end = dayjs(exam.end_date);

      if (now.isBefore(start)) {
         setExamStatus(exam.status); // 'published' or 'draft'
      } else if (now.isAfter(end)) {
         setExamStatus('end');
      } else {
         setExamStatus('ongoing');
      }
   }, [exam.start_date, exam.end_date, exam.status]);

   // Determine the color based on the exam status
   const statusColor =
      examStatus === 'published'
         ? 'text-green-600'
         : examStatus === 'draft'
            ? 'text-yellow-600'
            : examStatus === 'ongoing'
               ? 'text-blue-600'
               : 'text-gray-500';

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full shadow-lg hover:shadow-xl transition-shadow duration-300">
         <div className="font-semibold text-gray-800 mb-4 text-lg">
            {exam.title || 'Untitled Exam'}
         </div>
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
               Ngày bắt đầu: {exam.start_date ? dayjs(exam.start_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
            </div>
            <div className="flex items-center">
               <Calendar className="mr-2 text-gray-500" />
               Ngày kết thúc: {exam.end_date ? dayjs(exam.end_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
            </div>
            <div className="flex items-center">
               <Link className="mr-2 text-gray-500" />
               <a href={exam.access_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Link kiểm tra
               </a>
            </div>
         </div>

         <div className="mt-6 flex justify-between items-center">
            <span className={`text-sm font-semibold ${statusColor}`}>
               <div className="flex items-center">
                  <Globe className="mr-2 text-gray-500" />
                  {examStatus}
               </div>
            </span>
         </div>
      </div>
   );
};

export default CardExamInClass;