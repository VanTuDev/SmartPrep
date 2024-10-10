import React, { useState, useEffect } from 'react';
import { Search, List, Edit, Trash2 } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
   const [categories, setCategories] = useState([]);
   const [questions, setQuestions] = useState([]);
   const [newCategory, setNewCategory] = useState('');
   const [newDescription, setNewDescription] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
   const [editingCategory, setEditingCategory] = useState(null);
   const [groups, setGroups] = useState([]);

   useEffect(() => {
      fetchCategories();
      fetchGroups();
   }, []);

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
         toast.error('Lỗi khi lấy danh mục!');
         setCategories([]);
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
         toast.error('Lỗi khi lấy danh sách nhóm!');
         setGroups([]);
      }
   };

   // Hàm để lấy tên nhóm từ ID nhóm
   const getGroupNameById = (groupId) => {
      const group = groups.find((g) => g._id === groupId);
      return group ? group.name : 'N/A';
   };

   // Lấy danh sách câu hỏi theo ID danh mục
   const fetchQuestionsByCategoryId = async (categoryId) => {
      try {
         const response = await fetch(`http://localhost:5000/api/questions/category/${categoryId}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (!response.ok) throw new Error('Lỗi khi lấy danh sách câu hỏi.');

         const data = await response.json();
         setQuestions(data || []);
         setSelectedCategoryId(categoryId);
      } catch (error) {
         toast.error('Không thể lấy danh sách câu hỏi.');
         setQuestions([]);
      }
   };

   const handleAddOrEditCategory = async () => {
      if (!newCategory.trim()) {
         toast.error('Tên danh mục không được để trống.');
         return;
      }

      const newCat = { name: newCategory.trim(), description: newDescription.trim() };
      try {
         const token = localStorage.getItem('token');
         let response;

         if (editingCategory) {
            response = await fetch(`http://localhost:5000/api/category/${editingCategory._id}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
               body: JSON.stringify(newCat),
            });
         } else {
            response = await fetch('http://localhost:5000/api/category/create', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
               body: JSON.stringify(newCat),
            });
         }

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Lỗi khi tạo hoặc chỉnh sửa danh mục.');
         }

         fetchCategories();
         toast.success(editingCategory ? 'Danh mục đã được chỉnh sửa thành công!' : 'Danh mục đã được tạo thành công!');
         resetForm();
      } catch (error) {
         toast.error(`Lỗi khi tạo hoặc chỉnh sửa danh mục: ${error.message}. Vui lòng thử lại.`);
      }
   };

   const handleDeleteCategory = async (categoryId) => {
      try {
         const token = localStorage.getItem('token');
         const response = await fetch(`http://localhost:5000/api/category/${categoryId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Lỗi khi xóa danh mục.');
         }

         setCategories(categories.filter((cat) => cat._id !== categoryId));
         setSelectedCategoryId(null);
         toast.success('Danh mục đã được xóa thành công!');
      } catch (error) {
         toast.error(`Không thể xóa danh mục: ${error.message}. Vui lòng thử lại.`);
      }
   };

   const resetForm = () => {
      setNewCategory('');
      setNewDescription('');
      setShowModal(false);
      setEditingCategory(null);
   };

   const handleEditClick = (category) => {
      setEditingCategory(category);
      setNewCategory(category.name);
      setNewDescription(category.description);
      setShowModal(true);
   };

   const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <ToastContainer />
         <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-lg">
               <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
               />
               <button className="absolute right-2 top-2 text-gray-400">
                  <Search />
               </button>
            </div>
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800">
               {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục +'}
            </button>
         </div>

         {/* Modal thêm hoặc chỉnh sửa danh mục */}
         {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
               <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">{editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h3>
                  <input
                     type="text"
                     value={newCategory}
                     onChange={(e) => setNewCategory(e.target.value)}
                     placeholder="Tên danh mục"
                     className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  />
                  <textarea
                     value={newDescription}
                     onChange={(e) => setNewDescription(e.target.value)}
                     placeholder="Mô tả danh mục"
                     className="w-full p-2 border border-gray-300 rounded-md mb-4"
                  ></textarea>
                  <div className="flex justify-end">
                     <button onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded-md mr-2">
                        Hủy
                     </button>
                     <button onClick={handleAddOrEditCategory} className="bg-purple-600 text-white px-4 py-2 rounded-md">
                        {editingCategory ? 'Lưu' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Danh sách danh mục */}
         <div className="space-y-4">
            {filteredCategories.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center mt-20">
                  <img src="/image/empty@2x.png" alt="No categories" className="w-1/6 mb-6" />
                  <p className="text-600">Hiện tại không có danh mục nào. Nhấn tạo để thêm mới.</p>
               </div>
            ) : (
               filteredCategories.map((category, index) => (
                  <div key={index} className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer`}>
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <h3 className="font-semibold">{category.name}</h3>
                           <span className="text-gray-500">Mô tả: {category.description}</span>
                        </div>
                        <div className="flex items-center">
                           <button className="text-blue-600 mr-2 flex items-center" onClick={() => handleEditClick(category)}>
                              <Edit className="mr-1" />
                              Chỉnh sửa
                           </button>
                           <button className="text-red-600 flex items-center" onClick={() => handleDeleteCategory(category._id)}>
                              <Trash2 className="mr-1" />
                              Xóa
                           </button>
                        </div>
                     </div>
                     <button className="text-gray-400 flex items-center mt-2" onClick={() => fetchQuestionsByCategoryId(category._id)}>
                        <List className="mr-1" />
                        <span>Hiển thị chi tiết câu hỏi</span>
                     </button>
                     {selectedCategoryId === category._id && (
                        <div className="mt-4">
                           <h4 className="font-semibold">Danh sách câu hỏi chi tiết:</h4>
                           {questions.length > 0 ? (
                              <table className="min-w-full bg-white border">
                                 <thead>
                                    <tr className="w-full bg-gray-200">
                                       <th className="px-4 py-2 border">Câu hỏi</th>
                                       <th className="px-4 py-2 border">Các tùy chọn</th>
                                       <th className="px-4 py-2 border">Đáp án đúng</th>
                                       <th className="px-4 py-2 border">Nhóm</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {questions.map((question, index) => (
                                       <tr key={index}>
                                          <td className="px-4 py-2 border">{question.question_text}</td>
                                          <td className="px-4 py-2 border">{question.options ? question.options.join(', ') : 'N/A'}</td>
                                          <td className="px-4 py-2 border">{Array.isArray(question.correct_answers) ? question.correct_answers.join(', ') : 'N/A'}</td>
                                          <td className="px-4 py-2 border">{getGroupNameById(question.group)}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           ) : (
                              <p>Không có câu hỏi nào trong danh mục này.</p>
                           )}
                        </div>
                     )}
                  </div>
               ))
            )}
         </div>
      </div>
   );
};

export default CategoryList;
