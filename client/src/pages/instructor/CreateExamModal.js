import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const CreateExamModal = ({ isOpen, onClose, onSubmit }) => {
   const [grades, setGrades] = useState([]);
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);
   const [selectedGrade, setSelectedGrade] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('');
   const [selectedGroup, setSelectedGroup] = useState('');

   // Fetch Grades on mount
   useEffect(() => {
      if (isOpen) {
         fetchGrades();
      }
   }, [isOpen]);

   // Fetch Categories when Grade is selected
   useEffect(() => {
      if (selectedGrade) {
         fetchCategoriesByGrade(selectedGrade);
         setSelectedCategory('');
         setGroups([]); // Reset groups when grade changes
      }
   }, [selectedGrade]);



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
         const response = await axios.get(
            'http://localhost:5000/api/instructor/category/getCategoryByGrade',
            {
               params: { grade_id: gradeId },
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
         );
         setCategories(response.data);
      } catch (error) {
         toast.error('Lỗi khi lấy danh sách môn học!');
      }
   };

   const handleSubmit = () => {
      if (!selectedGrade || !selectedCategory) {
         toast.error('Vui lòng chọn đầy đủ khối và môn học!');
         return;
      }

      const examInfo = {
         gradeId: selectedGrade,
         categoryId: selectedCategory,
         groupId: selectedGroup || null, // Group is optional
      };

      onSubmit(examInfo); // Truyền dữ liệu đúng cách sang GeneralInformation
      onClose(); // Đóng modal sau khi chọn xong
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
         <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-semibold">Chọn Thông Tin Bài Kiểm Tra</h3>
               <button onClick={onClose}>
                  <X className="text-red-500 hover:text-red-700" />
               </button>
            </div>

            <div className="mb-4">
               <label className="block mb-2">Chọn Khối:</label>
               <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border rounded-lg"
               >
                  <option value="">Chọn Khối</option>
                  {grades.map((grade) => (
                     <option key={grade._id} value={grade._id}>
                        {grade.name}
                     </option>
                  ))}
               </select>
            </div>

            <div className="mb-4">
               <label className="block mb-2">Chọn Môn:</label>
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  disabled={!categories.length}
               >
                  <option value="">Chọn Môn</option>
                  {categories.map((category) => (
                     <option key={category._id} value={category._id}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </div>



            <div className="flex justify-end mt-4">
               <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-300 rounded-md">
                  Hủy
               </button>
               <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                  Tiếp Tục
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateExamModal;
