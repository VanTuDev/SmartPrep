import React, { useState, useEffect } from 'react';
import CardComponent from '../../components/learner/ExamCard';
import HeaderComponent from '../../components/learner/LearnerHeader';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const ExamHistory = () => {
   const [tests, setTests] = useState([]); // State lưu danh sách bài kiểm tra
   const userId = localStorage.getItem('userId'); // Lấy userId từ localStorage
   const token = localStorage.getItem('token'); // Lấy token từ localStorage

   // URL của API để lấy lịch sử bài kiểm tra theo ID người dùng
   const API_URL = `http://localhost:5000/api/submissions/user/${userId}`;

   // Gọi API để lấy danh sách bài kiểm tra theo `userId`
   useEffect(() => {
      const fetchTestHistory = async () => {
         try {
            if (!userId || !token) {
               toast.error('Bạn chưa đăng nhập, vui lòng đăng nhập để xem lịch sử bài kiểm tra!');
               return;
            }

            const response = await fetch(API_URL, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
            });

            if (response.ok) {
               const data = await response.json();
               console.log('Fetched Test History:', data);
               setTests(data || []); // Cập nhật danh sách bài kiểm tra từ API
            } else {
               toast.error('Lỗi khi tải lịch sử bài kiểm tra');
            }
         } catch (error) {
            console.error('Error fetching test history:', error);
            toast.error('Lỗi khi tải dữ liệu');
         }
      };

      if (userId) {
         fetchTestHistory(); // Gọi API khi có userId
      }
   }, [API_URL, userId, token]);

   return (
      <div className="bg-white-50">
         {/* Header */}
         <HeaderComponent />
         <div className="min-h-screen bg-gray px-16 py-12">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-1/3">
                  <input
                     type="text"
                     placeholder="Nhập từ khóa"
                     className="px-4 py-2 w-full focus:outline-none"
                  />
                  <Search className="w-5 h-5 mx-3 text-gray-500" />
               </div>
            </div>

            {/* Danh sách các bài kiểm tra */}
            <div className="flex flex-wrap gap-8">
               {tests.length > 0 ? (
                  tests.map((test, index) => (
                     <CardComponent
                        key={index}
                        id={test._id} // ID của submission
                        title={test.test_id.title} // Tên bài kiểm tra
                        startTime={dayjs(test.started_at).format('HH:mm - DD/MM/YYYY')} // Thời gian bắt đầu
                        endTime={dayjs(test.finished_at).format('HH:mm - DD/MM/YYYY')} // Thời gian kết thúc
                        duration={`${test.duration} phút`} // Thời gian làm bài (phút)
                        questionCount={test.questions.length} // Số câu hỏi
                        score={test.score} // Điểm số
                     />
                  ))
               ) : (
                  <div className="text-center w-full text-gray-500 text-lg">
                     Không có bài kiểm tra nào trong lịch sử
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ExamHistory;
