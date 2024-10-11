import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Tag, Button, Row, Col, Divider, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import "tailwindcss/tailwind.css";
import HeaderComponent from '../../components/learner/LearnerHeader';
const ViewExamResults = () => {
   const { submissionId } = useParams();  // Lấy submissionId từ URL
   const [submissionData, setSubmissionData] = useState(null);  // Trạng thái để lưu dữ liệu bài làm
   const navigate = useNavigate();

   // Đường dẫn API để lấy dữ liệu kết quả
   const SUBMISSION_URL = `http://localhost:5000/api/submissions/${submissionId}`;

   // Lấy dữ liệu từ API
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

   // Nếu dữ liệu chưa tải, hiển thị màn hình tải
   if (!submissionData) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Đang tải dữ liệu bài thi...</div>
         </div>
      );
   }

   // Tính điểm dựa trên số câu trả lời đúng
   const totalQuestions = submissionData.questions.length;
   const correctAnswers = submissionData.questions.filter(
      (q) => q.answer === q.correct_answers[0]
   ).length;

   const score = ((correctAnswers / totalQuestions) * 10).toFixed(2);
   return (
      <div>
         <HeaderComponent></HeaderComponent>
         <div className=' flex justify-around py-6 shadow-sm bg-slate-200'>
            <div>

               X

            </div>
            <div className="text-2xl">
               <p>
                  Kết quả bài kiểm tra -------
               </p>
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

               {/* THANH CHI TIẾT NỘI DUNG */}
               <div className="mb-6 bg-gray-200 p-4 border-collapse rounded-xl">

                  <div className=" h-16 flex flex-col justify-between border-b-[1px] border-gray-500 py-9'">
                     <p><strong>Tên bài thi:</strong> {submissionData._id_test.title}</p>
                     <p className="text-gray-600">ID: {submissionData._id}</p>
                  </div>

                  <div className=" h-16 flex justify-between border-b-[1px] border-gray-500 py-9-2'">
                     <p className="font-semibold">Tổng số câu hỏi: {totalQuestions}</p>
                     <p className="">Số câu trả lời đúng: {correctAnswers}</p>
                     <p><strong>Thời gian làm:</strong> {new Date(submissionData.started_at).toLocaleString()}</p>
                  </div>
                  <div className=" h-16 flex border-b-[1px] gap-2 border-gray-500 py-9-2'">
                     <div>
                        <img
                           className='h-14 w-14 rounded-full border border-gray-300'
                           src="https://tse1.mm.bing.net/th?id=OIP.Y5a7pZjy5Xz0uFHpZR64ZwHaHa&pid=Api&P=0&h=180"
                           alt="User Avatar"
                        />
                     </div>
                     <div>
                        <p><strong>Người dùng:</strong> {submissionData._id_user.name}</p>
                        <p><strong>Email:</strong> {submissionData._id_user.email}</p>
                     </div>
                  </div>
                  <div className="h-16 ">
                     <div justify="space-between">
                        <div>
                           <p>
                              Số câu đã chọn : {correctAnswers}
                           </p>
                        </div>
                        <div className="text-right">
                           <p className="text-xl">Điểm: <span className="text-green-600">{score}/10</span> </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* THANH CHI TIẾT NỘI DUNG */}

               {/* Danh sách câu hỏi và kết quả */}
               <Card>
                  <List
                     header={<h3 className="text-lg font-semibold">Chi tiết câu hỏi</h3>}
                     bordered
                     dataSource={submissionData.questions}
                     renderItem={(question, index) => (
                        <List.Item>
                           <div className="w-full">
                              {/* Câu hỏi */}
                              <div className="mb-2">
                                 <strong>{index + 1}. {question.question_text}</strong>
                              </div>

                              {/* Các lựa chọn */}
                              <div className="mb-2">
                                 {question.options.map((option, idx) => (
                                    <div key={idx} className={`mb-1 ${option === question.correct_answers[0] ? 'text-green-600' : ''}`}>
                                       <span className="font-medium">{String.fromCharCode(65 + idx)}. {option}</span>
                                       {option === question.answer && (
                                          option === question.correct_answers[0] ? (
                                             <Tag icon={<CheckCircleOutlined />} color="success" className="ml-2">
                                                Đúng
                                             </Tag>
                                          ) : (
                                             <Tag icon={<CloseCircleOutlined />} color="error" className="ml-2">
                                                Sai
                                             </Tag>
                                          )
                                       )}
                                    </div>
                                 ))}
                              </div>

                              {/* Hiển thị đáp án đúng */}
                              <Divider />
                              <p><strong>Đáp án đúng:</strong> {question.correct_answers.join(', ')}</p>
                           </div>
                        </List.Item>
                     )}
                  />
               </Card>
            </div>
         </div>
      </div>
   );
};

export default ViewExamResults;