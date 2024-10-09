import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { List, Atom, EllipsisVertical, FileText } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import AddQuestionForm from './AddQuestion'; // Import the AddQuestionForm component

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isAddingQuestion, setIsAddingQuestion] = useState(false); // State to control adding question

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        setQuestions(data);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Error fetching questions');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/questions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

  const handleUpdateQuestion = async () => {
    if (!editingQuestion) return;

    const updatedQuestion = {
      ...editingQuestion,
      question_text: newQuestionText,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/questions/${editingQuestion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(updatedQuestion),
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(questions.map((question) => (question._id === data._id ? data : question)));
        toast.success('Question updated successfully!');
        setIsEditing(false);
        setEditingQuestion(null);
        setNewQuestionText('');
      } else {
        const error = await response.json();
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Error updating question');
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const filteredQuestions = questions.filter(question =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search bar */}
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
            onClick={() => setIsAddingQuestion(true)} // Open the AddQuestionForm when clicked
          >
            Tạo câu hỏi +
          </button>
        </div>
      </div>

      {/* Question list */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <img src="/image/empty@2x.png" alt="No questions" className="w-1/6 mb-6" />
            <p className="text-600">Hiện tại không có câu hỏi. Nhấn tạo để thêm mới.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question._id} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200">
              <div className="flex justify-between">
                <div className='w-8/12 flex items-center'>
                  <span className="font-semibold flex"><FileText className='me-2' />{question.question_text}</span>
                </div>
                <div className='w-3/12 flex flex-col'>
                  <span className="text-gray-500 flex"><List className='me-2' /> {question.category}</span>
                  <span className="text-gray-500 flex"><Atom className='me-2' /> {question.group}</span>
                </div>
                <Menu as="div" className="w-1/24 relative inline-block text-left">
                  <MenuButton className="inline-flex w-1/7 justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <EllipsisVertical aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none">
                    <div className="py-1">
                      <MenuItem>
                        <button
                          className="text-blue-500 hover:text-blue-700 flex items-center space-x-1 p-2"
                          onClick={() => {
                            setEditingQuestion(question);
                            setNewQuestionText(question.question_text);
                            setIsEditing(true);
                          }}
                        >
                          <Edit />
                          <span>Chỉnh sửa</span>
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button className="text-red-500 hover:text-red-700 flex items-center space-x-1 p-2" onClick={() => handleDeleteQuestion(question._id)}>
                          <Trash2 />
                          <span>Xóa</span>
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Chỉnh sửa câu hỏi</h3>
            <div className="mb-4">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="Nhập câu hỏi mới"
                className="p-2 border border-gray-300 rounded-md flex-1"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingQuestion(null);
                  setNewQuestionText('');
                }}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding a question */}
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
