import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Modal, Button } from 'antd';
import { FileQuestion } from 'lucide-react';

const ViewExamLeaner = ({ onFetchExamCount }) => {
   const [publicExams, setPublicExams] = useState([]);
   const [completedExamIds, setCompletedExamIds] = useState([]); // List of completed exam IDs
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [modalMessage, setModalMessage] = useState('');
   const navigate = useNavigate();

   // Fetch public exams (where classRoom_id is null)
   useEffect(() => {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!userId || !token) {
         return;
      }

      // Fetch the exams
      fetch(`http://localhost:5000/api/instructor/test/user/${userId}/classroom-tests`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      })
         .then((response) => response.json())
         .then((data) => {
            const exams = Array.isArray(data) ? data : data.data || [];
            const filteredPublicExams = exams.filter(
               (exam) => !exam.classRoom_id || exam.classRoom_id.length === 0
            );
            setPublicExams(filteredPublicExams);
            onFetchExamCount(filteredPublicExams.length);
         })
         .catch((error) => {
            console.error("Error fetching public exams:", error);
         });

      // Fetch completed exams
      fetch(`http://localhost:5000/api/submissions/user/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      })
         .then((response) => response.json())
         .then((data) => {
            const completedExams = data.map((submission) => submission.test_id._id);
            setCompletedExamIds(completedExams); // Store completed exam IDs
         })
         .catch((error) => {
            console.error("Error fetching completed exams:", error);
         });
   }, [onFetchExamCount]);

   const showModal = (message) => {
      setModalMessage(message);
      setIsModalVisible(true);
   };

   const handleOk = () => {
      setIsModalVisible(false);
   };

   const handleExamClick = (exam) => {
      const now = dayjs();
      const start = dayjs(exam.start_date);
      const end = dayjs(exam.end_date);

      if (now.isBefore(start)) {
         showModal("Bài kiểm tra chưa bắt đầu. Vui lòng quay lại sau khi bài kiểm tra mở.");
      } else if (now.isAfter(end)) {
         showModal("Bài kiểm tra đã kết thúc. Bạn không thể tham gia vào thời điểm này.");
      } else if (completedExamIds.includes(exam._id)) {
         showModal("Bạn đã hoàn thành bài kiểm tra này.");
      } else {
         navigate(`/learner/TakeExam/${exam._id}`);
      }
   };

   const renderExamCard = (exam) => {
      const now = dayjs();
      const start = dayjs(exam.start_date);
      const end = dayjs(exam.end_date);

      const examStatus = now.isBefore(start)
         ? 'Chưa bắt đầu'
         : now.isAfter(end)
            ? 'Đã kết thúc'
            : 'Đang diễn ra';

      const statusColor =
         examStatus === 'Chưa bắt đầu'
            ? 'text-yellow-600'
            : examStatus === 'Đang diễn ra'
               ? 'text-blue-600'
               : 'text-gray-500';

      const isCompleted = completedExamIds.includes(exam._id);

      return (
         <div
            key={exam._id}
            className={`bg-white rounded-lg border border-gray-200 p-6 w-full cursor-pointer hover:shadow-md transition ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''
               }`}
            onClick={() => !isCompleted && handleExamClick(exam)}
         >
            <div className="font-semibold text-gray-800 mb-4 text-lg">
               {exam.title || 'Untitled Exam'}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
               <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🕒</span>
                  {exam.start_date ? dayjs(exam.start_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
               </div>
               <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏰</span>
                  {exam.end_date ? dayjs(exam.end_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
               </div>
               <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏳</span>
                  Thời gian làm bài: {exam.duration || 0} phút
               </div>
               <div className="flex items-center">
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📋</span>
                  Số câu hỏi: {exam.questions_id.length}
               </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
               <span className={`text-sm font-semibold ${statusColor}`}>
                  <div className="flex items-center">
                     <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🌍</span>
                     {isCompleted ? 'Đã hoàn thành' : examStatus}
                  </div>
               </span>
            </div>
         </div>
      );
   };

   return (
      <div className="mt-4">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Danh sách bài kiểm tra công khai</h2>
         <div className="grid grid-cols-4 gap-6">
            {publicExams.length > 0 ? (
               publicExams.map(renderExamCard)
            ) : (
               <div className="col-span-4 text-center text-gray-500">
                  <FileQuestion />
                  Hiện tại không có bài kiểm tra công khai nào để hiển thị.
               </div>
            )}
         </div>

         <Modal
            title="Thông báo"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => setIsModalVisible(false)}
            footer={[
               <Button key="ok" type="primary" onClick={handleOk}>
                  OK
               </Button>
            ]}
         >
            <p>{modalMessage}</p>
         </Modal>
      </div>
   );
};

export default ViewExamLeaner;
