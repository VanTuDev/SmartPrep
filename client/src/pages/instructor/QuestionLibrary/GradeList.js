import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GradeList = () => {
   const [grades, setGrades] = useState([]);
   const [newGradeName, setNewGradeName] = useState('');
   const [newGradeDescription, setNewGradeDescription] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [editingGradeIndex, setEditingGradeIndex] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      fetchGrades();
   }, []);

   const fetchGrades = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/instructor/grades/getAll', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
         });
         const data = await response.json();
         setGrades(data);
      } catch (error) {
         console.error('Error fetching grades:', error);
         toast.error('Có lỗi khi lấy danh sách khối.');
      }
   };

   const handleAddGrade = async () => {
      const newGrade = {
         name: newGradeName,
         description: newGradeDescription,
      };

      try {
         const response = await fetch('http://localhost:5000/api/instructor/grades/create', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newGrade),
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error creating grade');
         }

         const createdGrade = await response.json();
         setGrades([...grades, createdGrade.grade]);
         toast.success('Khối đã được tạo thành công!');
         resetForm();
      } catch (error) {
         console.error('Error adding grade:', error);
         toast.error(error.message);
      }
   };

   const handleEditGrade = (index) => {
      const gradeToEdit = grades[index];
      setEditingGradeIndex(index);
      setNewGradeName(gradeToEdit.name);
      setNewGradeDescription(gradeToEdit.description);
      setShowModal(true);
   };

   const handleUpdateGrade = async () => {
      if (editingGradeIndex === null) return;

      const updatedGrade = {
         name: newGradeName,
         description: newGradeDescription,
      };

      try {
         const gradeId = grades[editingGradeIndex]._id;
         const response = await fetch(`http://localhost:5000/api/instructor/grades/update/${gradeId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedGrade),
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error updating grade');
         }

         const updatedData = await response.json();
         const updatedGrades = [...grades];
         updatedGrades[editingGradeIndex] = updatedData.grade;
         setGrades(updatedGrades);
         toast.success('Khối đã được cập nhật thành công!');
         resetForm();
      } catch (error) {
         console.error('Error updating grade:', error);
         toast.error(error.message);
      }
   };

   const handleDeleteGrade = async (index) => {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khối này?");
      if (confirmDelete) {
         try {
            const gradeId = grades[index]._id;
            const response = await fetch(`http://localhost:5000/api/instructor/grades/delete/${gradeId}`, {
               method: 'DELETE',
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
               },
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Error deleting grade');
            }

            const updatedGrades = grades.filter((_, i) => i !== index);
            setGrades(updatedGrades);
            toast.success('Khối đã được xóa thành công!');
         } catch (error) {
            console.error('Error deleting grade:', error);
            toast.error(error.message);
         }
      }
   };

   const resetForm = () => {
      setNewGradeName('');
      setNewGradeDescription('');
      setEditingGradeIndex(null);
      setShowModal(false);
   };

   const filteredGrades = grades.filter(grade =>
      grade.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <ToastContainer />
         <div className="flex justify-between mb-6">
            <div className="relative w-full max-w-lg">
               <input
                  type="text"
                  placeholder="Tìm kiếm khối"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
               />
            </div>
            <button
               onClick={() => setShowModal(true)}
               className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-800"
            >
               Tạo khối +
            </button>
         </div>

         <div className="space-y-4">
            {filteredGrades.length === 0 ? (
               <p>Không có khối nào. Nhấn tạo để thêm mới.</p>
            ) : (
               filteredGrades.map((grade, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center">
                        <div>
                           <h3 className="font-semibold">{grade.name}</h3>
                           <p className="text-gray-500">{grade.description}</p>
                        </div>
                        <div className="flex space-x-2">
                           <button onClick={() => handleEditGrade(index)} className="text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                              <Edit />
                              <span>Chỉnh sửa</span>
                           </button>
                           <button onClick={() => handleDeleteGrade(index)} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
                              <Trash2 />
                              <span>Xóa</span>
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
               <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">{editingGradeIndex !== null ? 'Chỉnh sửa khối' : 'Thêm khối'}</h3>
                  <input
                     type="text"
                     value={newGradeName}
                     onChange={(e) => setNewGradeName(e.target.value)}
                     placeholder="Tên khối"
                     className="p-2 border border-gray-300 rounded-md w-full mb-4"
                  />
                  <input
                     type="text"
                     value={newGradeDescription}
                     onChange={(e) => setNewGradeDescription(e.target.value)}
                     placeholder="Mô tả khối"
                     className="p-2 border border-gray-300 rounded-md w-full mb-4"
                  />
                  <div className="flex justify-end">
                     <button onClick={resetForm} className="mr-2 bg-gray-300 px-4 py-2 rounded-md">
                        Đóng
                     </button>
                     <button
                        onClick={editingGradeIndex !== null ? handleUpdateGrade : handleAddGrade}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md"
                     >
                        {editingGradeIndex !== null ? 'Cập nhật' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default GradeList;
