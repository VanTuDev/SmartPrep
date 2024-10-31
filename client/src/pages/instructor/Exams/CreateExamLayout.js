import React, { useState } from 'react';
import dayjs from 'dayjs';
import ExamHeader from '../Exams/ExamHeader';
import GeneralInformation from './GeneralInformation';
import CreateExamModal from '../CreateExamModal';
import LibraryModal from '../../../components/instructor/LibraryModal';
import { message } from 'antd';
import axios from 'axios';
import QuestionAdding from './QuestionAdding'; // Import QuestionAdding component

const CreateExamLayout = () => {
   const [examData, setExamData] = useState({ questions: [] });
   const [isCreateModalOpen, setCreateModalOpen] = useState(true);
   const [isLibraryModalOpen, setLibraryModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   // Cập nhật thông tin bài kiểm tra
   const handleUpdateExam = (updatedExam) => {
      setExamData((prevData) => ({
         ...prevData,
         ...updatedExam,
      }));
   };

   // Thêm câu hỏi từ Library Modal
   const handleAddRandomQuestions = (selectedQuestions) => {
      const newQuestions = selectedQuestions.map((question) => ({
         _id: question._id || 'No ID',
         question_text: question.question_text || 'No Text Available',
      }));

      setExamData((prevData) => ({
         ...prevData,
         questions: [...(prevData.questions || []), ...newQuestions],
      }));

      message.success('Questions added successfully!');
   };

   // Xử lý tạo bài kiểm tra
   const handlePostExam = async () => {
      const { title, description, questions, start_date, end_date, duration } = examData;

      if (!title || !description || questions.length === 0) {
         return message.error('Please fill out all required fields (title, description, and questions).');
      }

      if (start_date && end_date && dayjs(end_date).isBefore(dayjs(start_date))) {
         return message.error('End time must be after the start time.');
      }

      try {
         setLoading(true);
         const response = await axios.post(
            'http://localhost:5000/api/instructor/test/create',
            examData,
            {
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            }
         );

         message.success('Exam created successfully!');
         console.log('Exam creation response:', response.data);
      } catch (error) {
         console.error('Error creating exam:', error);
         message.error('Failed to create exam.');
      } finally {
         setLoading(false);
      }
   };

   const handleAddRandomQuestionsFromAPI = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/questions/random');
         const randomQuestions = response.data;

         setExamData((prevData) => ({
            ...prevData,
            questions: [...prevData.questions, ...randomQuestions],
         }));

         message.success('Random questions added successfully!');
      } catch (error) {
         console.error('Error fetching random questions:', error);
         message.error('Failed to fetch random questions.');
      }
   };

   return (
      <div className="w-full min-h-screen bg-gray-50">
         <div className="py-2 mb-16">
            <ExamHeader
               onPost={handlePostExam}
               loading={loading}
               items={[
                  { label: 'Bài kiểm tra', key: 'general' },
                  { label: 'Các bài đã nộp', key: 'submissions' },
               ]}
               onChangeTab={(key) => console.log(`Switched to tab: ${key}`)}
            />
         </div>

         <div className="w-6/12 container mx-auto pt-5">
            <div className="bg-white p-10 rounded-lg shadow-lg space-y-8">
               <GeneralInformation
                  exam={examData}
                  onUpdateExam={handleUpdateExam}
                  onOpenLibraryModal={() => setLibraryModalOpen(true)}
               />
            </div>
         </div>

         <CreateExamModal
            isOpen={isCreateModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={(info) => {
               setExamData((prevData) => ({
                  ...prevData,
                  ...info,
               }));
               setCreateModalOpen(false);
            }}
         />

         <LibraryModal
            isOpen={isLibraryModalOpen}
            onClose={() => setLibraryModalOpen(false)}
            onSubmit={handleAddRandomQuestions}
         />

         <QuestionAdding onAddRandomQuestions={handleAddRandomQuestionsFromAPI} />
      </div>
   );
};

export default CreateExamLayout;
