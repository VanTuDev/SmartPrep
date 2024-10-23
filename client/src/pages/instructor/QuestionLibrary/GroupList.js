import React, { useState, useEffect } from 'react';
import { Edit, Trash2, ChevronDown, ChevronRight, Plus, Save, X } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const GroupList = () => {
   const [groups, setGroups] = useState([]);
   const [categories, setCategories] = useState([]);
   const [newGroupName, setNewGroupName] = useState('');
   const [newGroupDescription, setNewGroupDescription] = useState('');
   const [editingGroupId, setEditingGroupId] = useState(null); // Track the editing group
   const [openCategory, setOpenCategory] = useState(null); // Manage expanded category

   useEffect(() => {
      fetchGroups();
      fetchCategories();
   }, []);

   const fetchGroups = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/groups', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setGroups(response.data);
      } catch (error) {
         toast.error('Có lỗi khi lấy danh sách chương.');
      }
   };

   const fetchCategories = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/category', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setCategories(response.data);
      } catch (error) {
         toast.error('Có lỗi khi lấy danh sách môn học.');
      }
   };

   const resetForm = () => {
      setNewGroupName('');
      setNewGroupDescription('');
      setEditingGroupId(null);
   };

   const handleAddOrUpdateGroup = async (categoryId) => {
      if (!newGroupName || !newGroupDescription) {
         toast.error('Tên và mô tả chương là bắt buộc.');
         return;
      }

      const groupData = {
         name: newGroupName,
         description: newGroupDescription,
         category_id: categoryId,
      };

      try {
         const url = editingGroupId
            ? `http://localhost:5000/api/instructor/groups/${editingGroupId}`
            : 'http://localhost:5000/api/instructor/groups/create';
         const method = editingGroupId ? 'PUT' : 'POST';

         await axios({
            method,
            url,
            data: groupData,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });

         toast.success(editingGroupId ? 'Chương đã được cập nhật!' : 'Chương đã được tạo!');
         fetchGroups();
         resetForm();
      } catch (error) {
         toast.error('Lỗi khi thêm hoặc cập nhật chương.');
      }
   };

   const handleEditGroup = (group) => {
      setNewGroupName(group.name);
      setNewGroupDescription(group.description);
      setEditingGroupId(group._id); // Track the group being edited
   };

   const handleDeleteGroup = async (groupId) => {
      const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa chương này?');
      if (confirmDelete) {
         try {
            await axios.delete(`http://localhost:5000/api/instructor/groups/${groupId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setGroups((prevGroups) => prevGroups.filter((group) => group._id !== groupId));
            toast.success('Chương đã được xóa thành công!');
         } catch (error) {
            toast.error('Lỗi khi xóa chương.');
         }
      }
   };

   const toggleCategory = (categoryId) => {
      setOpenCategory(openCategory === categoryId ? null : categoryId);
      resetForm();
   };

   const groupsByCategory = (categoryId) =>
      groups.filter((group) => group.category_id === categoryId);

   return (
      <div className="p-6 bg-white rounded-lg shadow-md">
         <ToastContainer />
         <div className="space-y-4">
            {categories.map((category) => (
               <div key={category._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <div
                     className="flex justify-between items-center cursor-pointer"
                     onClick={() => toggleCategory(category._id)}
                  >
                     <h2 className="font-bold text-lg">{category.name}</h2>
                     {openCategory === category._id ? <ChevronDown /> : <ChevronRight />}
                  </div>
                  {openCategory === category._id && (
                     <div className="mt-2 space-y-2">
                        {groupsByCategory(category._id).map((group) => (
                           <div key={group._id} className="p-2 bg-white rounded-lg shadow-sm">
                              {editingGroupId === group._id ? (
                                 <div className="space-y-2">
                                    <input
                                       type="text"
                                       value={newGroupName}
                                       onChange={(e) => setNewGroupName(e.target.value)}
                                       className="p-2 border border-gray-300 rounded-md w-full"
                                       placeholder="Tên chương"
                                    />
                                    <input
                                       type="text"
                                       value={newGroupDescription}
                                       onChange={(e) => setNewGroupDescription(e.target.value)}
                                       className="p-2 border border-gray-300 rounded-md w-full"
                                       placeholder="Mô tả chương"
                                    />
                                    <div className="flex justify-end space-x-2">
                                       <button
                                          onClick={() => handleAddOrUpdateGroup(category._id)}
                                          className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
                                       >
                                          <Save className="mr-1" /> Lưu
                                       </button>
                                       <button
                                          onClick={resetForm}
                                          className="bg-gray-300 px-4 py-2 rounded-md flex items-center"
                                       >
                                          <X className="mr-1" /> Hủy
                                       </button>
                                    </div>
                                 </div>
                              ) : (
                                 <div>
                                    <h3 className="font-semibold">{group.name}</h3>
                                    <p className="text-gray-500">{group.description}</p>
                                    <div className="flex justify-end space-x-2 mt-2">
                                       <button
                                          onClick={() => handleEditGroup(group)}
                                          className="text-blue-600 flex items-center"
                                       >
                                          <Edit className="mr-1" /> Chỉnh sửa
                                       </button>
                                       <button
                                          onClick={() => handleDeleteGroup(group._id)}
                                          className="text-red-600 flex items-center"
                                       >
                                          <Trash2 className="mr-1" /> Xóa
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        ))}

                        <div className="flex items-center space-x-2 mt-4">
                           <input
                              type="text"
                              value={newGroupName}
                              onChange={(e) => setNewGroupName(e.target.value)}
                              placeholder="Tên chương mới"
                              className="p-2 border border-gray-300 rounded-md w-full"
                           />
                           <input
                              type="text"
                              value={newGroupDescription}
                              onChange={(e) => setNewGroupDescription(e.target.value)}
                              placeholder="Mô tả chương mới"
                              className="p-2 border border-gray-300 rounded-md w-full"
                           />
                           <button
                              onClick={() => handleAddOrUpdateGroup(category._id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
                           >
                              <Plus className="mr-1" /> Thêm
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default GroupList;
