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
            const draftExams = data?.filter(exam => exam.status === 'draft');
            setDraftExams(draftExams);
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
