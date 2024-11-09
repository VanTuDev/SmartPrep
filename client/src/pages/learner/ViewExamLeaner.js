import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Modal, Button } from 'antd';
import { FileQuestion } from 'lucide-react';

const ViewExamLeaner = ({ onFetchExamCount }) => {
   const [publicExams, setPublicExams] = useState([]);
   const [classroomExams, setClassroomExams] = useState([]);
   // const [userClassrooms, setUserClassrooms] = useState([]);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [modalMessage, setModalMessage] = useState('');
   const navigate = useNavigate();

   // // Fetch user's classrooms
   // useEffect(() => {
   //    const userId = localStorage.getItem('userId');

   //    fetch(`http://localhost:5000/api/classrooms/learner/classes`, {
   //       method: 'GET',
   //       headers: {
   //          'Content-Type': 'application/json',
   //          'Authorization': `Bearer ${localStorage.getItem('token')}`,
   //       },
   //    })
   //       .then((response) => response.json())
   //       .then((data) => {
   //          const classroomIds = data.map(classroom => classroom._id);
   //          setUserClassrooms(classroomIds);
   //       })
   //       .catch((error) => console.error("Error fetching user's classrooms:", error));
   // }, []);

   // Fetch public exams (where classRoom_id is null)
   useEffect(() => {
      const userId = localStorage.getItem('userId');

      fetch(`http://localhost:5000/api/instructor/test/user/${userId}/classroom-tests`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
         },
      })
         .then((response) => response.json())
         .then((data) => {
            const exams = Array.isArray(data) ? data : data.data || [];
            const filteredPublicExams = exams.filter((exam) => !exam.classRoom_id);
            setPublicExams(filteredPublicExams);
         })
         .catch((error) => {
            console.error("Error fetching public exams:", error);
         });
   }, []);

   // Fetch classroom exams (where classRoom_id matches user's classrooms)                            
   // useEffect(() => {
   //    const userId = localStorage.getItem('userId');

   //    fetch(`http://localhost:5000/api/instructor/test/user/${userId}/classroom-tests`, {
   //       method: 'GET',
   //       headers: {
   //          'Content-Type': 'application/json',
   //          'Authorization': `Bearer ${localStorage.getItem('token')}`,
   //       },
   //    })
   //       .then((response) => response.json())
   //       .then((data) => {
   //          const exams = Array.isArray(data) ? data : data.data || [];
   //          const filteredClassroomExams = exams.filter(
   //             (exam) => exam.classRoom_id && userClassrooms.includes(exam.classRoom_id)
   //          );
   //          setClassroomExams(filteredClassroomExams);
   //       })
   //       .catch((error) => console.error("Error fetching classroom exams:", error));
   // }, [userClassrooms]);

   // Update exam count whenever public or classroom exams change
   useEffect(() => {
      onFetchExamCount(publicExams.length + classroomExams.length);
   }, [publicExams, classroomExams, onFetchExamCount]);

   // Show modal with a message
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
         // Exam has not started yet
         showModal("Bài kiểm tra chưa bắt đầu. Vui lòng quay lại sau khi bài kiểm tra mở.");
      } else if (now.isAfter(end)) {
         // Exam has ended
         showModal("Bài kiểm tra đã kết thúc. Bạn không thể tham gia vào thời điểm này.");
      } else {
         // Exam is ongoing, navigate to exam page
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

      return (
         <div
            key={exam._id}
            className="bg-white rounded-lg border border-gray-200 p-6 w-full cursor-pointer hover:shadow-md transition"
            onClick={() => handleExamClick(exam)}
         >
            <div className="font-semibold text-gray-800 mb-4 text-lg">{exam.title || 'Untitled Exam'}</div>
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
                     {examStatus}
                  </div>
               </span>
            </div>
         </div>
      );
   };

   return (
      <div className="mt-4">
         {/* Public Exams Section */}
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

         {/* Modal for Exam Notification */}
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
