import React, { useState, useEffect } from 'react';
import { Search, List, Edit, Trash2, Loader } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
   const [categories, setCategories] = useState([]);
   const [grades, setGrades] = useState([]);
   const [questions, setQuestions] = useState([]);
   const [newCategory, setNewCategory] = useState('');
   const [newDescription, setNewDescription] = useState('');
   const [newGrade, setNewGrade] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedCategoryId, setSelectedCategoryId] = useState(null);
   const [editingCategory, setEditingCategory] = useState(null);
   const [loading, setLoading] = useState(false);

   // Gọi API để lấy danh mục và khối khi component được render
   useEffect(() => {
      fetchCategories();
      fetchGrades();
   }, []);

   const fetchCategories = async () => {
      try {
         setLoading(true);
         const response = await fetch('http://localhost:5000/api/instructor/category', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         const data = await response.json();
         setCategories(data);
      } catch (error) {
         toast.error('Lỗi khi lấy danh mục!');
      } finally {
         setLoading(false);
      }
   };

   const fetchGrades = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/instructor/grades/getAll', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         const data = await response.json();
         setGrades(data);
      } catch (error) {
         toast.error('Lỗi khi lấy danh sách khối học!');
      }
   };

   const handleAddOrEditCategory = async () => {
      if (!newCategory.trim() || !newGrade) {
         toast.error('Tên danh mục và khối học là bắt buộc.');
         return;
      }

      const categoryData = {
         name: newCategory.trim(),
         description: newDescription.trim(),
         grade_id: newGrade,
      };

      try {
         const url = editingCategory
            ? `http://localhost:5000/api/instructor/category/${editingCategory._id}`
            : 'http://localhost:5000/api/instructor/category/create';
         const method = editingCategory ? 'PUT' : 'POST';

         const response = await fetch(url, {
            method,
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(categoryData),
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Lỗi khi lưu danh mục.');
         }

         fetchCategories();
         toast.success(editingCategory ? 'Danh mục đã được cập nhật!' : 'Danh mục đã được tạo!');
         resetForm();
      } catch (error) {
         toast.error(`Lỗi: ${error.message}`);
      }
   };

   const handleDeleteCategory = async (categoryId) => {
      const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa danh mục này?');
      if (!confirmDelete) return;

      try {
         const response = await fetch(`http://localhost:5000/api/instructor/category/${categoryId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });

         if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Lỗi khi xóa danh mục.');
         }

         setCategories(categories.filter((cat) => cat._id !== categoryId));
         toast.success('Danh mục đã được xóa thành công!');
      } catch (error) {
         toast.error(`Lỗi: ${error.message}`);
      }
   };

   const resetForm = () => {
      setNewCategory('');
      setNewDescription('');
      setNewGrade('');
      setShowModal(false);
      setEditingCategory(null);
   };

   const handleEditClick = (category) => {
      setEditingCategory(category);
      setNewCategory(category.name);
      setNewDescription(category.description);
      setNewGrade(category.grade_id?._id || '');
      setShowModal(true);
   };

   const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <ToastContainer />
         <div className="flex justify-between mb-6">
            <input
               type="text"
               placeholder="Tìm kiếm danh mục"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded-lg shadow-sm"
            />
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
               {editingCategory ? 'Chỉnh sửa danh mục' : 'Tạo danh mục +'}
            </button>
         </div>

         {loading ? (
            <div className="flex justify-center items-center">
               <Loader className="animate-spin" size={48} />
            </div>
         ) : (
            <div className="space-y-4">
               {filteredCategories.map((category) => (
                  <div key={category._id} className="p-4 bg-white rounded-lg shadow-sm border">
                     <h3 className="font-semibold">{category.name}</h3>
                     <p className="text-gray-500">{category.description}</p>
                     <p className="text-gray-400">
                        Khối: {category.grade_id ? category.grade_id.name : 'Không xác định'}
                     </p>

                     <div className="flex justify-end space-x-2 mt-2">
                        <button onClick={() => handleEditClick(category)} className="text-blue-600 flex items-center">
                           <Edit className="mr-1" /> Chỉnh sửa
                        </button>
                        <button
                           onClick={() => handleDeleteCategory(category._id)}
                           className="text-red-600 flex items-center"
                        >
                           <Trash2 className="mr-1" /> Xóa
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
               <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">
                     {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}
                  </h3>
                  <input
                     type="text"
                     value={newCategory}
                     onChange={(e) => setNewCategory(e.target.value)}
                     placeholder="Tên danh mục"
                     className="mb-4 p-2 border border-gray-300 rounded-md w-full"
                  />
                  <input
                     type="text"
                     value={newDescription}
                     onChange={(e) => setNewDescription(e.target.value)}
                     placeholder="Mô tả"
                     className="mb-4 p-2 border border-gray-300 rounded-md w-full"
                  />
                  <select
                     value={newGrade}
                     onChange={(e) => setNewGrade(e.target.value)}
                     className="p-2 border border-gray-300 rounded-md flex-1"
                  >
                     <option value="">Chọn khối</option>
                     {grades.map((grade) => (
                        <option key={grade._id} value={grade._id}>
                           {grade.name}
                        </option>
                     ))}
                  </select>

                  <div className="flex justify-end mt-4">
                     <button onClick={resetForm} className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
                        Đóng
                     </button>
                     <button onClick={handleAddOrEditCategory} className="px-4 py-2 bg-purple-600 text-white rounded-md">
                        {editingCategory ? 'Cập nhật' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default CategoryList;
