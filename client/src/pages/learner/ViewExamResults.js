import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Button, Divider, Modal, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import "tailwindcss/tailwind.css";
import HeaderComponent from '../../components/learner/LearnerHeader';
import GradientButton from 'components/Button/GradientButton';
import formatBulletPoints from 'utils/formulaText';

const ViewExamResults = () => {
   const { submissionId } = useParams();
   const [submissionData, setSubmissionData] = useState(null);
   const [aiResponse, setAiResponse] = useState(null);
   const [loadingAI, setLoadingAI] = useState(false);
   const navigate = useNavigate();

   const SUBMISSION_URL = `http://localhost:5000/api/submissions/${submissionId}`;

   useEffect(() => {
      const fetchSubmissionData = async () => {
         try {
            const response = await fetch(SUBMISSION_URL, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });

            if (response.ok) {
               const data = await response.json();
               setSubmissionData(data);
            } else {
               const error = await response.json();
               message.error(error.message || 'Lỗi khi lấy dữ liệu kết quả bài thi!');
            }
         } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài thi:', error);
            message.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu bài thi!');
         }
      };

      if (submissionId) {
         fetchSubmissionData();
      }
   }, [submissionId]);

   const handleAskAI = async (question, rightAnswer) => {
      setLoadingAI(true);

      try {
         const response = await fetch("http://localhost:5000/api/ai_generate/ask_question", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               question,
               rightAnswer
            }),
         });

         if (response.ok) {
            const data = await response.json();
            setAiResponse(data.generatedText);
         } else {
            message.error("Lỗi khi hỏi AI! Hãy thử lại sau.");
         }
      } catch (error) {
         console.error("Lỗi khi hỏi AI:", error);
         message.error("Đã xảy ra lỗi trong quá trình hỏi AI.");
      } finally {
         setLoadingAI(false);
      }
   };

   if (!submissionData) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Đang tải dữ liệu bài thi...</div>
         </div>
      );
   }

   const totalQuestions = submissionData.questions.length;
   const correctAnswersCount = submissionData.questions.filter(
      (q) => q.is_correct
   ).length;

   const score = ((correctAnswersCount / totalQuestions) * 10).toFixed(2);

   return (
      <div>
         <HeaderComponent />
         <div className='flex justify-around py-6 shadow-sm bg-slate-200'>
            <div />
            <div className="text-2xl">
               <p>Kết quả bài kiểm tra</p>
            </div>
            <div>
               <Button
                  type="primary"
                  onClick={() => navigate(-1)}
                  icon={<ArrowLeft size={16} />}
                  className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
               >
                  Quay lại
               </Button>
            </div>
         </div>

         <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-7/12 max-w-screen-lg mx-auto py-6">
               <div className="mb-6 bg-gray-200 p-4 border-collapse rounded-xl">
                  <div className="h-16 flex flex-col justify-between border-b-[1px] border-gray-500 py-2">
                     <p><strong>Tên bài thi:</strong> {submissionData.test_id.title}</p>
                     <p className="text-gray-600">ID: {submissionData._id}</p>
                  </div>

                  <div className="h-16 flex justify-between border-b-[1px] border-gray-500 py-2">
                     <p className="font-semibold">Tổng số câu hỏi: {totalQuestions}</p>
                     <p>Số câu trả lời đúng: {correctAnswersCount}</p>
                     <p><strong>Thời gian làm:</strong> {new Date(submissionData.started_at).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 border-b-[1px] border-gray-300 py-4">
                     <img
                        className="h-16 w-16 rounded-full object-cover border-2"
                        src="https://tse1.mm.bing.net/th?id=OIP.Y5a7pZjy5Xz0uFHpZR64ZwHaHa&pid=Api&P=0&h=180"
                        alt="User Avatar"
                     />
                     <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-800">Người dùng</p>
                        <p className="text-sm text-gray-500">{submissionData.learner._id}</p>
                     </div>
                  </div>

                  <div className="h-16">
                     <div className="flex justify-between">
                        <p>Số câu đúng: {correctAnswersCount}</p>
                        <p className="text-xl">Điểm: <span className="text-green-600">{score}/10</span></p>
                     </div>
                  </div>
               </div>

               <Card>
                  <List
                     header={<h3 className="text-lg font-semibold">Chi tiết câu hỏi</h3>}
                     bordered
                     dataSource={submissionData.questions}
                     renderItem={(questionWrapper, index) => {
                        const question = questionWrapper.question_id;
                        const correctAnswers = question.correct_answers || []; // Array of correct answers
                        return (
                           <List.Item>
                              <div className="w-full">
                                 {/* Câu hỏi */}
                                 <div className="mb-2">
                                    <strong>{index + 1}. {question.question_text}</strong>
                                 </div>

                                 {/* Các lựa chọn */}
                                 <div className="mb-2">
                                    {question.options.map((option, idx) =>{
                                       const isCorrect = correctAnswers.includes(option);
                                       return (
                                          <div key={idx} className="mb-1">
                                             <span className="font-medium">
                                                {String.fromCharCode(65 + idx)}. {option}
                                             </span>
                                             {questionWrapper.user_answer.includes(option) && (
                                                <Tag
                                                   icon={isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                                   color={isCorrect ? 'success' : 'error'}
                                                   className="ml-2"
                                                >
                                                   {isCorrect ? 'Đúng' : 'Bạn đã chọn'}
                                                </Tag>
                                             )}
                                          </div>
                                       )
                                    }
                                     )}
                                 </div>

                                 {/* Hiển thị đáp án đúng */}
                                 <Divider />
                                 <p><strong>Đáp án đúng:</strong> {correctAnswers.map((ans, idx) => (
                                    <span key={idx} className="ml-2">{ans}</span>
                                 ))}</p>

                                 <GradientButton
                                    className="mt-2"
                                    type="link"
                                    onClick={() => handleAskAI(question.question_text, correctAnswers)}
                                 >
                                    Hỏi AI tại sao?
                                 </GradientButton>
                              </div>
                           </List.Item>
                        );
                     }}
                  />
               </Card>
               {loadingAI && (
                  <Modal visible={loadingAI} footer={null} onCancel={() => setLoadingAI(false)}>
                     <Spin tip="Đang hỏi AI..." />
                  </Modal>
               )}
               {aiResponse && (
                  <Modal
                     visible={!!aiResponse}
                     footer={null}
                     onCancel={() => setAiResponse(null)}
                  >
                     <p>Giải thích từ AI:</p>
                     <p>{formatBulletPoints(aiResponse)}</p>
                  </Modal>
               )}
            </div>
         </div>
      </div>
   );
};

export default ViewExamResults;
