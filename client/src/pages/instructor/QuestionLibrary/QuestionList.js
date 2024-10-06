// QuestionList.js
import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const QuestionList = ({ questions, onEdit, onDelete }) => {
  const [editedQuestion, setEditedQuestion] = useState(null);
  
  const handleEdit = (index) => {
    const questionToEdit = questions[index];
    setEditedQuestion({
      ...questionToEdit,
      index // Lưu index để cập nhật sau
    });
  };

  const handleUpdate = async () => {
    const response = await fetch(`/instructor/questions.json/${editedQuestion.index}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editedQuestion),
    });

    if (response.ok) {
      onEdit(); // Gọi lại hàm onEdit để cập nhật danh sách câu hỏi
      setEditedQuestion(null); // Đặt lại trạng thái
    }
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">{question.questionText}</h3>
            <div className="flex space-x-2">
              <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                <Edit />
                <span>Chỉnh sửa</span>
              </button>
              <button onClick={async () => {
                const response = await fetch(`/instructor/questions.json/${index}`, {
                  method: 'DELETE',
                });

                if (response.ok) {
                  onDelete(index); // Gọi lại hàm onDelete để cập nhật danh sách câu hỏi
                }
              }} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
                <Trash2 />
                <span>Xóa</span>
              </button>
            </div>
          </div>
          <ul className="list-disc pl-5 mt-2">
            {question.answers.map((answer, i) => (
              <li key={i} className={question.correctAnswers.includes(i) ? 'text-green-500' : ''}>
                {answer}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {editedQuestion && (
        <div>
          {/* Form để chỉnh sửa câu hỏi */}
          <input
            type="text"
            value={editedQuestion.questionText}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, questionText: e.target.value })}
          />
          {/* Thêm logic để cập nhật các câu trả lời */}
          <button onClick={handleUpdate}>Cập nhật</button>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
