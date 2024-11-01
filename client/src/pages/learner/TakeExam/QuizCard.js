import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Button, message } from "antd";
import {
   ClockCircleOutlined,
   FieldTimeOutlined,
   QuestionCircleOutlined,
   GlobalOutlined,
   CloseOutlined,
} from "@ant-design/icons";
import "tailwindcss/tailwind.css";

const QuizCard = () => {
   const [quizData, setQuizData] = useState(null);
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();
   const { examId } = useParams();

   const userId = localStorage.getItem("userId");
   const token = localStorage.getItem("token");

   const API_URL = `http://localhost:5000/api/instructor/test/${examId}`;
   const START_SUBMISSION_URL = `http://localhost:5000/api/submissions/start`;

   useEffect(() => {
      const fetchQuizData = async () => {
         try {
            const response = await fetch(API_URL, {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
               },
            });

            if (!response.ok) {
               throw new Error("Lỗi tải dữ liệu bài kiểm tra.");
            }

            const data = await response.json();
            setQuizData(data);
         } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài kiểm tra:", error);
            message.error(error.message || "Không thể tải dữ liệu bài kiểm tra!");
         }
      };

      fetchQuizData();
   }, [API_URL, token]);

   const handleStart = async () => {
      if (!userId || !token) {
         message.error("Vui lòng đăng nhập trước khi bắt đầu bài thi!");
         return;
      }

      setLoading(true);
      try {
         const response = await fetch(START_SUBMISSION_URL, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               learner: userId,
               test_id: quizData._id,
            }),
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Không thể bắt đầu bài kiểm tra!");
         }

         const result = await response.json();
         const submissionId = result?.submission?._id;

         if (submissionId) {
            navigate(`/learner/TakeExam/${examId}/${submissionId}`);
         } else {
            throw new Error("Thiếu ID bài làm trong phản hồi.");
         }
      } catch (error) {
         console.error("Lỗi khi bắt đầu bài kiểm tra:", error);
         message.error(error.message);
      } finally {
         setLoading(false);
      }
   };

   const handleExit = () => {
      navigate("/learner/dashboard");
   };

   if (!quizData) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">
               Đang tải dữ liệu...
            </div>
         </div>
      );
   }

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-200">
         <Card
            className="w-[36rem] shadow-xl rounded-lg"
            title={
               <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                     <img
                        src="/image/logo.svg"
                        alt="Logo"
                        className="h-20 w-20"
                     />
                     <span className="font-semibold text-2xl">SmartPrep</span>
                  </div>
                  <CloseOutlined
                     className="text-2xl cursor-pointer hover:text-red-500 transition duration-200"
                     onClick={handleExit}
                  />
               </div>
            }
            bordered={false}
            style={{ backgroundColor: "#ffffff" }}
         >
            <div className="space-y-8">
               <div className="text-3xl font-semibold text-center text-gray-800">
                  {quizData.title}
               </div>
               <p className="text-center text-gray-600">{quizData.description}</p>
               <div className="flex justify-between gap-6 px-6">
                  <div className="w-1/2 bg-gray-100 rounded-lg p-6 space-y-3">
                     <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500 text-xl" />
                        <span className="text-gray-700">
                           Bắt đầu: {new Date(quizData.start_date).toLocaleDateString()}
                        </span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500 text-xl" />
                        <span className="text-gray-700">
                           Kết thúc: {new Date(quizData.end_date).toLocaleDateString()}
                        </span>
                     </div>
                  </div>
                  <div className="w-1/2 bg-gray-100 rounded-lg p-6 space-y-3">
                     <div className="flex items-center space-x-2">
                        <FieldTimeOutlined className="text-gray-500 text-xl" />
                        <span className="text-gray-700">
                           Thời gian: {quizData.duration} phút
                        </span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <QuestionCircleOutlined className="text-gray-500 text-xl" />
                        <span className="text-gray-700">
                           Số câu hỏi: {quizData.questions_id.length}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="text-center border border-gray-300 rounded-lg p-3 bg-gray-100 mx-6">
                  <GlobalOutlined className="text-blue-500 text-xl" />
                  <span className="text-gray-700 ml-2">
                     {quizData.status === 'published' ? 'Công khai' : 'Riêng tư'}
                  </span>
               </div>
               <div className="text-center px-6">
                  <Button
                     type="primary"
                     className="w-full bg-blue-500 text-white text-lg hover:bg-blue-600 focus:bg-blue-700 py-2"
                     onClick={handleStart}
                     loading={loading}
                  >
                     Bắt đầu
                  </Button>
               </div>
            </div>
         </Card>
      </div>
   );
};

export default QuizCard;
