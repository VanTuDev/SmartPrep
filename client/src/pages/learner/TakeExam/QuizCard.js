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
   const [quizData, setQuizData] = useState(null); // State lưu dữ liệu bài kiểm tra
   const [loading, setLoading] = useState(false); // State để quản lý trạng thái tải dữ liệu
   const navigate = useNavigate();
   const { examId } = useParams(); // Lấy `examId` từ URL params (examId là ID của bài kiểm tra)

   // Lấy thông tin người dùng từ localStorage
   const userId = localStorage.getItem("userId"); // Lấy ID người dùng từ localStorage
   const token = localStorage.getItem("token"); // Lấy token người dùng từ localStorage

   // URL để gọi API lấy chi tiết bài thi
   const API_URL = `http://localhost:5000/api/test/${examId}`;
   const START_SUBMISSION_URL = `http://localhost:5000/api/submissions/start`;

   useEffect(() => {
      const fetchQuizData = async () => {
         try {
            const response = await fetch(API_URL, {
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`, // Thêm token vào header nếu API yêu cầu
               },
            });
            const data = await response.json();
            setQuizData(data); // Lưu dữ liệu từ API vào state
         } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài kiểm tra:", error);
            message.error("Không thể tải dữ liệu bài kiểm tra!");
         }
      };

      fetchQuizData(); // Gọi hàm để lấy dữ liệu từ API
   }, [API_URL, token]);

   // Hàm xử lý khi nhấn "Bắt đầu" bài thi
   const handleStart = async () => {
      if (!userId || !token) {
         message.error("Vui lòng đăng nhập trước khi bắt đầu bài thi!");
         return;
      }

      setLoading(true);
      try {
         // Gọi API `startTest` để bắt đầu bài kiểm tra
         const response = await fetch(START_SUBMISSION_URL, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`, // Đặt token vào header để xác thực
            },
            body: JSON.stringify({
               _id_user: userId, // ID của user lấy từ localStorage
               _id_test: quizData._id, // ID của bài kiểm tra từ state
            }),
         });

         if (response.ok) {
            const result = await response.json();
            console.log("Submission created:", result); // Log `submissionId` để kiểm tra

            // Kiểm tra xem `result.submission` có tồn tại không và có `submission._id` không
            if (result.submission && result.submission._id) {
               // Chuyển hướng đến trang làm bài thi với `submissionId` và `examId`
               navigate(`/learner/TakeExam/${examId}/${result.submission._id}`);
            } else {
               console.error("submissionId is missing in response!");
               message.error("Không thể bắt đầu bài kiểm tra vì thiếu ID bài làm!");
            }
         } else {
            const error = await response.json();
            console.error("Lỗi khi bắt đầu bài kiểm tra:", error);
            message.error(error.message || "Không thể bắt đầu bài kiểm tra!");
         }
      } catch (error) {
         console.error("Lỗi khi bắt đầu bài kiểm tra:", error);
         message.error("Đã xảy ra lỗi trong quá trình bắt đầu bài kiểm tra!");
      } finally {
         setLoading(false);
      }
   };

   // Hàm xử lý khi nhấn vào nút "X" để thoát ra ngoài
   const handleExit = () => {
      navigate("/learner/dashboard"); // Chuyển hướng đến trang Dashboard của learner
   };

   if (!quizData) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</div>
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
                     <img src="/image/logo.svg" alt="Logo" className="h-20 w-20" />
                     <span className="font-semibold text-2xl">SmartPrep</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-4">
                     <span className="text-3xl font-semibold text-gray-800">{quizData.examId}</span>
                     <div className="flex items-center">
                        <CloseOutlined
                           className="text-2xl cursor-pointer hover:text-red-500 transition duration-200"
                           onClick={handleExit} // Gọi hàm handleExit khi nhấn vào nút X
                        />
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
                        <span className="text-gray-700 text-lg">{quizData.start_date.split("T")[0]}</span>
                     </div>
                     <div className="flex items-center space-x-2">
                        <ClockCircleOutlined className="text-gray-500" style={{ fontSize: "24px" }} />
                        <span className="text-gray-700 text-lg">{quizData.end_date.split("T")[0]}</span>
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
                  <span className="text-gray-700 text-lg">{quizData.access_type}</span>
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
