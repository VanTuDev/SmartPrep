import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const QuestionCard = ({ question, categories = [], groups = [], onClose, onUpdate, onDelete }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editedQuestion, setEditedQuestion] = useState({ ...question });

   useEffect(() => {
      setEditedQuestion({ ...question });
   }, [question]);

   // Xử lý thay đổi dữ liệu
   const handleInputChange = (field, value) => {
      setEditedQuestion({ ...editedQuestion, [field]: value });
   };

   // Xử lý cập nhật danh mục
   const handleCategoryChange = (e) => {
      setEditedQuestion({ ...editedQuestion, category: e.target.value });
   };

   // Xử lý cập nhật nhóm
   const handleGroupChange = (e) => {
      setEditedQuestion({ ...editedQuestion, group: e.target.value });
   };

   // Xử lý thêm lựa chọn mới
   const handleAddOption = () => {
      setEditedQuestion({ ...editedQuestion, option: [...editedQuestion.option, ''] });
   };

   // Xử lý khi thay đổi các lựa chọn
   const handleOptionChange = (index, value) => {
      const newOptions = [...editedQuestion.option];
      newOptions[index] = value;
      setEditedQuestion({ ...editedQuestion, option: newOptions });
   };

   // Xử lý thay đổi đáp án đúng
   const handleCorrectAnswerChange = (option) => {
      if (editedQuestion.correct_answers.includes(option)) {
         setEditedQuestion({
            ...editedQuestion,
            correct_answers: editedQuestion.correct_answers.filter((ans) => ans !== option),
         });
      } else {
         setEditedQuestion({ ...editedQuestion, correct_answers: [...editedQuestion.correct_answers, option] });
      }
   };

   // Xóa lựa chọn
   const handleRemoveOption = (index) => {
      const newOptions = editedQuestion.option.filter((_, i) => i !== index);
      const newCorrectAnswers = editedQuestion.correct_answers.filter((ans) => ans !== editedQuestion.option[index]);
      setEditedQuestion({ ...editedQuestion, option: newOptions, correct_answers: newCorrectAnswers });
   };

   // Lấy tên danh mục và nhóm hiện tại
   const categoryName = categories.find((cat) => cat._id === question.category)?.name || 'N/A';
   const groupName = groups.find((grp) => grp._id === question.group)?.name || 'N/A';

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
         <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-semibold mb-4">Chi tiết câu hỏi</h3>
               <button onClick={onClose} className="text-red-500 hover:text-red-700">
                  <X />
               </button>
            </div>

            {/* Nội dung câu hỏi */}
            <div className="mb-4">
               <p className="font-semibold">Nội dung câu hỏi:</p>
               {isEditing ? (
                  <textarea
                     value={editedQuestion.question_text}
                     onChange={(e) => handleInputChange('question_text', e.target.value)}
                     className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  />
               ) : (
                  <p>{question.question_text}</p>
               )}
            </div>

            {/* Loại câu hỏi */}
            <div className="mb-4">
               <p className="font-semibold">Loại câu hỏi:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.question_type}
                     onChange={(e) => handleInputChange('question_type', e.target.value)}
                     className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  >
                     <option value="multiple-choice">Multiple Choice</option>
                     <option value="essay">Essay</option>
                  </select>
               ) : (
                  <p>{question.question_type}</p>
               )}
            </div>

            {/* Danh mục */}
            <div className="mb-4">
               <p className="font-semibold">Danh mục:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.category}
                     onChange={handleCategoryChange}
                     className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  >
                     <option value="">Chọn danh mục</option>
                     {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                           {category.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <p>{categoryName}</p>
               )}
            </div>

            {/* Nhóm */}
            <div className="mb-4">
               <p className="font-semibold">Nhóm:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.group}
                     onChange={handleGroupChange}
                     className="border border-gray-300 rounded-lg p-2 w-full mb-4"
                  >
                     <option value="">Chọn nhóm</option>
                     {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                           {group.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <p>{groupName}</p>
               )}
            </div>

            {/* Các lựa chọn cho câu hỏi dạng multiple-choice */}
            {editedQuestion.question_type === 'multiple-choice' && editedQuestion.option && (
               <div className="mb-4">
                  <p className="font-semibold">Các lựa chọn:</p>
                  <ul className="list-none">
                     {editedQuestion.option.map((opt, index) => (
                        <li key={index} className="mb-2 flex items-center">
                           {isEditing ? (
                              <>
                                 <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full mr-2"
                                 />
                                 <input
                                    type="checkbox"
                                    checked={editedQuestion.correct_answers.includes(opt)}
                                    onChange={() => handleCorrectAnswerChange(opt)}
                                    className="mr-2"
                                 />
                                 <button onClick={() => handleRemoveOption(index)} className="text-red-500 hover:text-red-700">
                                    Xóa
                                 </button>
                              </>
                           ) : (
                              <div className="flex items-center">
                                 <span className="mr-2">{opt}</span>
                                 <input
                                    type="checkbox"
                                    checked={editedQuestion.correct_answers.includes(opt)}
                                    disabled
                                    className="mr-2"
                                 />
                              </div>
                           )}
                        </li>
                     ))}
                  </ul>
                  {isEditing && (
                     <button
                        onClick={handleAddOption}
                        className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                     >
                        + Thêm lựa chọn
                     </button>
                  )}
               </div>
            )}

            {/* Nút chỉnh sửa và xóa */}
            <div className="flex justify-end gap-2">
               {isEditing ? (
                  <button
                     onClick={() => {
                        onUpdate(editedQuestion);
                        setIsEditing(false);
                        toast.success('Cập nhật thành công!');
                     }}
                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                     <Save className="inline mr-2" />
                     Lưu
                  </button>
               ) : (
                  <button
                     onClick={() => setIsEditing(true)}
                     className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                     <Edit className="inline mr-2" />
                     Chỉnh sửa
                  </button>
               )}
               <button
                  onClick={() => {
                     onDelete(question._id);
                     toast.success('Đã xóa câu hỏi!');
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
               >
                  <Trash2 className="inline mr-2" />
                  Xóa
               </button>
            </div>
         </div>
      </div>
   );
};

export default QuestionCard;