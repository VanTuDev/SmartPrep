import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

const FilterModal = ({ isOpen, onClose, grades, filters, setFilters, onApply }) => {
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);

   // Fetch categories when a grade is selected
   useEffect(() => {
      if (filters.gradeId) {
         axios
            .get(`http://localhost:5000/api/instructor/category/getCategoryByGrade?grade_id=${filters.gradeId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => setCategories(response.data))
            .catch(() => setCategories([])); // Clear categories if fetch fails
      } else {
         setCategories([]); // Reset if no grade is selected
      }
   }, [filters.gradeId]);

   // Fetch groups when a category is selected
   useEffect(() => {
      if (filters.categoryId) {
         axios
            .get(`http://localhost:5000/api/instructor/groups/byCategory?category_id=${filters.categoryId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            })
            .then((response) => setGroups(response.data))
            .catch(() => setGroups([])); // Clear groups if fetch fails
      } else {
         setGroups([]); // Reset if no category is selected
      }
   }, [filters.categoryId]);

   return (
      <Modal isOpen={isOpen} onRequestClose={onClose} className="p-6 bg-white rounded-lg max-w-md mx-auto mt-20">
         <h2 className="text-lg font-semibold mb-4">Bộ lọc câu hỏi</h2>
         <div className="space-y-4">
            <div>
               <label className="block mb-2 font-medium">Chọn Khối</label>
               <select
                  value={filters.gradeId}
                  onChange={(e) => setFilters({ ...filters, gradeId: e.target.value, categoryId: '', groupId: '' })}
                  className="w-full p-2 border rounded-lg"
               >
                  <option value="">Tất cả Khối</option>
                  {grades.map((grade) => (
                     <option key={grade._id} value={grade._id}>
                        {grade.name}
                     </option>
                  ))}
               </select>
            </div>
            <div>
               <label className="block mb-2 font-medium">Chọn Môn học</label>
               <select
                  value={filters.categoryId}
                  onChange={(e) => setFilters({ ...filters, categoryId: e.target.value, groupId: '' })}
                  className="w-full p-2 border rounded-lg"
                  disabled={!filters.gradeId}
               >
                  <option value="">Tất cả Môn</option>
                  {categories.map((category) => (
                     <option key={category._id} value={category._id}>
                        {category.name}
                     </option>
                  ))}
               </select>
            </div>
            <div>
               <label className="block mb-2 font-medium">Chọn Chương</label>
               <select
                  value={filters.groupId}
                  onChange={(e) => setFilters({ ...filters, groupId: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  disabled={!filters.categoryId}
               >
                  <option value="">Tất cả Chương</option>
                  {groups.map((group) => (
                     <option key={group._id} value={group._id}>
                        {group.name}
                     </option>
                  ))}
               </select>
            </div>
         </div>
         <div className="mt-6 flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">Hủy</button>
            <button onClick={onApply} className="px-4 py-2 bg-purple-700 text-white rounded-lg">
               Áp dụng
            </button>
         </div>
      </Modal>
   );
};

export default FilterModal;
