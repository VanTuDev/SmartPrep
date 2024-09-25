import React, { useState } from 'react';

const AddQuestionForm = () => {
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]); // Tracks the indices of correct answers

  // Handle changing the answer text
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Add a new empty answer field
  const addAnswer = () => {
    setAnswers([...answers, ""]);
  };

  // Remove an answer from the list
  const removeAnswer = (index) => {
    const updatedAnswers = answers.filter((_, i) => i !== index);
    setAnswers(updatedAnswers);

    // Remove the correct answer if it is deleted
    setCorrectAnswers(correctAnswers.filter((i) => i !== index));

    // Adjust correct answers index if needed (shift indices)
    const updatedCorrectAnswers = correctAnswers
      .filter((i) => i !== index)
      .map((i) => (i > index ? i - 1 : i));
    setCorrectAnswers(updatedCorrectAnswers);
  };

  // Toggle the correct answer
  const toggleCorrectAnswer = (index) => {
    if (correctAnswers.includes(index)) {
      // Remove if already selected
      setCorrectAnswers(correctAnswers.filter((i) => i !== index));
    } else {
      // Add if not selected
      setCorrectAnswers([...correctAnswers, index]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-6">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b">
          <h2 className="text-xl font-semibold text-purple-700">Thêm câu hỏi vào thư viện</h2>
          <button className="text-gray-600 hover:text-purple-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7zM5 4h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          </button>
        </div>

        {/* Form Inputs */}
        <div className="flex space-x-4 py-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Danh mục"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nhóm câu hỏi"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            />
          </div>
        </div>

        {/* Question Input */}
        <div className="pb-4">
          <input
            type="text"
            placeholder="Nhập nội dung câu hỏi?"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Answer Inputs */}
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={correctAnswers.includes(index)}
              onChange={() => toggleCorrectAnswer(index)}
              className="mr-2"
            />
            <input
              type="text"
              value={answer}
              placeholder="Câu trả lời..."
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            />
            <button onClick={() => removeAnswer(index)} className="ml-2 text-red-500 hover:text-red-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.707a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ))}

        {/* Add new answer button */}
        <button
          onClick={addAnswer}
          className="text-purple-700 hover:text-purple-900 text-sm flex items-center"
        >
          Thêm câu trả lời
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <button className="flex items-center text-sm text-purple-700 hover:text-purple-900">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h18m-9 9V3" />
            </svg>
            Tải file lên
          </button>
          <div className="flex space-x-2">
            <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 focus:outline-none">
              Lưu câu hỏi
            </button>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-800 focus:outline-none">
              Thêm câu hỏi mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionForm;
