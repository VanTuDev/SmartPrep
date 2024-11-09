import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Checkbox, Drawer, message, Modal } from "antd";
import { ClockCircleOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import "tailwindcss/tailwind.css";
import SubmitModal from "components/TakeExam/SubmitModal";
import CloseModal from "components/TakeExam/CloseModal";

const Exam1 = () => {
   const { examId, submissionId } = useParams();
   const [examData, setExamData] = useState(null);
   const [timeLeft, setTimeLeft] = useState(0);
   const [selectedAnswers, setSelectedAnswers] = useState({});
   const [isBlackScreenVisible, setBlackScreenVisible] = useState(false);
   const [drawerVisible, setDrawerVisible] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
   const [outsideClickCount, setOutsideClickCount] = useState(0);
   const [modalVisible, setModalVisible] = useState(false);
   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
   const navigate = useNavigate();
   const questionRefs = useRef([]);
   const answeredQuestions = Object.keys(selectedAnswers).length;

   // URLs cho API
   const SUBMISSION_URL = `http://localhost:5000/api/submissions/${submissionId}`;
   const ANSWER_URL = `http://localhost:5000/api/submissions/${submissionId}/answer`;
   const FINISH_URL = `http://localhost:5000/api/submissions/${submissionId}/finish`;

   // Fetch dữ liệu bài thi từ API
   useEffect(() => {
      const fetchExamData = async () => {
         try {
            const response = await fetch(SUBMISSION_URL, {
               method: "GET",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });

            if (response.ok) {
               const submission = await response.json();
               console.log("Submission data loaded:", submission);

               if (!submission.questions || !Array.isArray(submission.questions)) {
                  throw new Error("Invalid or missing 'questions' field in submission data");
               }

               setExamData(submission);

               const validDuration = submission.duration ?? 0;
               console.log("Duration received:", validDuration);

               // Đặt thời gian ban đầu và bắt đầu đếm ngược
               setTimeLeft(validDuration * 60);
            } else {
               const error = await response.json();
               message.error(error.message || "Lỗi khi lấy dữ liệu bài thi!");
            }
         } catch (error) {
            console.error("Lỗi khi lấy dữ liệu bài thi:", error);
            message.error("Đã xảy ra lỗi trong quá trình lấy dữ liệu bài thi!");
         }
      };

      if (submissionId) {
         fetchExamData();
      } else {
         message.error("Không tìm thấy submissionId trong URL!");
         navigate(`/learner/TakeExam/${examId}`);
      }
   }, [submissionId, SUBMISSION_URL, navigate]);

   // UseEffect cho logic đếm ngược
   useEffect(() => {
      if (!timeLeft) return; // Chặn đếm ngược nếu thời gian chưa được khởi tạo

      const timer = setInterval(() => {
         setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
               clearInterval(timer); // Dừng đếm ngược khi hết thời gian
               message.warning("Thời gian làm bài đã hết! Bài thi sẽ tự động nộp.");
               handleFinish(); // Nộp bài tự động khi hết giờ
               return 0;
            }
            return prevTime - 1;
         });
      }, 1000); // Giảm thời gian mỗi giây

      // Dọn dẹp interval khi component bị hủy hoặc khi timeLeft thay đổi
      return () => clearInterval(timer);
   }, [timeLeft]); // Chỉ chạy lại khi `timeLeft` thay đổi


   useEffect(() => {
      const handleKeyDown = (event) => {
         if (event.key === "F12" || (event.ctrlKey && event.key === "c")) {
            event.preventDefault();
            message.error("Không được sử dụng phím tắt này!"); // Thay thế alert bằng message.error
         }
      };

      const handleContextMenu = (event) => {
         event.preventDefault();
         message.warning("Không được sao chép nội dung!"); // Thay thế alert bằng message.warning
      };

      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("contextmenu", handleContextMenu);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
         window.removeEventListener("contextmenu", handleContextMenu);
      };
   }, []);

   useEffect(() => {
      const handleVisibilityChange = () => {
         if (document.hidden) {
            setBlackScreenVisible(true); // Hiển thị lớp phủ đen khi chuyển tab
         } else {
            setBlackScreenVisible(false); // Xóa lớp phủ khi quay lại
         }
      };

      const handleWindowBlur = () => {
         setOutsideClickCount((prev) => {
            const newCount = prev + 1;
            message.warning(`Không được rời trang! Số lần: ${newCount}`);
            if (newCount >= 3) {
               setModalVisible(true); // Khóa bài thi nếu rời trang quá 3 lần
            }
            return newCount;
         });
         setBlackScreenVisible(true); // Hiển thị lớp phủ khi cửa sổ bị mờ
      };

      const handleWindowFocus = () => {
         setBlackScreenVisible(false); // Xóa lớp phủ khi quay lại cửa sổ
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("blur", handleWindowBlur);
      window.addEventListener("focus", handleWindowFocus);

      return () => {
         document.removeEventListener("visibilitychange", handleVisibilityChange);
         window.removeEventListener("blur", handleWindowBlur);
         window.removeEventListener("focus", handleWindowFocus);
      };
   }, []);

   // Định dạng thời gian
   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
   };

   // Xử lý lựa chọn câu trả lời
   const handleAnswerChange = async (questionId, value) => {
      // Kiểm tra questionId trước khi thực hiện hành động
      console.log("Selected questionId:", questionId); // Log ID của câu hỏi để kiểm tra

      if (!questionId) {
         console.error("Question ID is undefined");
         return;
      }

      // Tìm kiếm câu hỏi dựa vào question_id._id
      const questionWrapper = examData.questions.find(
         (q) => q.question_id._id === questionId
      );

      if (!questionWrapper) {
         console.error(`Question not found in examData: ${questionId}`);
         message.error("Không tìm thấy câu hỏi trong dữ liệu!");
         return;
      }

      const question = questionWrapper.question_id;

      // Cập nhật câu trả lời đã chọn vào state
      setSelectedAnswers((prevAnswers) => ({
         ...prevAnswers,
         [questionId]: value,
      }));

      try {
         const payload = {
            question_id: questionId, // Sử dụng đúng ID của câu hỏi
            selected_answer: value,
         };
         console.log("Payload gửi đi:", payload); // Log payload để kiểm tra

         const response = await fetch(ANSWER_URL, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(payload),
         });

         if (!response.ok) {
            const error = await response.json();
            message.error(error.message || "Không thể nộp câu trả lời!");
         }
      } catch (error) {
         console.error("Lỗi khi nộp câu trả lời:", error);
         message.error("Đã xảy ra lỗi trong quá trình nộp câu trả lời!");
      }
   };

   // Kết thúc bài thi
   // Ví dụ: xử lý khi kết thúc bài thi
   const handleFinish = async () => {
      try {
         const response = await fetch(FINISH_URL, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
         });

         if (response.ok) {
            const data = await response.json();
            message.success(`Nộp bài thành công! Điểm của bạn: ${data.submission.score || '0'}/10`);
            setTimeout(() => {
               navigate(`/learner/ViewExamResults/${submissionId}`);
            }, 500);
         } else {
            const error = await response.json();
            message.error(error.message || "Không thể nộp bài thi!");
         }
      } catch (error) {
         console.error("Lỗi khi nộp bài thi:", error);
         message.error("Đã xảy ra lỗi trong quá trình nộp bài thi!");
      }
   };

   if (!examData || !Array.isArray(examData.questions)) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Dữ liệu bài thi không hợp lệ hoặc đang tải...</div>
         </div>
      );
   }




   // Kiểm tra và render UI
   if (!examData || !Array.isArray(examData.questions)) {
      console.error("Invalid examData or questions is not an array:", examData);
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Dữ liệu bài thi không hợp lệ hoặc đang tải...</div>
         </div>
      );
   }

   const handleEndExam = () => {
      setModalVisible(false);
      message.error("Bài thi của bạn đã bị kết thúc vì nhấp ra ngoài quá nhiều lần!");
   };

   // Hàm mở Drawer
   const openDrawer = () => {
      setDrawerVisible(true);
   };

   // Hàm đóng Drawer
   const closeDrawer = () => {
      setDrawerVisible(false);
   };

   // Mở modal nộp bài
   const showModal = () => {
      setIsModalVisible(true);
   };

   // Đóng modal mà không nộp bài
   const handleCancel = () => {
      setIsModalVisible(false);
   };

   // Hiển thị modal xác nhận thoát bài thi
   const showCloseModal = () => setIsCloseModalVisible(true);

   // Xác nhận thoát khỏi bài thi và điều hướng về trang DashBoard
   const handleConfirmClose = () => {
      setIsCloseModalVisible(false);
      navigate("/learner/DashBoard");
   };

   // Đóng modal xác nhận thoát
   const handleCancelClose = () => setIsCloseModalVisible(false);

   // Điều hướng đến câu hỏi khi nhấn vào nút trong Drawer
   const scrollToQuestion = (index) => {
      setActiveQuestionIndex(index);
      questionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
   };

   return (
      <div className="min-h-screen bg-gray-100">
         {isBlackScreenVisible && (
            <div className="fixed inset-0 bg-black opacity-100 z-50"></div>
         )}
         <div className="w-full bg-white shadow-md py-3 px-4 md:px-8 flex items-center justify-between relative">
            <div className="flex items-center">
               <CloseOutlined
                  className="text-2xl cursor-pointer hover:text-red-500 transition duration-200"
                  onClick={() => setIsCloseModalVisible(true)}
               />
            </div>
            {/* Thay đổi thời gian thành thời gian làm bài đã được định dạng */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
               <ClockCircleOutlined className="text-2xl text-green-500" />
               {/* Hiển thị thời gian đếm ngược (timeLeft) */}
               <span className="text-2xl text-green-500 font-semibold">
                  {formatTime(timeLeft)}

               </span>
            </div>
            <div className="flex items-center space-x-4">
               <Button
                  shape="circle"
                  icon={<MenuOutlined />}
                  className="hidden md:flex hover:bg-gray-200 transition duration-200"
                  onClick={() => setDrawerVisible(true)}
               />
               <Button
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
                  onClick={showModal}
               >
                  Nộp bài
               </Button>
            </div>
         </div>


         <div className="flex justify-center my-10 px-4">
            <Card className="w-full max-w-[900px] rounded-lg shadow-lg">
               {/* Exam Info Section */}
               <div className="p-6 bg-gray-100 border-b border-gray-300">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-extrabold text-gray-800">{examData?.test_id?.title}</h2>
                     <div className="text-sm text-gray-500">
                        <span className="font-semibold">ID Bài Thi:</span> {examId}
                     </div>
                  </div>

                  <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                        <span className="text-lg font-medium text-gray-600">SmartPrep</span>
                     </div>
                     <div className="flex flex-col items-end space-y-1">
                        <span className="text-sm text-gray-500">
                           <strong>Thời gian:</strong> {Math.floor(timeLeft / 60)} phút
                        </span>
                        <span className="text-sm text-gray-500">
                           <strong>Câu hỏi:</strong> {examData?.questions.length} câu
                        </span>
                        <span className="text-sm text-gray-500">
                           <strong>Đã chọn:</strong> {answeredQuestions}/{examData?.questions.length} câu
                        </span>
                     </div>
                  </div>
               </div>

               {/* Questions Section */}
               <div className="p-6 bg-white">
                  {examData?.questions.map((questionWrapper, index) => {
                     const question = questionWrapper.question_id; // Truy cập thông tin câu hỏi
                     if (!question) {
                        console.error(`Không tìm thấy câu hỏi tại index: ${index}`, questionWrapper);
                        return (
                           <div key={index} className="text-red-500">
                              Lỗi: Không tìm thấy câu hỏi!
                           </div>
                        );
                     }

                     return (
                        <div key={question._id} ref={(el) => (questionRefs.current[index] = el)} className="mb-8">
                           <div className="font-semibold text-xl mb-4 text-gray-800">
                              {index + 1}. {question.question_text}
                           </div>
                           <Checkbox.Group
                              className="flex flex-col space-y-3"
                              onChange={(checkedValues) => handleAnswerChange(question._id, checkedValues)}
                              value={selectedAnswers[question._id] || []}
                           >
                              {question.options?.map((option, idx) => (
                                 <Checkbox key={idx} value={option}>
                                    <span className="font-medium">{String.fromCharCode(65 + idx)}.</span> {option}
                                 </Checkbox>
                              ))}
                           </Checkbox.Group>
                           {!selectedAnswers[question._id] && (
                              <span className="text-sm text-red-500 mt-2 block">Chưa chọn đáp án</span>
                           )}
                        </div>
                     );
                  })}
               </div>
            </Card>
         </div>


         <Drawer title="Danh sách câu hỏi" placement="right" onClose={closeDrawer} visible={drawerVisible} width={300}>
            <div className="grid grid-cols-5 gap-2">
               {examData.questions.map((question, index) => (
                  <Button
                     key={index}
                     className={`border-2 rounded-md ${selectedAnswers[question.id] ? "bg-blue-500" : "bg-white"}`}
                     onClick={() => scrollToQuestion(index)}
                  >
                     {index + 1}
                  </Button>
               ))}
            </div>
         </Drawer>

         <SubmitModal
            visible={isModalVisible}
            onConfirm={handleFinish}
            onCancel={handleCancel}
            examTitle={examData.title}
            totalQuestions={examData.questions.length}
            answeredQuestions={Object.keys(selectedAnswers).length}
         />
         <CloseModal
            visible={isCloseModalVisible}
            onConfirm={() => navigate(`/learner/TakeExam/${examId}`)}
            onCancel={() => setIsCloseModalVisible(false)}
         />

         <Modal
            title="Bài thi đã bị kết thúc"
            visible={modalVisible}
            onOk={handleEndExam}
            onCancel={() => setModalVisible(false)}
            okText="Kết thúc bài thi"
            cancelText="Hủy"
         >
            <p>Bạn đã nhấp ra ngoài quá nhiều lần. Bài thi sẽ bị kết thúc.</p>
         </Modal>
      </div>
   );
};

export default Exam1;
