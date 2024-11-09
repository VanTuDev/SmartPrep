import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const CreateExamModal = ({ isOpen, onClose, onSubmit }) => {
   const [grades, setGrades] = useState([]);
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);
   const [classes, setClasses] = useState([]);
   const [selectedGrade, setSelectedGrade] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('');
   const [selectedGroup, setSelectedGroup] = useState('');
   const [selectedClasses, setSelectedClasses] = useState([]);

   useEffect(() => {
      if (isOpen) {
         fetchGrades();
         fetchInstructorClasses();
         resetSelections();
      }
   }, [isOpen]);

   useEffect(() => {
      if (selectedGrade) {
         fetchCategoriesByGrade(selectedGrade);
         setSelectedCategory('');
         setGroups([]);
      }
   }, [selectedGrade]);

   useEffect(() => {
      if (selectedCategory) {
         fetchGroupsByCategory(selectedCategory);
      }
   }, [selectedCategory]);

   const resetSelections = () => {
      setSelectedGrade('');
      setSelectedCategory('');
      setSelectedGroup('');
      setSelectedClasses([]);
      setGroups([]);
   };

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

   const fetchInstructorClasses = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/classrooms/instructor/classes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setClasses(response.data.classes);
      } catch (error) {
         toast.error('Lỗi khi lấy danh sách lớp!');
      }
   };

   const handleCheckboxChange = (classId) => {
      setSelectedClasses((prev) =>
         prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
      );
   };

   const handleSubmit = () => {
      if (!selectedGrade || !selectedCategory) {
         toast.error('Vui lòng chọn đầy đủ khối và môn học!');
         return;
      }

      const examInfo = {
         gradeId: selectedGrade,
         categoryId: selectedCategory,
         groupId: selectedGroup || null,
         classRoomIds: selectedClasses,
      };

      onSubmit(examInfo);
      onClose();
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
         <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-xl font-semibold">Chọn Thông Tin Bài Kiểm Tra</h3>
               <button onClick={onClose} className="text-red-500 hover:text-red-700">
                  <X />
               </button>
            </div>

            <div className="mb-4">
               <label className="block mb-2 text-sm font-medium text-gray-600">Chọn Khối:</label>
               <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-700"
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
               <label className="block mb-2 text-sm font-medium text-gray-600">Chọn Môn:</label>
               <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-700"
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

            <div className="mb-4">
               <label className="block mb-2 text-sm font-medium text-gray-600">Chọn Chương (Tùy chọn):</label>
               <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-700"
                  disabled={!groups.length}
               >
                  <option value="">Không chọn chương</option>
                  {groups.map((group) => (
                     <option key={group._id} value={group._id}>
                        {group.name}
                     </option>
                  ))}
               </select>
            </div>

            <div className="mb-4">
               <label className="block mb-2 text-sm font-medium text-gray-600">Chọn Lớp (Tùy chọn):</label>
               <div className="border rounded-lg p-2 max-h-32 overflow-y-auto">
                  {classes.map((classItem) => (
                     <div key={classItem._id} className="flex items-center mb-2">
                        <input
                           type="checkbox"
                           id={classItem._id}
                           value={classItem._id}
                           checked={selectedClasses.includes(classItem._id)}
                           onChange={() => handleCheckboxChange(classItem._id)}
                           className="mr-2"
                        />
                        <label htmlFor={classItem._id} className="text-gray-700">{classItem.name}</label>
                     </div>
                  ))}
               </div>
            </div>

            <div className="flex justify-end mt-6">
               <button onClick={onClose} className="mr-2 px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300">
                  Hủy
               </button>
               <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Tiếp Tục
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateExamModal;
