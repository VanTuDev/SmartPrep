import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { List, Atom, FileText } from 'lucide-react';
import AddQuestionForm from './AddQuestion';
import QuestionCard from './QuestionCard';

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Lấy danh sách khối từ API
  const fetchGrades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructor/grades/getAll', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setGrades(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách khối!');
    }
  };

  // Lấy danh mục môn học theo khối
  const fetchCategoriesByGrade = async (gradeId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/instructor/category/getCategoryByGrade?grade_id=${gradeId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCategories(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách môn học!');
    }
  };

  // Lấy danh sách chương theo môn học
  const fetchGroupsByCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/instructor/groups/byCategory?category_id=${categoryId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setGroups(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách chương!');
    }
  };

  // Lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/instructor/questions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuestions(response.data);
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách câu hỏi!');
    }
  };

  // Cập nhật câu hỏi
  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      await axios.put(
        `http://localhost:5000/api/instructor/questions/${updatedQuestion._id}`,
        updatedQuestion,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      fetchQuestions();
      toast.success('Cập nhật câu hỏi thành công!');
    } catch (error) {
      toast.error('Lỗi khi cập nhật câu hỏi!');
    }
  };

  // Xóa câu hỏi
  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/instructor/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchQuestions();
      toast.success('Xóa câu hỏi thành công!');
    } catch (error) {
      toast.error('Lỗi khi xóa câu hỏi!');
    }
  };

  // Lọc câu hỏi theo từ khóa tìm kiếm
  const filteredQuestions = questions.filter((question) =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    fetchGrades();
    fetchQuestions();
  }, []);

  return (
    <div>
      <div className="bg-white p-8">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Nhập từ khóa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
            <button className="absolute right-2 top-2 text-gray-400">
              <Search />
            </button>
          </div>
          <button
            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800"
            onClick={() => setIsAddingQuestion(true)}
          >
            Tạo câu hỏi +
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20">
            <p className="text-600">Hiện tại không có câu hỏi. Nhấn tạo để thêm mới.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="p-4 bg-white rounded-lg shadow-sm border cursor-pointer"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="flex justify-between">
                <div className="w-8/12 flex items-center">
                  <span className="font-semibold flex">
                    <FileText className="me-2" /> {question.question_text}
                  </span>
                </div>
                <div className="w-3/12 flex flex-col">
                  <span className="text-gray-500 flex">
                    <List className="me-2" /> {question.category_id?.name || 'N/A'}
                  </span>
                  <span className="text-gray-500 flex">
                    <Atom className="me-2" /> {question.group_id?.name || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedQuestion && (
        <QuestionCard
          question={selectedQuestion}
          grades={grades}
          categories={categories}
          groups={groups}
          onUpdate={handleUpdateQuestion}
          onDelete={handleDeleteQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}

      {isAddingQuestion && (
        <AddQuestionForm onClose={() => setIsAddingQuestion(false)} onRefresh={fetchQuestions} />
      )}
    </div>
  );
};

export default QuestionList;
