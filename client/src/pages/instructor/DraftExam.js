import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MiniExamCard from 'components/Card/MiniExamCard/MiniExamCard';

const DraftExam = () => {
   const [draftExams, setDraftExams] = useState([]);
   const navigate = useNavigate();

   // Fetch data from the API
   useEffect(() => {
      fetch('http://localhost:5000/api/test/get_all_test', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
         },
      })
         .then((response) => response.json())
         .then((data) => {
            console.log("Data fetched from API:", data); // Thêm dòng này để kiểm tra cấu trúc dữ liệu trả về
            if (Array.isArray(data)) {
               const draftExams = data.filter(exam => exam.status === 'draft');
               setDraftExams(draftExams);
            } else if (data && Array.isArray(data.data)) {
               // Kiểm tra nếu API trả về đối tượng với thuộc tính `data` chứa mảng
               const draftExams = data.data.filter(exam => exam.status === 'draft');
               setDraftExams(draftExams);
            } else {
               console.error("API không trả về một mảng hợp lệ:", data);
            }
         })
         .catch((error) => {
            console.error("Lỗi khi lấy dữ liệu:", error);
         });
   }, []);

   const handleUpdate = (examId) => {
      navigate(`/instructor/exam/${examId}`);
   };

   const handleDelete = (examId) => {
      fetch(`http://localhost:5000/api/test/${examId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
         },
      }).then(() => {
         setDraftExams(draftExams.filter(exam => exam._id !== examId));
      });
   };

   return (
      <div className="mt-12">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Đang soạn</h2>

         {/* Container displaying the exam cards in 4 columns */}
         <div className="grid grid-cols-4 gap-6">
            {draftExams?.map((exam) => (
               <MiniExamCard
                  key={exam._id}
                  exam={exam}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
               />
            ))}
         </div>
      </div>
   );
};

export default DraftExam;
