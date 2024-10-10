import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { List, Atom, EllipsisVertical, FileText } from 'lucide-react';
import AddQuestionForm from './AddQuestion';
import QuestionCard from './QuestionCard'; // Import QuestionCard

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục
  const [groups, setGroups] = useState([]); // Lưu danh sách nhóm

  const [isAddingQuestion, setIsAddingQuestion] = useState(false); // State để điều khiển việc thêm câu hỏi mới
  const [selectedQuestion, setSelectedQuestion] = useState(null); // Thêm state để quản lý câu hỏi đã chọn


  // Lấy danh sách câu hỏi
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi khi lấy dữ liệu: ${response.statusText}`);
      }

      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      toast.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
    }
  };


  // Lấy danh sách danh mục
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

  // Lấy danh sách nhóm
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
    fetchQuestions();
    fetchCategories();
    fetchGroups();
  }, []);

  // Tìm tên danh mục dựa trên ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Tìm tên nhóm dựa trên ID
  const getGroupName = (groupId) => {
    const group = groups.find((grp) => grp._id === groupId);
    return group ? group.name : 'N/A';
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setQuestions(questions.filter((question) => question._id !== id));
        toast.success('Question deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Error deleting question');
    }
  };

  // Xử lý cập nhật câu hỏi
  const handleUpdateQuestion = async (updatedQuestion) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${updatedQuestion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedQuestion),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(questions.map((q) => (q._id === data._id ? data : q)));
        toast.success('Cập nhật câu hỏi thành công!');
        setSelectedQuestion(data); // Cập nhật câu hỏi đã chỉnh sửa
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật câu hỏi.');
    }
  };
  const filteredQuestions = questions.filter((question) =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Thanh tìm kiếm */}
      <div className="bg-white p-8">
        <div className="flex justify-between items-center">
          <div className="relative w-full max-w-lg">
            <input
              type="text"
              placeholder="Nhập từ khóa"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
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

      {/* Danh sách câu hỏi */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <p className="text-600">Hiện tại không có câu hỏi. Nhấn tạo để thêm mới.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div
              key={question._id}
              className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 cursor-pointer"
              onClick={() => setSelectedQuestion(question)} // Khi nhấp vào câu hỏi, hiển thị chi tiết
            >
              <div className="flex justify-between">
                <div className='w-8/12 flex items-center'>
                  <span className="font-semibold flex"><FileText className='me-2' />{question.question_text}</span>
                </div>
                <div className='w-3/12 flex flex-col'>
                  <span className="text-gray-500 flex"><List className='me-2' /> {getCategoryName(question.category)}</span>
                  <span className="text-gray-500 flex"><Atom className='me-2' /> {getGroupName(question.group)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Hiển thị chi tiết câu hỏi */}
      {selectedQuestion && (
        <QuestionCard
          question={selectedQuestion}
          categories={categories}
          groups={groups}
          onClose={() => setSelectedQuestion(null)}
          onUpdate={handleUpdateQuestion}
          onDelete={handleDeleteQuestion}
        />
      )}

      {/* Modal thêm câu hỏi */}
      {isAddingQuestion && (
        <AddQuestionForm
          onClose={() => setIsAddingQuestion(false)}
          onRefresh={fetchQuestions}
        />
      )}
    </div>
  );
};

export default QuestionList;
