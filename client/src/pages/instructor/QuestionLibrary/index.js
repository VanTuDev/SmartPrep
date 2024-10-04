// QuestionLibrary.js
import React, { useState, useEffect } from 'react';
import QuestionLibraryTabs from './LibraryTabs';
import QuestionList from './QuestionList';
import AddQuestionModal from './QuestionModal';
import Header from './QuestionHeader';
import { Search } from 'lucide-react';

const QuestionLibrary = () => {
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('1');

  // Hook để lấy dữ liệu từ questions.json
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5000/instructor/questions.json'); // Đường dẫn tới file JSON
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Kiểm tra xem questions có tồn tại không trước khi cập nhật
        setQuestions(data); // Cập nhật với dữ liệu nhận được từ server
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []); // Chạy 1 lần khi component mount

  const handleEditQuestion = (index) => {
    setEditingQuestionIndex(index);
    setShowForm(true);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSaveQuestions = (newQuestions) => {
    if (editingQuestionIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestionIndex] = newQuestions[0];
      setQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      setQuestions([...questions, ...newQuestions]);
    }
  }; 

  const renderContent = () => {
    if (activeTab === '1') {
      return (
        <>
          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center mt-20">
              <img src="/image/empty@2x.png" alt="No questions" className="w-1/6 mb-6" />
              <p className="text-600">Hiện tại không có câu hỏi. Nhấn tạo để thêm mới.</p>
            </div>
          ) : (
            <QuestionList questions={questions} onEdit={handleEditQuestion} onDelete={handleDeleteQuestion} />
          )}
          {showForm && (
            <AddQuestionModal
              onClose={() => {
                setShowForm(false);
                setEditingQuestionIndex(null);
              }}
              onSave={handleSaveQuestions}
              existingQuestion={editingQuestionIndex !== null ? questions[editingQuestionIndex] : null}
            />
          )}
        </>
      );
    }
    if (activeTab === '2') {
      return <div>Directory Content</div>;
    }
    if (activeTab === '3') {
      return <div>Group Content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header className="w-full" />
      <QuestionLibraryTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      <div className="bg-white p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Nhập từ khóa"
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button className="absolute right-2 top-2 text-gray-400">
              <Search />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Lọc</button>
            <button
              className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
              onClick={() => setShowForm(true)}
            >
              Tạo câu hỏi +
            </button>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default QuestionLibrary;
