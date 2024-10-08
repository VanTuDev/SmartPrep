import React, { useState, useEffect, useRef } from "react";
import { Button, Card, Radio, Drawer, message, Modal } from "antd";
import { ClockCircleOutlined, CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import SubmitModal from "components/TakeExam/SubmitModal";
import CloseModal from "components/TakeExam/CloseModal";

const Exam1 = () => {
   const mockData = {
      examTitle: "Bài kiểm tra Toán lớp 10",
      examId: "XYZ1234",
      questionCount: 10,
      duration: 30, // Thời gian làm bài (phút)
      user: {
         name: "Tuấn Kiệt",
         email: "tuankiet4hbt@gmail.com",
         avatar: "",
         attemptTime: "15:49 - 06/10/2024",
         action: "Làm bài",
      },
      questions: [
         {
            id: 1,
            text: "Tính giá trị của biểu thức: 5 + 3 x 2 - 8 ÷ 4?",
            options: [
               { value: "A", text: "8" },
               { value: "B", text: "10" },
               { value: "C", text: "7" },
               { value: "D", text: "6" },
            ],
            correct_answers: ["B"],
            points: 1,
         },
         {
            id: 2,
            text: "Kết quả của 2^3 là gì?",
            options: [
               { value: "A", text: "8" },
               { value: "B", text: "6" },
               { value: "C", text: "10" },
               { value: "D", text: "4" },
            ],
            correct_answers: ["A"],
            points: 1,
         },
         {
            id: 3,
            text: "Giá trị nhỏ nhất của hàm số y = x^2 - 4x + 4 là bao nhiêu?",
            options: [
               { value: "A", text: "4" },
               { value: "B", text: "2" },
               { value: "C", text: "0" },
               { value: "D", text: "1" },
            ],
            correct_answers: ["C"],
            points: 1,
         },
         {
            id: 4,
            text: "Đạo hàm của hàm số y = 3x^2 + 2x - 1 là gì?",
            options: [
               { value: "A", text: "6x + 2" },
               { value: "B", text: "6x" },
               { value: "C", text: "2" },
               { value: "D", text: "3x^2" },
            ],
            correct_answers: ["A"],
            points: 1,
         },
         {
            id: 5,
            text: "Phương trình nào sau đây là phương trình bậc hai?",
            options: [
               { value: "A", text: "x + 2 = 0" },
               { value: "B", text: "x^2 - 3x + 2 = 0" },
               { value: "C", text: "3x - 5 = 0" },
               { value: "D", text: "2x^3 + 3x^2 - x = 0" },
            ],
            correct_answers: ["B"],
            points: 1,
         },
         {
            id: 6,
            text: "Cho hàm số y = x^2 + 3x + 2, đạo hàm của nó là gì?",
            options: [
               { value: "A", text: "2x + 3" },
               { value: "B", text: "2x" },
               { value: "C", text: "3" },
               { value: "D", text: "x + 2" },
            ],
            correct_answers: ["A"],
            points: 1,
         },
         {
            id: 7,
            text: "Tìm nghiệm của phương trình x^2 - 4x + 4 = 0?",
            options: [
               { value: "A", text: "x = 2" },
               { value: "B", text: "x = 4" },
               { value: "C", text: "x = 0" },
               { value: "D", text: "x = 1" },
            ],
            correct_answers: ["A"],
            points: 1,
         },
         {
            id: 8,
            text: "Giá trị của biểu thức sin^2(30) + cos^2(30) là gì?",
            options: [
               { value: "A", text: "0" },
               { value: "B", text: "1" },
               { value: "C", text: "2" },
               { value: "D", text: "0.5" },
            ],
            correct_answers: ["B"],
            points: 1,
         },
         {
            id: 9,
            text: "Kết quả của phép nhân ma trận sau [1 2] x [3 4] là gì?",
            options: [
               { value: "A", text: "7" },
               { value: "B", text: "10" },
               { value: "C", text: "5" },
               { value: "D", text: "4" },
            ],
            correct_answers: ["B"],
            points: 1,
         },
         {
            id: 10,
            text: "Tổng của chuỗi số học 1 + 2 + 3 + ... + 100 là bao nhiêu?",
            options: [
               { value: "A", text: "5050" },
               { value: "B", text: "100" },
               { value: "C", text: "500" },
               { value: "D", text: "2500" },
            ],
            correct_answers: ["A"],
            points: 1,
         },
      ],
   };


   // Khởi tạo thời gian từ mockData (đơn vị giây)
   const [timeLeft, setTimeLeft] = useState(mockData.duration * 60);
   const [selectedAnswers, setSelectedAnswers] = useState({});
   const [drawerVisible, setDrawerVisible] = useState(false);
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
   const [isCloseModalVisible, setIsCloseModalVisible] = useState(false);
   const [outsideClickCount, setOutsideClickCount] = useState(0);
   const [modalVisible, setModalVisible] = useState(false);
   const navigate = useNavigate();


   const questionRefs = useRef([]);

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
      const handleWindowBlur = () => {
         setOutsideClickCount((prevCount) => {
            const newCount = prevCount + 1;
            message.warning(`Không được nhấp ra khỏi trang! Số lần: ${newCount}`);
            if (newCount >= 3) {
               setModalVisible(true);
            }
            return newCount;
         });
      };

      window.addEventListener("blur", handleWindowBlur);

      return () => {
         window.removeEventListener("blur", handleWindowBlur);
      };
   }, []);

   const handleEndExam = () => {
      setModalVisible(false);
      message.error("Bài thi của bạn đã bị kết thúc vì nhấp ra ngoài quá nhiều lần!");
   };

   // Cập nhật thời gian đếm ngược
   useEffect(() => {
      if (timeLeft === 0) return; // Dừng đếm ngược khi hết thời gian

      const timer = setInterval(() => {
         setTimeLeft((prevTime) => {
            const newTime = prevTime > 0 ? prevTime - 1 : 0;
            return newTime;
         });
      }, 1000);

      return () => clearInterval(timer); // Xóa bộ đếm khi component bị hủy
   }, [timeLeft]);

   // Định dạng thời gian thành phút:giây
   const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
   };

   // Hàm xử lý lựa chọn câu trả lời
   const handleAnswerChange = (questionId, value) => {
      setSelectedAnswers({ ...selectedAnswers, [questionId]: value });
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

   // Xác nhận nộp bài và đóng modal
   const handleOk = () => {
      setIsModalVisible(false);
      message.success("Bạn đã nộp bài thành công!");
   };

   // Đóng modal mà không nộp bài
   const handleCancel = () => {
      setIsModalVisible(false);
   };

   // Hiển thị modal xác nhận thoát bài thi
   const showCloseModal = () => setIsCloseModalVisible(true);

   // Xác nhận thoát khỏi bài thi và điều hướng về trang QuizCard
   const handleConfirmClose = () => {
      setIsCloseModalVisible(false);
      navigate("/learner/TakeExam");
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
         {/* Header */}
         <div className="w-full bg-white shadow-md py-3 px-4 md:px-8 flex items-center justify-between relative">
            <div className="flex items-center">
               <CloseOutlined className="text-2xl cursor-pointer hover:text-red-500 transition duration-200" onClick={showCloseModal} />
            </div>
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
               <ClockCircleOutlined className="text-2xl text-green-500" />
               <span className="text-2xl text-green-500 font-semibold">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex items-center space-x-4">
               <Button
                  shape="circle"
                  icon={<MenuOutlined />}
                  className="hidden md:flex hover:bg-gray-200 transition duration-200"
                  onClick={openDrawer} // Mở Drawer khi nhấn vào
               />

               {/* Số câu hỏi và Submit Button */}
               <div className="text-lg hidden md:block flex items-center">
                  <span className="text-yellow-500 text-2xl font-bold">{Object.keys(selectedAnswers).length}</span>
                  <span className="mx-1 text-lg">/</span>
                  <span>{mockData.questionCount}</span>
               </div>
               <Button type="primary" className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700" onClick={showModal}>
                  Nộp bài
               </Button>
            </div>
         </div>

         {/* Drawer chứa danh sách câu hỏi */}
         <Drawer title="Danh sách câu hỏi" placement="right" onClose={closeDrawer} visible={drawerVisible} width={300}>
            <div className="grid grid-cols-5 gap-2">
               {mockData.questions.map((question, index) => (
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
            onConfirm={handleOk}
            onCancel={handleCancel}
            examTitle={mockData.examTitle}
            totalQuestions={mockData.questionCount}
            answeredQuestions={Object.keys(selectedAnswers).length}
         />

         <CloseModal visible={isCloseModalVisible} onConfirm={handleConfirmClose} onCancel={handleCancelClose} />

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

         {/* Exam Card */}
         <div className="flex justify-center my-10">
            <Card className="w-full max-w-[900px] rounded-lg shadow-lg">
               {/* Exam Info Section */}
               <div className="p-6 bg-gray-200 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-bold text-gray-700">{mockData.examTitle}</h2>
                     <div className="text-sm text-gray-500">
                        ID: <span className="font-semibold">{mockData.examId}</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-center">
                     <div className="flex items-center space-x-2">
                        <span className="text-gray-500">SmartPrep</span>
                     </div>
                     <div className="flex flex-col items-end space-y-2">
                        <span className="text-sm text-gray-500">Thời gian: {mockData.duration} phút</span>
                        <p className="text-sm text-gray-500">Câu hỏi: {mockData.questionCount} câu</p>
                     </div>
                  </div>

                  {/* User Info Section */}
                  <div className="flex items-center space-x-4 mt-4">
                     <img src={mockData.user.avatar} alt="User" className="w-12 h-12 rounded-full" />
                     <div>
                        <span className="font-semibold">{mockData.user.name}</span>
                        <div className="text-sm text-gray-500">{mockData.user.email}</div>
                     </div>
                     <div className="ml-auto text-right text-sm text-gray-500 flex justify-end w-full">
                        {mockData.user.attemptTime}
                        <span className="ml-2 text-blue-600 font-medium">{mockData.user.action}</span>
                     </div>
                  </div>
               </div>

               {/* Questions Section */}
               <div className="p-6">
                  {mockData.questions.map((question, index) => (
                     <div
                        key={index}
                        ref={(el) => (questionRefs.current[index] = el)}
                        className="mb-6">
                        <div className="font-semibold text-lg mb-2">
                           {index + 1}: {question.text}
                        </div>
                        <Radio.Group className="flex flex-col space-y-2" onChange={(e) => handleAnswerChange(question.id, e.target.value)}>
                           {question.options.map((option, idx) => (
                              <Radio key={idx} value={option.value}>
                                 <span className="font-medium">{option.value}. </span>
                                 {option.text}
                              </Radio>
                           ))}
                        </Radio.Group>
                     </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
   );
};

export default Exam1;