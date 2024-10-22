import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Save, PlusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

const QuestionCard = ({ question, onClose, onUpdate, onDelete }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editedQuestion, setEditedQuestion] = useState({ ...question });
   const [grades, setGrades] = useState([]);
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);

   useEffect(() => {
      fetchGrades();
   }, []);

   useEffect(() => {
      setEditedQuestion({
         ...question,
         options: question.options || [],
         correct_answers: question.correct_answers || [], // Multiple correct answers support
      });

      if (question.grade_id) fetchCategoriesByGrade(question.grade_id);
      if (question.category_id) fetchGroupsByCategory(question.category_id);
   }, [question]);

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

   const fetchCategoriesByGrade = async (gradeId) => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/category/getCategoryByGrade', {
            params: { grade_id: gradeId },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setCategories(response.data);
      } catch (error) {
         toast.error('Lỗi khi lấy danh sách môn học!');
      }
   };

   const fetchGroupsByCategory = async (categoryId) => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/groups/byCategory', {
            params: { category_id: categoryId },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setGroups(response.data);
      } catch (error) {
         toast.error('Lỗi khi lấy danh sách chương!');
      }
   };

   const handleInputChange = (field, value) => {
      setEditedQuestion({ ...editedQuestion, [field]: value });
   };

   const handleAddOption = () => {
      setEditedQuestion({ ...editedQuestion, options: [...editedQuestion.options, ''] });
   };

   const handleRemoveOption = (index) => {
      const newOptions = editedQuestion.options.filter((_, i) => i !== index);
      setEditedQuestion({ ...editedQuestion, options: newOptions });
   };

   const handleOptionChange = (index, value) => {
      const newOptions = [...editedQuestion.options];
      newOptions[index] = value;
      setEditedQuestion({ ...editedQuestion, options: newOptions });
   };

   const handleCorrectAnswerChange = (option) => {
      // Nếu đáp án đã được chọn, thì bỏ chọn; nếu chưa, thêm vào danh sách đáp án đúng
      const updatedAnswers = editedQuestion.correct_answers.includes(option)
         ? editedQuestion.correct_answers.filter((ans) => ans !== option)
         : [...editedQuestion.correct_answers, option];
      setEditedQuestion({ ...editedQuestion, correct_answers: updatedAnswers });
   };

   const handleSave = async () => {
      try {
         await onUpdate(editedQuestion);
         setIsEditing(false);
         toast.success('Cập nhật câu hỏi thành công!');
      } catch (error) {
         toast.error('Lỗi khi cập nhật câu hỏi!');
      }
   };

   const handleDelete = async () => {
      try {
         await onDelete(question._id);
         toast.success('Xóa câu hỏi thành công!');
         onClose();
      } catch (error) {
         toast.error('Lỗi khi xóa câu hỏi!');
      }
   };

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
         <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-semibold">Chi tiết câu hỏi</h3>
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
                     className="border border-gray-300 rounded-lg p-2 w-full"
                  />
               ) : (
                  <p>{question.question_text}</p>
               )}
            </div>

            {/* Khối */}
            <div className="mb-4">
               <p className="font-semibold">Khối:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.grade_id || ''}
                     onChange={(e) => {
                        const gradeId = e.target.value;
                        handleInputChange('grade_id', gradeId);
                        fetchCategoriesByGrade(gradeId);
                     }}
                     className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                     <option value="">Chọn khối</option>
                     {grades.map((grade) => (
                        <option key={grade._id} value={grade._id}>
                           {grade.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <p>{question.grade_id?.name || 'N/A'}</p>
               )}
            </div>

            {/* Môn */}
            <div className="mb-4">
               <p className="font-semibold">Môn:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.category_id || ''}
                     onChange={(e) => {
                        const categoryId = e.target.value;
                        handleInputChange('category_id', categoryId);
                        fetchGroupsByCategory(categoryId);
                     }}
                     className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                     <option value="">Chọn môn</option>
                     {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                           {category.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <p>{question.category_id?.name || 'N/A'}</p>
               )}
            </div>

            {/* Chương */}
            <div className="mb-4">
               <p className="font-semibold">Chương:</p>
               {isEditing ? (
                  <select
                     value={editedQuestion.group_id || ''}
                     onChange={(e) => handleInputChange('group_id', e.target.value)}
                     className="border border-gray-300 rounded-lg p-2 w-full"
                  >
                     <option value="">Chọn chương</option>
                     {groups.map((group) => (
                        <option key={group._id} value={group._id}>
                           {group.name}
                        </option>
                     ))}
                  </select>
               ) : (
                  <p>{question.group_id?.name || 'N/A'}</p>
               )}
            </div>


            {/* Các lựa chọn */}
            <div className="mb-4">
               <p className="font-semibold">Các lựa chọn:</p>
               {editedQuestion.options.map((opt, index) => (
                  <div key={index} className="flex items-center mb-2">
                     {isEditing ? (
                        <>
                           <input
                              type="checkbox"
                              checked={editedQuestion.correct_answers.includes(opt)}
                              onChange={() => handleCorrectAnswerChange(opt)}
                              className="mr-2"
                           />
                           <input
                              type="text"
                              value={opt}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="border p-2 rounded-lg mr-2 flex-1"
                           />
                           <button onClick={() => handleRemoveOption(index)} className="text-red-500">
                              <Trash2 />
                           </button>
                        </>
                     ) : (
                        <span
                           className={`flex-1 ${editedQuestion.correct_answers.includes(opt) ? 'font-bold text-green-600' : ''}`}
                        >
                           <input
                              type="radio"
                              name="correct_answer"
                              checked={editedQuestion.correct_answers.includes(opt)}
                              readOnly
                              className="mr-2"
                           />
                           {String.fromCharCode(65 + index)}. {opt}
                        </span>
                     )}
                  </div>
               ))}

               {isEditing && (
                  <button onClick={handleAddOption} className="text-blue-500 hover:text-blue-700 mt-2">
                     <PlusCircle className="inline mr-1" /> Thêm lựa chọn
                  </button>
               )}
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end gap-2">
               {isEditing ? (
                  <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">
                     <Save className="inline mr-2" /> Lưu
                  </button>
               ) : (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                     <Edit className="inline mr-2" /> Chỉnh sửa
                  </button>
               )}
               <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg">
                  <Trash2 className="inline mr-2" /> Xóa
               </button>
            </div>
         </div>
      </div>
   );
};

export default QuestionCard;
