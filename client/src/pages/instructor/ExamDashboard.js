import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import DraftExam from './DraftExam'; // Import component DraftExam
import MiniExamCard from 'components/Card/MiniExamCard/MiniExamCard';

// Fake data cho bài kiểm tra
const fakeExams = [
   {
      _id: 'toan-lop-10',
      title: 'Bài kiểm tra Toán lớp 10',
      description: 'Kiểm tra kiến thức cơ bản môn Toán lớp 10.',
      instructor: 'gv-nguyen-van-a',
      questions: ['cau-hoi-1', 'cau-hoi-2'],
      classRoom_id: 'lop-10A1',
      duration: 60,
      access_type: 'public',
      start_date: '2024-10-22T08:00:00Z',
      end_date: '2024-10-22T09:00:00Z',
      invite_users: ['student1@example.com', 'student2@example.com'],
      access_link: 'http://example.com/exam/toan10',
      status: 'published',
      createdAt: '2024-10-01T08:00:00Z',
      updatedAt: '2024-10-10T08:00:00Z',
   },
   {
      _id: 'vat-ly-lop-11',
      title: 'Bài kiểm tra Vật Lý lớp 11',
      description: 'Kiểm tra kiến thức cơ bản môn Vật Lý lớp 11.',
      instructor: 'gv-tran-thi-b',
      questions: ['cau-hoi-3'],
      classRoom_id: 'lop-11B2',
      duration: 45,
      access_type: 'private',
      start_date: '2024-10-23T08:00:00Z',
      end_date: '2024-10-23T08:45:00Z',
      invite_users: ['student3@example.com', 'student4@example.com'],
      access_link: 'http://example.com/exam/vatly11',
      status: 'published',
      createdAt: '2024-10-05T08:00:00Z',
      updatedAt: '2024-10-15T08:00:00Z',
   },
   {
      _id: 'hoa-lop-12',
      title: 'Bài kiểm tra Hóa lớp 12',
      description: 'Kiểm tra kiến thức môn Hóa học lớp 12.',
      instructor: 'gv-le-thanh-c',
      questions: ['cau-hoi-4'],
      classRoom_id: 'lop-12C3',
      duration: 30,
      access_type: 'public',
      start_date: '2024-10-25T08:00:00Z',
      end_date: '2024-10-25T08:30:00Z',
      invite_users: [],
      access_link: 'http://example.com/exam/hoa12',
      status: 'draft',
      createdAt: '2024-10-10T08:00:00Z',
      updatedAt: '2024-10-20T08:00:00Z',
   },
];

const ExamDashboard = () => {
   const navigate = useNavigate();
   const [ongoingExams, setOngoingExams] = useState([]);
   const [draftExams, setDraftExams] = useState([]);

   useEffect(() => {
      const publishedExams = fakeExams.filter((exam) => exam.status === 'published');
      const drafts = fakeExams.filter((exam) => exam.status === 'draft');
      setOngoingExams(publishedExams);
      setDraftExams(drafts);
   }, []);

   const handleUpdate = (examId) => {
      navigate(`/instructor/exam/${examId}`);
   };

   const handleDelete = (examId) => {
      setOngoingExams(ongoingExams.filter((exam) => exam._id !== examId));
      setDraftExams(draftExams.filter((exam) => exam._id !== examId));
   };

   return (
      <div className="w-full flex justify-center items-start mt-0">
         <div className="w-10/12">
            <div className="flex justify-end mb-6">
               <button
                  className="bg-violet-800 text-white px-4 py-1.5 rounded-md flex items-center space-x-2 hover:bg-violet-950 transition"
                  onClick={() => navigate('/instructor/exam/exam-create')}
               >
                  <span>Tạo bài kiểm tra</span>
                  <span className="ml-1">+</span>
               </button>
            </div>

            {/* Phần bài kiểm tra đang diễn ra */}
            <div>
               <h1 className="text-xl font-semibold text-gray-700">Đang diễn ra</h1>
               <div className="border-b border-gray-300 my-4"></div>
               {ongoingExams.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                     {ongoingExams.map((exam) => (
                        <MiniExamCard
                           key={exam._id}
                           exam={exam}
                           onUpdate={handleUpdate}
                           onDelete={handleDelete}
                        />
                     ))}
                  </div>
               ) : (
                  <div className="flex flex-col justify-center items-center mt-12">
                     <img src="/image/noExam.png" alt="No Exams" className="h-40 mb-6" />
                     <p className="text-gray-300 text-lg">Hiện tại không có bài trắc nghiệm nào đang diễn ra</p>
                  </div>
               )}
            </div>

            {/* Phần bài kiểm tra đang soạn */}
            <div className="mt-12">
               <h1 className="text-xl font-semibold text-gray-700">Bài kiểm tra đang soạn</h1>
               <div className="border-b border-gray-300 my-4"></div>
               {draftExams.length > 0 ? (
                  <div className="grid grid-cols-4 gap-6">
                     {draftExams.map((exam) => (
                        <MiniExamCard
                           key={exam._id}
                           exam={exam}
                           onUpdate={handleUpdate}
                           onDelete={handleDelete}
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

            <DraftExam />
            <div className="mb-10"></div>
         </div>
      </div>
   );
};

export default ExamDashboard;
