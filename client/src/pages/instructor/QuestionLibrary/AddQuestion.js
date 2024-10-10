import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AddQuestion = ({ onClose, onRefresh }) => {
  const [questionsList, setQuestionsList] = useState([
    {
      question_text: '',
      question_type: 'multiple-choice',
      option: ['', '', '', ''],
      correct_answers: [],
      category: '',
      group: ''
    }
  ]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);

  // Lấy danh sách danh mục từ API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Lấy danh sách nhóm từ API
  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchGroups();
  }, []);

  // Thêm một câu hỏi mới vào danh sách hiển thị
  const handleAddQuestion = () => {
    const newQuestion = {
      question_text: '',
      question_type: 'multiple-choice',
      option: ['', '', '', ''],
      correct_answers: [],
      category: '',
      group: ''
    };
    setQuestionsList([...questionsList, newQuestion]);
    toast.success('Đã thêm một câu hỏi mới vào danh sách!');
  };

  // Cập nhật giá trị của từng trường câu hỏi
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[index][field] = value;
    setQuestionsList(updatedQuestions);
  };

  // Cập nhật lựa chọn cho từng câu hỏi
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions[qIndex].option[oIndex] = value;
    setQuestionsList(updatedQuestions);
  };

  // Cập nhật đáp án đúng của từng câu hỏi
  const handleCorrectAnswerChange = (qIndex, option) => {
    const updatedQuestions = [...questionsList];
    const correctAnswers = updatedQuestions[qIndex].correct_answers;

    if (correctAnswers.includes(option)) {
      updatedQuestions[qIndex].correct_answers = correctAnswers.filter((answer) => answer !== option);
    } else {
      updatedQuestions[qIndex].correct_answers.push(option);
    }

    setQuestionsList(updatedQuestions);
  };

  // Xóa một câu hỏi khỏi danh sách
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = [...questionsList];
    updatedQuestions.splice(index, 1); // Xóa câu hỏi tại vị trí được chỉ định
    setQuestionsList(updatedQuestions);
    toast.info(`Đã xóa câu hỏi ${index + 1}`);
  };

  // Lưu tất cả câu hỏi vào cơ sở dữ liệu
  const handleSaveAllQuestions = async () => {
    try {
      const formattedQuestions = questionsList.map((question) => ({
        ...question,
        options: question.option.filter(opt => opt.trim() !== "") // Loại bỏ các lựa chọn trống
      }));

      const response = await axios.post('http://localhost:5000/api/questions/create/multiple', formattedQuestions, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        setQuestionsList([
          {
            question_text: '',
            question_type: 'multiple-choice',
            option: ['', '', '', ''],
            correct_answers: [],
            category: '',
            group: ''
          }
        ]);
        toast.success('Đã lưu tất cả các câu hỏi thành công!');
        onRefresh(); // Cập nhật danh sách câu hỏi sau khi thêm mới
        onClose(); // Đóng modal
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi khi thêm nhiều câu hỏi.');
    }
  };

  // Tải file Excel và đọc dữ liệu để thêm câu hỏi
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Xử lý dữ liệu từ file Excel và thêm vào danh sách câu hỏi
      const newQuestions = jsonData.map((row) => ({
        question_text: row['Question Text'] || '',
        question_type: 'multiple-choice',
        option: [
          row['Option A'] || '',
          row['Option B'] || '',
          row['Option C'] || '',
          row['Option D'] || ''
        ],
        correct_answers: row['Correct Answers'] ? [row['Correct Answers']] : [],
        category: '',
        group: ''
      }));

      setQuestionsList((prevQuestions) => [...prevQuestions, ...newQuestions]);
      toast.success('Đã thêm câu hỏi từ file Excel vào danh sách!');
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 my-4 rounded-lg shadow-lg max-w-3xl w-full">
        <h3 className="text-xl font-semibold mb-4">Thêm câu hỏi mới</h3>

        {/* Thêm div chứa danh sách câu hỏi với tính năng cuộn */}
        <div className="max-h-96 overflow-y-auto mb-4">
          {questionsList.map((question, index) => (
            <div key={index} className="border p-4 mb-4 rounded-lg relative">
              <h4 className="text-lg font-semibold mb-2">Câu hỏi {index + 1}</h4>
              <button onClick={() => handleRemoveQuestion(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                X
              </button>

              <label className="block mb-2">Nội dung câu hỏi:</label>
              <input
                type="text"
                value={question.question_text}
                onChange={(e) => handleQuestionChange(index, 'question_text', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              />

              <label className="block mb-2">Danh mục:</label>
              <select
                value={question.category}
                onChange={(e) => handleQuestionChange(index, 'category', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>

              <label className="block mb-2">Nhóm:</label>
              <select
                value={question.group}
                onChange={(e) => handleQuestionChange(index, 'group', e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              >
                <option value="">Chọn nhóm</option>
                {groups.map((group) => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>

              {question.question_type === 'multiple-choice' && (
                <>
                  <label className="block mb-2">Lựa chọn:</label>
                  {question.option.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mb-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, oIndex, e.target.value)}
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                        placeholder={`Lựa chọn ${String.fromCharCode(65 + oIndex)}`}
                      />
                      <input
                        type="checkbox"
                        checked={question.correct_answers.includes(option)}
                        onChange={() => handleCorrectAnswerChange(index, option)}
                        className="ml-2"
                      />
                      <label className="ml-2">Đáp án đúng</label>
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-7">
          <button onClick={handleAddQuestion} className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4">Thêm câu hỏi mới</button>
          <button onClick={handleSaveAllQuestions} className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4">Lưu tất cả câu hỏi</button>
        </div>

        <label className="block mb-2 mt-4">Tải lên file Excel:</label>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
      </div>
    </div>
  );
};

export default AddQuestion;
