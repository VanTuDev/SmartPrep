import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { FileQuestion } from 'lucide-react';

// Component `ViewExamResults` hiển thị các bài kiểm tra đã được công khai (published)
const ViewExamLeaner = ({ onFetchExamCount }) => {
   const [publishedExams, setPublishedExams] = useState([]);
   const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

   // Fetch data từ API
   useEffect(() => {
      const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage

      fetch(`http://localhost:5000/api/test/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
         },
      })
         .then((response) => response.json())
         .then((data) => {
            console.log("Data fetched from API:", data);
            let exams = [];
            if (Array.isArray(data)) {
               exams = data.filter((exam) => exam.status === 'published');
               setPublishedExams(exams);
            } else if (data && Array.isArray(data.data)) {
               exams = data.data.filter((exam) => exam.status === 'published');
               setPublishedExams(exams);
            } else {
               console.error("API không trả về một mảng hợp lệ:", data);
            }
            onFetchExamCount(exams.length);
         })
         .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu:", error);
            onFetchExamCount(0);
         });
   }, [onFetchExamCount]);

   // Hàm xử lý khi người dùng nhấn vào bài kiểm tra
   const handleExamClick = (examId) => {
      navigate(`/learner/TakeExam/${examId}`); // Điều hướng đến trang TakeExam với ID bài thi
   };

   return (
      <div className="mt-4">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách bài kiểm tra công khai</h2>

         {/* Container displaying the exam cards in 4 columns */}
         <div className="grid grid-cols-4 gap-6">
            {publishedExams.length > 0 ? (
               publishedExams.map((exam) => (
                  <div
                     key={exam._id}
                     className="bg-white rounded-lg border border-gray-200 p-6 w-full cursor-pointer hover:shadow-md transition"
                     onClick={() => handleExamClick(exam._id)} // Thêm onClick để điều hướng đến trang TakeExam
                  >
                     <div className="font-semibold text-gray-800 mb-4 text-lg">{exam.title}</div>
                     <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex items-center">
                           <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🕒</span>
                           {dayjs(exam.start_date).format('DD/MM/YYYY HH:mm')}
                        </div>
                        <div className="flex items-center">
                           <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏰</span>
                           {dayjs(exam.end_date).format('DD/MM/YYYY HH:mm')}
                        </div>
                        <div className="flex items-center">
                           <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏳</span>
                           Thời gian làm bài: {exam.duration}
                        </div>
                        <div className="flex items-center">
                           <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📋</span>
                           Số câu hỏi: {exam.questions.length}
                        </div>
                     </div>
                  </div>
               ))
            ) : (
               <div className="col-span-4 text-center text-gray-500">
                  <FileQuestion />
                  Hiện tại không có bài kiểm tra nào để hiển thị.
               </div>
            )}
         </div>
      </div>
   );
};

export default ViewExamLeaner;
