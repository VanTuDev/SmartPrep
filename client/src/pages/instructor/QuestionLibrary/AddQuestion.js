import React, { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react'; // Ensure these imports are present
import { toast } from 'react-toastify'; // For toast notifications
import * as XLSX from 'xlsx';
import 'react-toastify/dist/ReactToastify.css'; // For toast CSS

const AddQuestionForm = ({ onClose, onRefresh, existingQuestion }) => {
  const [questions, setQuestions] = useState([{
    category: '',
    group: null, // Default to null for group
    question_text: '',
    option: [''], // Start with one empty answer
    correct_answers: [], // Array to hold indices of correct answers
  }]);

  const [categories, setCategories] = useState([]); // State to hold categories
  const [groups, setGroups] = useState([]); // State to hold groups

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

  // Fetch groups from the server
  const fetchGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/groups', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setGroups(data); // Update groups state
      } else {
        console.error('Unexpected data format', data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the form is opened
    fetchGroups(); // Fetch groups when the form is opened

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
    updatedQuestions[questionIndex].option[answerIndex] = value; // Updated to option instead of answers
    setQuestions(updatedQuestions);
  };

  // Add a new answer
  const addAnswer = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].option.push(''); // Add a new answer
    setQuestions(updatedQuestions);
  };

  // Remove an answer
  const removeAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].option = updatedQuestions[questionIndex].option.filter(
      (_, i) => i !== answerIndex
    );

    // Remove the correct answer if it is deleted
    updatedQuestions[questionIndex].correct_answers = updatedQuestions[questionIndex].correct_answers
      .filter((i) => i !== answerIndex)
      .map((i) => (i > answerIndex ? i - 1 : i));

    setQuestions(updatedQuestions);
  };

  // Toggle correct answer
  const toggleCorrectAnswer = (questionIndex, answerIndex) => {
    const updatedQuestions = [...questions];
    const correctAnswers = updatedQuestions[questionIndex].correct_answers;

    if (correctAnswers.includes(answerIndex)) {
      // Remove the answer index if it already exists
      updatedQuestions[questionIndex].correct_answers = correctAnswers.filter((i) => i !== answerIndex);
    } else {
      // Add the answer index to the correctAnswers array
      updatedQuestions[questionIndex].correct_answers = [...correctAnswers, answerIndex];
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

        const correct_answers = correctAnswerLabel
          ? correctAnswerLabel.split(',').map((label) => label.trim().toUpperCase().charCodeAt(0) - 65).filter(index => index >= 0) // Convert multiple correct answers to indices
          : [];

        return {
          category: '', // Set to empty, will be updated later
          group: null,
          question_text: questionText,
          option: answers,
          correct_answers,
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
      if (!question.question_text.trim()) {
        alert('Vui lòng nhập nội dung câu hỏi.');
        return;
      }
      if (!question.category.trim()) {
        alert('Vui lòng chọn danh mục cho câu hỏi.');
        return;
      }

      const nonEmptyAnswers = question.option.filter(answer => answer.trim());

      if (nonEmptyAnswers.length < 1) {
        alert('Vui lòng nhập ít nhất một câu trả lời.');
        return;
      }

      if (question.correct_answers.length === 0) {
        alert('Vui lòng chọn ít nhất một câu trả lời đúng.');
        return;
      }
    }

    try {
      const formattedQuestions = questions.map(question => ({
        category: question.category, // Ensure category is ObjectId
        group: question.group || null, // Ensure default is null
        question_text: question.question_text, // Corrected field name
        question_type: 'multiple-choice', // or 'essay' depending on requirements
        option: question.option, // Corrected field name
        correct_answers: question.correct_answers,
        created_by: localStorage.getItem('userId'), // ID of the creator
      }));

      const response = await fetch('http://localhost:5000/instructor/questions', { // Updated endpoint
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
              {/* Sellect category */}
              <div className="flex-1">
                <select
                  value={question.category}
                  onChange={(e) => handleInputChange(questionIndex, 'category', e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sellect group  */}
              <div className="flex-1">
                <select
                  value={question.group || ''}
                  onChange={(e) => handleInputChange(questionIndex, 'group', e.target.value)}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Chọn nhóm</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <textarea
                value={question.question_text} // Corrected field name
                onChange={(e) => handleInputChange(questionIndex, 'question_text', e.target.value)} // Corrected field name
                placeholder="Nhập nội dung câu hỏi"
                className="border rounded p-2 w-full"
                rows={3}
              />
            </div>

            {question.option.map((answer, answerIndex) => (
              <div key={answerIndex} className="flex items-center mb-2">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => handleAnswerChange(questionIndex, answerIndex, e.target.value)}
                  placeholder={`Câu trả lời ${String.fromCharCode(65 + answerIndex)}`}
                  className="border rounded p-2 flex-1"
                />
                <button type="button" onClick={() => removeAnswer(questionIndex, answerIndex)} className="ml-2">
                  <Trash2 className="text-red-500" />
                </button>
                <input
                  type="checkbox"
                  checked={question.correct_answers.includes(answerIndex)}
                  onChange={() => toggleCorrectAnswer(questionIndex, answerIndex)}
                  className="ml-2"
                />

              </div>
            ))}

            <button
              type="button"
              onClick={() => addAnswer(questionIndex)}
              className="flex items-center text-purple-600 mt-2"
            >
              <Plus className="mr-1" /> Thêm câu trả lời
            </button>
          </div>
        ))}
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mt-4" />
      </div>
      <div className="flex justify-end mt-6">
        <button onClick={handleSaveQuestions} className="bg-purple-600 text-white rounded px-4 py-2">
          Lưu câu hỏi
        </button>
      </div>
    </div>
  );
};

export default AddQuestionForm;
