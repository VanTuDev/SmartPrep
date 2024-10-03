import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LearnerDashboard = () => {
   const [userInfo, setUserInfo] = useState({});
   const [questions, setQuestions] = useState([]);
   const [currentPage, setCurrentPage] = useState(0); // Trang hiện tại
   const questionsPerPage = 5; // Số lượng câu hỏi hiển thị trên mỗi trang
   const questionContainerRef = useRef(null); // Tham chiếu đến div chứa danh sách câu hỏi

   const navigate = useNavigate();

   // Lấy dữ liệu từ file JSON trong thư mục `public`
   useEffect(() => {
      fetch('/learner.data/questions.json')
         .then((response) => {
            if (!response.ok) {
               throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
         })
         .then((data) => {
            // Tính toán số câu đã được chọn (không bao gồm những câu có `selected` là "null")
            const selectedQuestions = data.questions.filter((q) => q.selected !== "null").length;

            // Cập nhật thông tin người dùng và số câu đã chọn
            setUserInfo({
               id: data.user.id,
               name: data.user.name,
               email: data.user.email,
               totalQuestions: data.questions.length, // Tổng số câu hỏi từ file JSON
               duration: data.duration,
               startTime: data.startTime,
               endTime: data.endTime,
               answeredQuestions: selectedQuestions, // Số câu đã chọn
               score: data.score,
            });
            setQuestions(data.questions); // Lưu trữ danh sách câu hỏi
         })
         .catch((error) => {
            console.error("Lỗi khi tải tệp JSON:", error);
         });
   }, []);

   // Tự động cuộn lên đầu khi `currentPage` thay đổi
   useEffect(() => {
      if (questionContainerRef.current) {
         questionContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
   }, [currentPage]);

   // Xử lý điều hướng quay về trang chủ
   const handleGoHome = () => {
      navigate('/'); // Chuyển hướng về trang chủ
   };

   // Xử lý chuyển đến trang kế tiếp
   const handleNextPage = () => {
      if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
         setCurrentPage(currentPage + 1);
      }
   };

   // Xử lý quay lại trang trước đó
   const handlePreviousPage = () => {
      if (currentPage > 0) {
         setCurrentPage(currentPage - 1);
      }
   };

   // Tính toán chỉ số của câu hỏi hiển thị trong trang hiện tại
   const startIndex = currentPage * questionsPerPage;
   const currentQuestions = questions.slice(startIndex, startIndex + questionsPerPage);

   return (
      <div className="bg-gray-100 min-h-screen p-6">
         <header className="relative bg-white shadow-md rounded-lg p-4 mb-6 flex justify-center items-center">
            <div className="text-2xl font-bold text-gray-800">Kết quả bài kiểm tra</div>
            <button
               onClick={handleGoHome}
               className="absolute right-4 text-2xl text-gray-600 hover:text-red-600 transition duration-200"
            >
               &#x2715;
            </button>
         </header>

         {/* Main Content */}
         <div className="flex flex-col justify-start items-center max-w-4xl mx-auto space-y-6">
            {/* Thông tin người dùng và bài kiểm tra */}
            <div className="w-full bg-white shadow-lg rounded-lg p-6">
               <div className="text-lg font-bold text-gray-700 mb-4">TOÁN</div>
               <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div>ID: {userInfo.id}</div>
                  <div className="text-center">Smart Dev</div>
                  <div className="text-right">Thời gian: {userInfo.duration}</div>
               </div>
               <div className="flex items-center mb-4">
                  <img src="https://via.placeholder.com/50" alt="User Avatar" className="rounded-full w-12 h-12 mr-3" />
                  <div>
                     <div className="font-semibold">{userInfo.name}</div>
                     <div className="text-gray-500">{userInfo.email}</div>
                  </div>
               </div>
               <div className="grid grid-cols-3 text-center mb-4">
                  <div className="text-gray-700 font-medium">
                     {userInfo.answeredQuestions}
                     <br />
                     <span className="text-sm">Câu đã chọn</span>
                  </div>
                  <div className="text-gray-700 font-medium">
                     {userInfo.totalQuestions}
                     <br />
                     <span className="text-sm">Tổng số câu hỏi</span>
                  </div>
                  <div className="text-gray-700 font-medium">
                     {userInfo.score !== null ? userInfo.score : 'Đang chờ chấm điểm'}
                     <br />
                     <span className="text-sm">Điểm</span>
                  </div>
               </div>
               <div className="text-right mt-6 text-sm text-gray-500 italic">
                  {userInfo.score !== null ? 'Bài kiểm tra đã được chấm điểm' : 'Đang chờ chấm điểm'}
               </div>
            </div>

            {/* Danh sách câu hỏi theo trang */}
            <div className="w-full bg-white shadow-lg rounded-lg p-6" ref={questionContainerRef}>
               {currentQuestions.length > 0 ? (
                  currentQuestions.map((question, index) => (
                     <div key={index} className="mb-4">
                        <div className="text-md font-medium mb-2">Câu {startIndex + index + 1}: {question.question}</div>
                        <div className="flex flex-col space-y-2">
                           {question.answers.map((answer, i) => {
                              let answerClass = "p-2 border rounded-md flex items-center space-x-2";

                              // Xác định màu sắc hiển thị cho từng câu trả lời
                              if (question.selected === answer && question.selected !== question.correct) {
                                 answerClass += " bg-red-100 text-red-700"; // Màu đỏ cho lựa chọn sai
                              } else if (question.correct === answer) {
                                 answerClass += " bg-green-100 text-green-700"; // Màu xanh cho câu trả lời đúng
                              } else if (question.selected === answer && question.selected === question.correct) {
                                 answerClass += " bg-green-100 text-green-700"; // Màu xanh cho lựa chọn đúng
                              }

                              return (
                                 <div key={i} className={answerClass}>
                                    <input
                                       type="radio"
                                       id={`question-${index}-answer-${i}`}
                                       name={`question-${index}`}
                                       value={answer}
                                       checked={question.selected === answer}
                                       readOnly
                                       className="mr-2"
                                    />
                                    <label htmlFor={`question-${index}-answer-${i}`}>{String.fromCharCode(65 + i)}. {answer}</label>
                                 </div>
                              );
                           })}
                        </div>
                        {/* Hiển thị thông báo nếu chưa chọn câu trả lời */}
                        {question.selected === "null" && (
                           <div className="text-sm text-red-600 mt-2">Chưa chọn câu trả lời</div>
                        )}
                     </div>
                  ))
               ) : (
                  <div>Đang tải dữ liệu câu hỏi...</div>
               )}

               {/* Navigation Buttons */}
               <div className="flex justify-between mt-4">
                  <button
                     onClick={handlePreviousPage}
                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-400 transition duration-200"
                     disabled={currentPage === 0}
                  >
                     Trang trước
                  </button>
                  <button
                     onClick={handleNextPage}
                     className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                     disabled={currentPage === Math.ceil(questions.length / questionsPerPage) - 1}
                  >
                     Trang tiếp theo
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default LearnerDashboard;
