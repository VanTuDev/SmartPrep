import React, { useState } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';

const GroupList = () => {
   const [groups, setGroups] = useState([]);
   const [newGroupName, setNewGroupName] = useState('');
   const [editedGroup, setEditedGroup] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [showModal, setShowModal] = useState(false);

   const handleAddGroup = () => {
      if (newGroupName.trim() === '') {
         alert('Vui lòng nhập tên nhóm.');
         return;
      }

      const newGroup = {
         name: newGroupName,
         questionCount: 0 // Khởi tạo số lượng câu hỏi
      };

      setGroups([...groups, newGroup]);
      resetForm();
   };

   const handleEditGroup = (index) => {
      const groupToEdit = groups[index];
      setEditedGroup({ ...groupToEdit, index });
      setNewGroupName(groupToEdit.name);
      setShowModal(true);
   };

   const handleUpdateGroup = () => {
      if (editedGroup === null) return;

      const updatedGroups = [...groups];
      updatedGroups[editedGroup.index] = {
         name: newGroupName,
         questionCount: updatedGroups[editedGroup.index].questionCount // Giữ nguyên số lượng câu hỏi
      };

      setGroups(updatedGroups);
      resetForm();
   };

   const handleDeleteGroup = (index) => {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhóm này?");
      if (confirmDelete) {
         const updatedGroups = groups.filter((_, i) => i !== index);
         setGroups(updatedGroups);
      }
   };

   const resetForm = () => {
      setNewGroupName('');
      setEditedGroup(null);
      setShowModal(false);
   };

   const filteredGroups = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         {/* Thanh tìm kiếm và nút tạo nhóm */}
         <div className="flex justify-between mb-4">
            <input
               type="text"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               placeholder="Tìm kiếm"
               className="p-2 border border-gray-300 rounded-md flex-1 mr-2"
            />
            <button
               onClick={() => {
                  resetForm(); // Reset form trước khi mở modal
                  setShowModal(true);
               }}
               className="bg-purple-600 text-white px-4 py-2 rounded-md"
            >
               Tạo nhóm +
            </button>
         </div>

         {/* Danh sách nhóm */}
         <div className="space-y-4">
            {filteredGroups.length === 0 ? (
               <div className="text-center mt-4 text-gray-600">
                  Hiện tại không có nhóm nào.
               </div>
            ) : (
               filteredGroups.map((group, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{group.name}</h3>
                        <div className="flex space-x-2">
                           <button onClick={() => handleEditGroup(index)} className="text-blue-500 hover:text-blue-700 flex items-center space-x-1">
                              <Edit />
                              <span>Chỉnh sửa</span>
                           </button>
                           <button onClick={() => handleDeleteGroup(index)} className="text-red-500 hover:text-red-700 flex items-center space-x-1">
                              <Trash2 />
                              <span>Xóa</span>
                           </button>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>

         {/* Modal cho thêm hoặc chỉnh sửa nhóm */}
         {showModal && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
               <div className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4">{editedGroup !== null ? 'Chỉnh sửa nhóm' : 'Thêm nhóm'}</h3>
                  <div className="mb-4">
                     <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Tên nhóm"
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
                        onClick={editedGroup !== null ? handleUpdateGroup : handleAddGroup}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md"
                     >
                        {editedGroup !== null ? 'Cập nhật' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default GroupList;
