import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import axios from 'axios';

const AddQuestion = () => {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_type: 'multiple-choice',
    option: ['', '', '', ''], // Bắt đầu với 4 lựa chọn trống
    correct_answers: [], // Lưu đáp án đúng dưới dạng nội dung
    category: '',
    group: ''
  });

  // Hàm để lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error('Unexpected data format', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Hàm để lấy danh sách nhóm từ API
  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        console.error('Unexpected data format', data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, []);

  // Hàm để thêm câu hỏi mới
  const handleAddQuestion = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newQuestion),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions([...questions, data.question]); // Thêm câu hỏi mới vào danh sách
        toast.success('Câu hỏi đã được thêm thành công!');
        // Reset form
        setNewQuestion({
          question_text: '',
          question_type: 'multiple-choice',
          option: ['', '', '', ''],
          correct_answers: [], // Reset đáp án đúng
          category: '',
          group: ''
        });
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Đã xảy ra lỗi khi thêm câu hỏi.');
    }
  };

  const handleCorrectAnswerChange = (index) => {
    setNewQuestion((prev) => {
      const correct_answers = [...prev.correct_answers];
      const selectedOption = prev.option[index]; // Lấy nội dung đáp án được chọn

      if (correct_answers.includes(selectedOption)) {
        // Nếu đáp án đã tồn tại, xóa khỏi danh sách
        return { ...prev, correct_answers: correct_answers.filter((answer) => answer !== selectedOption) };
      } else {
        // Nếu chưa tồn tại, thêm vào danh sách
        return { ...prev, correct_answers: [...correct_answers, selectedOption] };
      }
    });
  };

  // Hàm để thêm nhiều câu hỏi từ file Excel
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Gửi file lên server thông qua API
      const response = await axios.post('http://localhost:5000/api/questions/upload-excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success('Đã thêm tất cả câu hỏi từ file Excel!');
        setQuestions((prev) => [...prev, ...response.data.questions]);
      } else {
        toast.error(`Có lỗi xảy ra: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Lỗi khi tải file lên: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="bg-white p-8 my-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Thêm câu hỏi mới</h3>
        <div>
          <label className="block mb-2">Nội dung câu hỏi:</label>
          <input
            type="text"
            value={newQuestion.question_text}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          />

          <label className="block mb-2">Loại câu hỏi:</label>
          <select
            value={newQuestion.question_type}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_type: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="essay">Essay</option>
          </select>

          <label className="block mb-2">Danh mục:</label>
          <select
            value={newQuestion.category}
            onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>

          <label className="block mb-2">Nhóm:</label>
          <select
            value={newQuestion.group}
            onChange={(e) => setNewQuestion({ ...newQuestion, group: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
          >
            <option value="">Chọn nhóm</option>
            {groups.map((group) => (
              <option key={group._id} value={group._id}>{group.name}</option>
            ))}
          </select>

          {newQuestion.question_type === 'multiple-choice' && (
            <>
              <label className="block mb-2">Lựa chọn:</label>
              {newQuestion.option.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...newQuestion.option];
                      updatedOptions[index] = e.target.value;
                      setNewQuestion({ ...newQuestion, option: updatedOptions });
                    }}
                    className="border border-gray-300 rounded-lg p-2 flex-1"
                    placeholder={`Lựa chọn ${String.fromCharCode(65 + index)}`} // A, B, C, D cho lựa chọn
                  />
                  <input
                    type="checkbox"
                    checked={newQuestion.correct_answers.includes(option)} // Kiểm tra nội dung đáp án
                    onChange={() => handleCorrectAnswerChange(index)}
                    className="ml-2"
                  />
                  <label className="ml-2">Đáp án đúng</label>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setNewQuestion({ ...newQuestion, option: [...newQuestion.option, ''] })}
                className="text-blue-500 mb-4"
              >
                Thêm lựa chọn
              </button>
            </>
          )}

          <label className="block mb-2 mt-4">Tải lên file Excel:</label>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />

          <button
            onClick={handleAddQuestion}
            className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4"
          >
            Lưu câu hỏi mới
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;
