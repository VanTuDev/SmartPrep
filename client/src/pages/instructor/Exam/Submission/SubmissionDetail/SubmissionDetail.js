import React, { useState, useEffect, useRef } from 'react';
import { Avatar, Drawer, Typography } from "antd";
import { Download, RefreshCcw } from "lucide-react";
import 'styles/instructor/SubmissionDetail.css';

const { Text } = Typography;

function SubmissionDetail({ visible, onClose, student }) {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;
  const questionContainerRef = useRef(null);

  useEffect(() => {
    if (questionContainerRef.current) {
      questionContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  if (!student) return null;

  // Xác định các câu hỏi trên mỗi trang
  const startIndex = currentPage * questionsPerPage;
  const currentQuestions = student.questions.slice(startIndex, startIndex + questionsPerPage);

  return (
    <Drawer
      title={
        <div className="drawer-header">
          <div className="title">Test Result</div>
          {/* <div className="flex items-center space-x-4">
            <button className="flex flex-col items-center">
              <Download />
              <div className="text-xs">Download</div>
            </button>
            <button className="flex flex-col items-center">
              <RefreshCcw />
              <div className="text-xs">Rescore</div>
            </button>
            <button className="button-outlined-custom">Score confirmed</button>
          </div> */}
        </div>
      }
      placement="right"
      onClose={onClose}
      visible={visible}
      width="100vw"
    >
      <div className="bg-gray-100 min-h-screen p-6">
        {/* Hiển thị thông tin học sinh */}
        <div className="w-full bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Avatar className="mx-3" size="large" src={<img src={student.imgSrc} alt="avatar" />} />
            <div>
              <div className="font-semibold">{student.studentName}</div>
              <div className="text-gray-500">{student.email}</div>
            </div>
          </div>
        </div>

        {/* Hiển thị câu hỏi và các tùy chọn */}
        <div className="w-full bg-white shadow-lg rounded-lg p-6" ref={questionContainerRef}>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="text-md font-medium mb-2">
                  Câu {startIndex + index + 1}: {question.question_text}
                </div>
                <div className="flex flex-col space-y-2">
                  {question.options.map((option, i) => (
                    <div
                      key={i}
                      className={`p-2 border rounded-md flex items-center space-x-2 ${
                        question.answer === option
                          ? question.correct_answers.includes(option)
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          : ""
                      }`}
                    >
                      <input type="radio" checked={question.answer === option} readOnly />
                      <label>{String.fromCharCode(65 + i)}. {option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div>Không có câu hỏi</div>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export default SubmissionDetail;
