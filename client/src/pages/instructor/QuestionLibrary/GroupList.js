import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Search } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupList = () => {
   const [groups, setGroups] = useState([]);
   const [newGroupName, setNewGroupName] = useState('');
   const [newGroupDescription, setNewGroupDescription] = useState('');
   const [showModal, setShowModal] = useState(false);
   const [editingGroupIndex, setEditingGroupIndex] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');

   useEffect(() => {
      fetchGroups();
   }, []);

   const fetchGroups = async () => {
      try {
         const response = await fetch('http://localhost:5000/api/groups', {
            headers: {
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
         });
         const data = await response.json();
         console.log('Fetched groups:', data);
         if (Array.isArray(data)) {
            setGroups(data);
         } else {
            console.error('Unexpected data format', data);
         }
      } catch (error) {
         console.error('Error fetching groups:', error);
         toast.error('Có lỗi khi lấy danh sách nhóm.');
      }
   };

   const handleAddGroup = async () => {
      const newGroup = {
         name: newGroupName,
         description: newGroupDescription,
      };

      try {
         const response = await fetch('http://localhost:5000/api/groups/create', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(newGroup),
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error creating group');
         }

         const createdGroup = await response.json();
         setGroups([...groups, createdGroup.group]);
         toast.success('Nhóm đã được tạo thành công!');
         resetForm();
      } catch (error) {
         console.error('Error adding group:', error);
         toast.error(error.message);
      }
   };

   const handleEditGroup = (index) => {
      const groupToEdit = groups[index];
      setEditingGroupIndex(index);
      setNewGroupName(groupToEdit.name);
      setNewGroupDescription(groupToEdit.description);
      setShowModal(true);
   };

   const handleUpdateGroup = async () => {
      if (editingGroupIndex === null) return;

      const updatedGroup = {
         name: newGroupName,
         description: newGroupDescription,
      };

      try {
         const groupId = groups[editingGroupIndex]._id;
         const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedGroup),
         });

         if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.error || 'Error updating group');
         }

         const updatedData = await response.json();
         const updatedGroups = [...groups];
         updatedGroups[editingGroupIndex] = updatedData.group;
         setGroups(updatedGroups);
         toast.success('Nhóm đã được cập nhật thành công!');
         resetForm();
      } catch (error) {
         console.error('Error updating group:', error);
         toast.error(error.message);
      }
   };

   const handleDeleteGroup = async (index) => {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa nhóm này?");
      if (confirmDelete) {
         try {
            const groupId = groups[index]._id;
            const response = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
               method: 'DELETE',
               headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
               },
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               throw new Error(errorResponse.error || 'Error deleting group');
            }

            const updatedGroups = groups.filter((_, i) => i !== index);
            setGroups(updatedGroups);
            toast.success('Nhóm đã được xóa thành công!');
         } catch (error) {
            console.error('Error deleting group:', error);
            toast.error(error.message);
         }
      }
   };

   const resetForm = () => {
      setNewGroupName('');
      setNewGroupDescription('');
      setEditingGroupIndex(null);
      setShowModal(false);
   };

   const filteredGroups = groups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
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
               Tạo nhóm +
            </button>
         </div>

         <div className="space-y-4">
            {filteredGroups.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center mt-20">
                  <img src="/image/empty@2x.png" alt="No groups" className="w-1/6 mb-6" />
                  <p className="text-600">Hiện tại không có nhóm nào. Nhấn tạo để thêm mới.</p>
               </div>
            ) : (
               filteredGroups.map((group, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                           <h3 className="font-semibold">{group.name}</h3>
                           <span className="text-gray-500">Mô tả: {group.description}</span>
                        </div>
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
                  <h3 className="text-lg font-semibold mb-4">{editingGroupIndex !== null ? 'Chỉnh sửa nhóm' : 'Thêm nhóm'}</h3>
                  <div className="mb-4">
                     <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Tên nhóm"
                        className="p-2 border border-gray-300 rounded-md flex-1"
                     />
                  </div>
                  <div className="mb-4">
                     <input
                        type="text"
                        value={newGroupDescription}
                        onChange={(e) => setNewGroupDescription(e.target.value)}
                        placeholder="Mô tả nhóm"
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
                        onClick={editingGroupIndex !== null ? handleUpdateGroup : handleAddGroup}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md"
                     >
                        {editingGroupIndex !== null ? 'Cập nhật' : 'Thêm'}
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default GroupList;
