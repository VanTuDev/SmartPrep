import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react'; // Ensure these imports are present
import { toast } from 'react-toastify'; // For toast notifications
import * as XLSX from 'xlsx';
import 'react-toastify/dist/ReactToastify.css'; // For toast CSS

const AddQuestionForm = ({ onClose, onRefresh, existingQuestion }) => {
  const [questions, setQuestions] = useState([
    {
      category: '',
      group: null, // Default to null for group
      questionText: '',
      answers: [''], // Start with one empty answer
      correctAnswers: [], // Array to hold indices of correct answers
    },
  ]);
  const [categories, setCategories] = useState([]); // State to hold categories

  // Fetch categories from the server
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setCategories(data); // Update categories state
      } else {
        console.error('Unexpected data format', data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the form is opened

    // If there's an existing question, populate the form with its data
    if (existingQuestion) {
      setQuestions([existingQuestion]);
    }
  }, [existingQuestion]);

  // Handle input changes for questions
  const handleInputChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  // Handle answer changes
  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers[answerIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new answer
  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers.push(''); // Add a new answer
    setQuestions(updatedQuestions);
  };

  // Remove an answer
  const removeAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answers = updatedQuestions[questionIndex].answers.filter(
      (_, i) => i !== answerIndex
    );

    // Remove the correct answer if it is deleted
    updatedQuestions[questionIndex].correctAnswers = updatedQuestions[questionIndex].correctAnswers
      .filter((i) => i !== answerIndex)
      .map((i) => (i > answerIndex ? i - 1 : i));

    setQuestions(updatedQuestions);
  };

  // Toggle correct answer
  const toggleCorrectAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    const correctAnswers = updatedQuestions[questionIndex].correctAnswers;

    if (correctAnswers.includes(answerIndex)) {
      // Remove the answer index if it already exists
      updatedQuestions[questionIndex].correctAnswers = correctAnswers.filter((i) => i !== answerIndex);
    } else {
      // Add the answer index to the correctAnswers array
      updatedQuestions[questionIndex].correctAnswers = [...correctAnswers, answerIndex];
    }
    setQuestions(updatedQuestions);
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const processedQuestions = data.map((row) => {
        const questionText = row[0];
        const answers = row.slice(1, row.length - 1);
        const correctAnswerLabel = row[row.length - 1];

        const correctAnswers = correctAnswerLabel
          ? correctAnswerLabel.split(',').map((label) => label.trim().toUpperCase().charCodeAt(0) - 65).filter(index => index >= 0) // Convert multiple correct answers to indices
          : [];

        return {
          category: '', // Set to empty, will be updated later
          group: null,
          questionText,
          answers,
          correctAnswers,
        };
      });

      setQuestions(processedQuestions);
    };

    reader.readAsBinaryString(file);
  };

  // Save questions to the server
  const handleSaveQuestions = async () => {
    // Check necessary conditions
    for (const question of questions) {
      if (!question.questionText.trim()) {
        alert('Vui lòng nhập nội dung câu hỏi.');
        return;
      }
      if (!question.category.trim()) {
        alert('Vui lòng chọn danh mục cho câu hỏi.');
        return;
      }

      const nonEmptyAnswers = question.answers.filter(answer => answer.trim());

      if (nonEmptyAnswers.length < 1) {
        alert('Vui lòng nhập ít nhất một câu trả lời.');
        return;
      }

      if (question.correctAnswers.length === 0) {
        alert('Vui lòng chọn ít nhất một câu trả lời đúng.');
        return;
      }
    }

    try {
      const formattedQuestions = questions.map(question => ({
        category: question.category, // Ensure category is ObjectId
        group: question.group || null, // Ensure default is null
        question_text: question.questionText,
        question_type: 'multiple-choice', // or 'essay' depending on requirements
        option: question.answers,
        correct_answers: question.correctAnswers,
        created_by: localStorage.getItem('userId'), // ID of the creator
      }));

      const response = await fetch('http://localhost:5000/instructor/questions.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedQuestions), // Send formatted data
      });

      if (response.ok) {
        toast.success('Lưu câu hỏi thành công!'); // Display success message
        onRefresh(); // Update the question list
        onClose(); // Close the form
      } else {
        const errorData = await response.json(); // Get error data from response
        console.error('Error saving question:', errorData);
        toast.error('Lưu câu hỏi thất bại: ' + errorData.error); // Show detailed error message
      }
    } catch (error) {
      console.error('Lỗi khi lưu câu hỏi: ', error);
      toast.error('Đã xảy ra lỗi khi lưu câu hỏi.'); // Show generic error message
    }
  };

  return (
    <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg max-h-screen overflow-y-auto">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-semibold text-purple-700">{existingQuestion ? 'Chỉnh sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
        <button className="text-gray-600 hover:text-purple-600" onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="overflow-y-auto w-full max-h-[70vh]">
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-6 me-4">
            <h3 className="font-semibold mb-2 text-lg">Câu {questionIndex + 1}</h3>

            <div className="flex space-x-4 py-4">
              <div className="flex-1">
                <select
                  value={question.category}
                  onChange={(e) => handleInputChange(questionIndex, 'category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Nhóm câu hỏi"
                  value={question.group}
                  onChange={(e) => handleInputChange(questionIndex, 'group', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                />
              </div>
            </div>

            <div className="pb-4">
              <input
                type="text"
                placeholder="Nhập nội dung câu hỏi?"
                value={question.questionText}
                onChange={(e) => handleInputChange(questionIndex, 'questionText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
              />
            </div>

            {question.answers.map((answer, answerIndex) => (
              <div key={answerIndex} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={question.correctAnswers.includes(answerIndex)}
                  onChange={() => toggleCorrectAnswer(questionIndex, answerIndex)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={answer}
                  placeholder="Câu trả lời..."
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                />
                <button onClick={() => removeAnswer(questionIndex, answerIndex)} className="ml-2 text-red-500 hover:text-red-700">
                  <Trash2 />
                </button>
              </div>
            ))}

            <button
              onClick={() => addAnswer(questionIndex)}
              className="text-purple-700 hover:text-purple-900 text-sm flex items-center"
            >
              Thêm câu trả lời
              <Plus />
            </button>
            <hr className="my-4 p-2" />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <label className="flex items-center text-sm text-purple-700 hover:text-purple-900 cursor-pointer">
          <Plus />
          Tải file lên
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
        <div className="flex space-x-2">
          <button
            className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 focus:outline-none"
            onClick={handleSaveQuestions} // Gọi hàm lưu câu hỏi
          >
            {existingQuestion ? 'Lưu chỉnh sửa' : 'Lưu câu hỏi'}
          </button>
          <button onClick={AddQuestionForm} className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 focus:outline-none">
            <p className="flex text-sm items-center">Thêm câu hỏi <Plus /></p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionForm;
