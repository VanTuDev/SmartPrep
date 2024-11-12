// ExamDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MiniExamCard from 'components/Card/MiniExamCard/MiniExamCard';

const ExamDashboard = () => {
   const navigate = useNavigate();
   const [ongoingExams, setOngoingExams] = useState([]); // State lưu trữ các bài kiểm tra đang diễn ra
   const [draftExams, setDraftExams] = useState([]); // State lưu trữ các bài kiểm tra đang soạn thảo
   const [grades, setGrades] = useState({}); // State lưu thông tin về các khối
   const [subjects, setSubjects] = useState({}); // State lưu thông tin về các môn học

   // Hook gọi hàm fetchExams khi component được mount
   useEffect(() => {
      fetchExams();
   }, []);

   // Hàm fetchExams: lấy danh sách bài kiểm tra từ API và phân loại chúng
   const fetchExams = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/test', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });

         const exams = response.data;
         const ongoing = exams.filter((exam) => exam.status === 'published'); // Bài kiểm tra đang diễn ra
         const draft = exams.filter((exam) => exam.status === 'draft'); // Bài kiểm tra đang soạn thảo

         setOngoingExams(ongoing);
         setDraftExams(draft);

         const uniqueGradeIds = [...new Set(exams.map((exam) => exam.grade_id))];
         await fetchGradesByIds(uniqueGradeIds); // Lấy thông tin khối của các bài kiểm tra
         await fetchSubjectsByGrades(uniqueGradeIds); // Lấy thông tin môn học của các bài kiểm tra
      } catch (error) {
         console.error('Error fetching exams:', error);
      }
   };

   // Hàm fetchGradesByIds: lấy thông tin khối dựa trên danh sách ID khối
   const fetchGradesByIds = async (gradeIds) => {
      try {
         const gradesData = {};
         for (const gradeId of gradeIds) {
            const response = await axios.get(
               `http://localhost:5000/api/instructor/grades/get/${gradeId}`,
               { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            gradesData[gradeId] = response.data.name;
         }
         setGrades(gradesData);
      } catch (error) {
         console.error('Error fetching grades:', error);
      }
   };

   // Hàm fetchSubjectsByGrades: lấy thông tin môn học dựa trên danh sách ID khối
   const fetchSubjectsByGrades = async (gradeIds) => {
      try {
         const subjectsData = {};
         for (const gradeId of gradeIds) {
            const response = await axios.get(
               `http://localhost:5000/api/instructor/category/getCategoryByGrade?grade_id=${gradeId}`,
               { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            response.data.forEach((subject) => {
               subjectsData[subject._id] = subject.name;
            });
         }
         setSubjects(subjectsData);
      } catch (error) {
         console.error('Error fetching subjects:', error);
      }
   };

   // Hàm điều hướng đến trang tạo bài kiểm tra mới
   const handleCreateExam = () => {
      navigate('/instructor/exam/exam-create');
   };

   // Hàm điều hướng đến trang cập nhật bài kiểm tra
   const handleUpdate = (examId) => {
      navigate(`/instructor/exam/${examId}/update`);
   };

   // Hàm xóa bài kiểm tra theo ID, sau đó làm mới danh sách
   const handleDelete = async (examId) => {
      try {
         await axios.delete(`http://localhost:5000/api/instructor/test/${examId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         fetchExams();
      } catch (error) {
         console.error('Error deleting exam:', error);
      }
   };

   return (
      <div className="w-full flex justify-center items-start mt-0">
         <div className="w-10/12">
            {/* Nút tạo bài kiểm tra mới */}
            <div className="flex justify-end mb-6">
               <button
                  className="bg-violet-800 text-white px-4 py-1.5 rounded-md flex items-center space-x-2 hover:bg-violet-950 transition"
                  onClick={handleCreateExam}
               >
                  <span>Tạo bài kiểm tra</span>
                  <span className="ml-1">+</span>
               </button>
            </div>

            {/* Danh sách các bài kiểm tra đang diễn ra */}
            <div>
               <h1 className="text-xl font-semibold text-gray-700">Đang diễn ra</h1>
               <div className="border-b border-gray-300 my-4"></div>
               {ongoingExams.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                     {ongoingExams.map((exam) => (
                        <MiniExamCard
                           key={exam._id}
                           exam={exam}
                           grades={grades}
                           subjects={subjects}
                           onUpdate={handleUpdate} // Hàm cập nhật bài kiểm tra
                           onDelete={handleDelete} // Hàm xóa bài kiểm tra
                        />
                     ))}
                  </div>
               ) : (
                  <div className="flex flex-col justify-center items-center mt-12">
                     <img src="/image/noExam.png" alt="No Exams" className="h-40 mb-6" />
                     <p className="text-gray-300 text-lg">Hiện tại không có bài kiểm tra nào đang diễn ra</p>
                  </div>
               )}
            </div>

            {/* Danh sách các bài kiểm tra đang soạn thảo */}
            <div className="mt-12">
               <h1 className="text-xl font-semibold text-gray-700">Bài kiểm tra đang soạn</h1>
               <div className="border-b border-gray-300 my-4"></div>
               {draftExams.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                     {draftExams.map((exam) => (
                        <MiniExamCard
                           key={exam._id}
                           exam={exam}
                           grades={grades}
                           subjects={subjects}
                           onUpdate={handleUpdate} // Hàm cập nhật bài kiểm tra
                           onDelete={handleDelete} // Hàm xóa bài kiểm tra
                        />
                     ))}
                  </div>
               ) : (
                  <div className="flex flex-col justify-center items-center mt-12">
                     <img src="/image/noDraft.png" alt="No Drafts" className="h-40 mb-6" />
                     <p className="text-gray-300 text-lg">Hiện tại không có bài kiểm tra nào đang soạn</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

export default ExamDashboard;
