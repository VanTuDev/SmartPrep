import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoryList = () => {
   const [categories, setCategories] = useState([]);
   const [newCategory, setNewCategory] = useState('');
   const [newDescription, setNewDescription] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [editingCategoryIndex, setEditingCategoryIndex] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const response = await fetch('http://localhost:5000/api/category', {
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
               },
            });
            const data = await response.json();
            console.log('Fetched categories:', data);
            if (Array.isArray(data)) {
               setCategories(data);
            } else {
               console.error('Unexpected data format', data);
            }
         } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
         }
      };

      fetchCategories();
   }, []);

   const handleAddCategory = async () => {
      const newCat = {
         name: newCategory,
         description: newDescription,
      };

      try {
         const token = localStorage.getItem('token');

         const response = await fetch('http://localhost:5000/api/category/create', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newCat),
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error creating category');
         }

         const createdCategory = await response.json();
         setCategories([...categories, createdCategory.category]);
         toast.success('Danh mục đã được tạo thành công!');
         resetForm();
      } catch (error) {
         console.error('Lỗi khi thêm danh mục:', error);
         toast.error(error.message);
      }
   };

   const handleEditCategory = (index) => {
      const categoryToEdit = categories[index];
      setEditingCategoryIndex(index);
      setNewCategory(categoryToEdit.name);
      setNewDescription(categoryToEdit.description);
      setShowModal(true);
   };

   const handleUpdateCategory = async () => {
      if (editingCategoryIndex === null) return;

      const updatedCategory = {
         name: newCategory,
         description: newDescription,
      };

      try {
         const token = localStorage.getItem('token');
         const categoryId = categories[editingCategoryIndex]._id; // Lấy ID của danh mục đang chỉnh sửa
         const response = await fetch(`http://localhost:5000/api/category/${categoryId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updatedCategory), // Gửi thông tin cập nhật
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Lỗi khi cập nhật danh mục');
         }

         const updatedData = await response.json();
         const updatedCategories = [...categories];
         updatedCategories[editingCategoryIndex] = updatedData.category; // Cập nhật danh mục trong danh sách
         setCategories(updatedCategories); // Cập nhật lại danh sách
         toast.success('Danh mục đã được cập nhật thành công!'); // Hiển thị thông báo thành công
         resetForm(); // Đặt lại các trường
      } catch (error) {
         console.error('Lỗi khi cập nhật danh mục:', error);
         toast.error(error.message); // Hiển thị thông báo lỗi
      }
   };

   const handleDeleteCategory = async (index) => {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa danh mục này?");
      if (confirmDelete) {
         try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/category/${categories[index]._id}`, {
               method: 'DELETE',
               headers: {
                  'Authorization': `Bearer ${token}`,
               },
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Lỗi khi xóa danh mục');
            }

            const updatedCategories = categories.filter((_, i) => i !== index);
            setCategories(updatedCategories);
            toast.success('Danh mục đã được xóa thành công!');
         } catch (error) {
            console.error('Lỗi khi xóa danh mục:', error);
            toast.error(error.message);
         }
      }
   };

   const resetForm = () => {
      setNewCategory('');
      setNewDescription('');
      setEditingCategoryIndex(null);
      setShowModal(false);
   };

   const filteredCategories = categories.filter(category =>
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
            <button
               onClick={() => setShowModal(true)}
               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800"
            >
               Tạo danh mục +
            </button>
         </div>

         <div className="space-y-4">
            {filteredCategories.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center mt-20">
                  <img src="/image/empty@2x.png" alt="No categories" className="w-1/6 mb-6" />
                  <p className="text-600">Hiện tại không có danh mục nào. Nhấn tạo để thêm mới.</p>
               </div>
            ) : (
               filteredCategories.map((category, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <h3 className="font-semibold">{category.name}</h3>
                           <span className="text-gray-500">Mô tả: {category.description}</span>
                           <span className="text-gray-400">Câu hỏi: {category.questionCount}</span>
                        </div>
                        <div className="flex space-x-2">
                           <button onClick={() => handleEditCategory(index)} className="text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                              <Edit />
                              <span>Chỉnh sửa</span>
                           </button>
                           <button onClick={() => handleDeleteCategory(index)} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
                              <Trash2 />
                              <span>Xóa</span>
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Modal cho thêm hoặc chỉnh sửa danh mục */}
         {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
               <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">{editingCategoryIndex !== null ? 'Chỉnh sửa danh mục' : 'Thêm danh mục'}</h3>
                  <div className="flex mb-4">
                     <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Tên danh mục"
                        className="p-2 border border-gray-300 rounded-md flex-1"
                     />
                  </div>
                  <div className="flex mb-4">
                     <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Mô tả danh mục"
                        className="p-2 border border-gray-300 rounded-md flex-1"
                     />
                  </div>
                  <div className="mt-4 flex justify-end">
                     <button
                        onClick={resetForm} // Đóng modal
                        className="mr-2 bg-gray-300 text-black px-4 py-2 rounded-md"
                     >
                        Đóng
                     </button>
                     <button
                        onClick={editingCategoryIndex !== null ? handleUpdateCategory : handleAddCategory}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md"
                     >
                        {editingCategoryIndex !== null ? 'Cập nhật' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default CategoryList;
