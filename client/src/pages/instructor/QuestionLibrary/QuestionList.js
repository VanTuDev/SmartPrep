import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [questions, setQuestions] = useState([]);

  // Hàm để lấy danh sách câu hỏi từ API
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Nếu cần xác thực
        },
      });
      const data = await response.json();

      if (response.ok) {
        setQuestions(data); // Cập nhật danh sách câu hỏi
      } else {
        toast.error(data.error); // Hiển thị thông báo lỗi nếu có
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      toast.error('Lỗi khi lấy danh sách câu hỏi');
    }
  };

  // Gọi hàm fetch khi component được mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Lọc danh sách câu hỏi dựa trên từ khóa tìm kiếm
  const filteredQuestions = questions.filter(question =>
    question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Phần tìm kiếm */}
      <div className="bg-white p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
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
          >
            Tạo câu hỏi +
          </button>
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <img src="/image/empty@2x.png" alt="No questions" className="w-1/6 mb-6" />
            <p className="text-600">Hiện tại không có câu hỏi. Nhấn tạo để thêm mới.</p>
          </div>
        ) : (
          filteredQuestions.map((question) => (
            <div key={question._id} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between">
                <div className='w-8/12'>
                  <span className="font-semibold">{question.question_text}</span>
                </div>
                <div className='w-4/12 flex flex-col'>
                  <span className="text-gray-500">Danh mục: {question.category}</span>
                  <span className="text-gray-500">Nhóm: {question.group}</span>
                </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <button className="text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                  <Edit />
                  <span>Chỉnh sửa</span>
                </button>
                <button className="text-red-500 hover:text-red-700 flex items-center space-x-1" onClick={() => {
                  toast.success('Câu hỏi đã được xóa thành công!'); // Chỉ là thông báo, không có xóa thực tế
                }}>
                  <Trash2 />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QuestionList;
