// File: QuizCard.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "antd";
import {
   ClockCircleOutlined,
   FieldTimeOutlined,
   QuestionCircleOutlined,
   GlobalOutlined,
   CloseOutlined
} from "@ant-design/icons";
import "tailwindcss/tailwind.css"; // TailwindCSS

const QuizCard = () => {
   const [quizData, setQuizData] = useState(null);
   const navigate = useNavigate();

   // Giả lập dữ liệu JSON
   const mockData = {
      title: "Bài kiểm tra Toán lớp 10",
      examId: "XYZ1234",
      start_time: "03:37 - 06/10/24",
      end_time: "14:37 - 06/10/24",
      duration: 30,
      questionCount: 10,
      visibility: "Công khai",
   };

   useEffect(() => {
      setTimeout(() => {
         setQuizData(mockData);
      }, 500);
   }, []);

   if (!quizData) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</div>
         </div>
      );
   }

   const handleStart = () => {
      navigate("/learner/TakeExam/Exam1");
   };

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
                  <div className="ml-auto flex items-center space-x-4"> {/* Thêm đoạn div này */}
                     <span className="text-3xl font-semibold text-gray-800">{quizData.examId}</span>
                     <div className="flex items-center">
                        <CloseOutlined className="text-2xl cursor-pointer hover:text-red-500 transition duration-200" />
                     </div>
                  </div>
               </div>
            }
            bordered={false}
            style={{ backgroundColor: "#ffffff" }}
         >
            <div className="space-y-8">
               <div className="text-3xl font-semibold text-center text-gray-800">{quizData.title}</div>
               <div className="flex justify-between gap-6 px-6">
                  <div className="w-1/2 bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-start space-y-3">
                     <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" style={{ fontSize: "24px" }} />
                        <span className="text-gray-700 text-lg">{quizData.start_time}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" style={{ fontSize: "24px" }} />
                        <span className="text-gray-700 text-lg">{quizData.end_time}</span>
                     </div>
                  </div>
                  <div className="w-1/2 bg-gray-100 rounded-lg p-6 flex flex-col justify-center items-start space-y-3">
                     <div className="flex items-center space-x-2">
                        <FieldTimeOutlined className="text-gray-500" style={{ fontSize: "24px" }} />
                        <span className="text-gray-700 text-lg">Thời gian: {quizData.duration} phút</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <QuestionCircleOutlined className="text-gray-500" style={{ fontSize: "24px" }} />
                        <span className="text-gray-700 text-lg">Số câu hỏi : {quizData.questionCount}</span>
                     </div>
                  </div>
               </div>
               <div className="text-center border border-gray-300 rounded-lg p-3 bg-gray-100 flex items-center justify-center space-x-4 mx-6">
                  <GlobalOutlined className="text-blue-500 text-xl" />
                  <span className="text-gray-700 text-lg">{quizData.visibility}</span>
               </div>
               <div className="text-center px-6">
                  <Button
                     type="primary"
                     className="w-full bg-blue-500 text-white text-lg hover:bg-blue-600 focus:bg-blue-700 py-2"
                     onClick={handleStart}
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