import React, { useState } from 'react';
import axios from 'axios';

const CardClassList = ({ classInfo, onEditSuccess, onDeleteSuccess }) => {
   const [showEditModal, setShowEditModal] = useState(false); // Trạng thái hiển thị modal chỉnh sửa
   const [showInviteModal, setShowInviteModal] = useState(false); // Trạng thái hiển thị modal mời thành viên
   const [editedName, setEditedName] = useState(classInfo.name); // Tên lớp chỉnh sửa
   const [editedCode, setEditedCode] = useState(classInfo.code); // Mã lớp chỉnh sửa
   const [inviteEmails, setInviteEmails] = useState(''); // Input cho danh sách email để mời
   const [isInviting, setIsInviting] = useState(false); // Trạng thái cho quá trình mời thành viên

   // Hàm xử lý xóa lớp học
   const handleDeleteClass = async () => {
      try {
         const response = await axios.delete(`http://localhost:5000/api/classrooms/${classInfo._id}`, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (response.status === 200) {
            onDeleteSuccess(classInfo._id); // Cập nhật danh sách lớp học sau khi xóa
            alert('Xóa lớp học thành công!');
         } else {
            console.error('Phản hồi API không thành công:', response.data);
            alert('Không thể xóa lớp học!');
         }
      } catch (error) {
         console.error('Lỗi khi xóa lớp học:', error);
         alert('Không thể xóa lớp học!');
      }
   };

   // Hàm xử lý cập nhật lớp học
   const handleEditClass = async () => {
      try {
         const updatedClass = {
            name: editedName,
            code: editedCode,
         };
         const response = await axios.put(`http://localhost:5000/api/classrooms/${classInfo._id}`, updatedClass, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (response.status === 200) {
            onEditSuccess(response.data.classRoom); // Cập nhật thông tin lớp học sau khi chỉnh sửa
            setShowEditModal(false); // Đóng modal chỉnh sửa
            alert('Cập nhật lớp học thành công!');
         }
      } catch{
         alert('Cập nhật lớp học thành công!');
      }
   };

   // Hàm xử lý mời thành viên vào lớp học
   const handleInviteMembers = async () => {
      const emailList = inviteEmails.split(',').map((email) => email.trim()); // Tách email thành mảng
      if (emailList.length === 0) {
         alert('Vui lòng nhập ít nhất một email!');
         return;
      }

      setIsInviting(true); // Bắt đầu trạng thái mời
      try {
         const response = await axios.put(`http://localhost:5000/api/classrooms/${classInfo._id}/invite`, { emails: emailList }, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         if (response.status === 200) {
            console.log('Phản hồi từ API mời thành viên:', response.data);
            alert('Mời thành viên thành công!');
            setInviteEmails(''); // Reset danh sách email
            setShowInviteModal(false); // Đóng modal mời thành viên
         } else {
            console.error('Phản hồi API không thành công:', response.data);
            alert('Không thể mời thành viên!');
         }
      } catch (error) {
         console.error('Lỗi khi mời thành viên:', error);
         alert('Không thể mời thành viên!');
      } finally {
         setIsInviting(false); // Kết thúc trạng thái mời
      }
   };

   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-2 w-64">
         {/* Mã lớp và tiêu đề */}
         <div className="flex items-center justify-between mb-4">
            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
               Mã lớp: {classInfo.code}
            </span>
            <span className="text-sm bg-blue-700 px-2 py-1 rounded text-white">
               Thành viên: {classInfo.learners ? classInfo.learners.length : 0}
            </span>
         </div>

         {/* Tên lớp học */}
         <h3 className="text-lg font-bold mb-2 text-gray-800">{classInfo.name}</h3>

         {/* Thông tin khác */}
         <p className="text-sm mb-4 text-gray-600">
            Yêu cầu chờ duyệt: {classInfo.pending_requests ? classInfo.pending_requests.length : 0}
         </p>

         {/* Các nút hành động */}
         <div className="flex justify-around mt-4">
            <button
               onClick={() => setShowInviteModal(true)} // Hiển thị modal mời thành viên
               className="bg-green-500 text-white rounded-lg px-3 py-1 hover:bg-green-600 transition duration-200"
            >
               Mời
            </button>
            <button
               onClick={() => setShowEditModal(true)} // Hiển thị modal chỉnh sửa khi nhấn "Sửa"
               className="bg-yellow-500 text-white rounded-lg px-3 py-1 hover:bg-yellow-600 transition duration-200"
            >
               Sửa
            </button>
            <button
               onClick={handleDeleteClass}
               className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition duration-200"
            >
               Xóa
            </button>
         </div>

         {/* Modal chỉnh sửa lớp học */}
         {showEditModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-xl font-semibold mb-4">Chỉnh sửa lớp học</h3>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Tên lớp:</label>
                     <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border rounded p-2 w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Mã lớp:</label>
                     <input
                        type="text"
                        value={editedCode}
                        onChange={(e) => setEditedCode(e.target.value)}
                        className="border rounded p-2 w-full"
                     />
                  </div>
                  <div className="flex justify-end space-x-4">
                     <button
                        onClick={handleEditClass}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                     >
                        Cập nhật
                     </button>
                     <button
                        onClick={() => setShowEditModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                     >
                        Hủy
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Modal mời thành viên */}
         {showInviteModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-xl font-semibold mb-4">Mời thành viên</h3>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Danh sách email (ngăn cách bởi dấu phẩy):</label>
                     <textarea
                        value={inviteEmails}
                        onChange={(e) => setInviteEmails(e.target.value)}
                        className="border rounded p-2 w-full h-24"
                     />
                  </div>
                  <div className="flex justify-end space-x-4">
                     <button
                        onClick={handleInviteMembers}
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ${isInviting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isInviting}
                     >
                        {isInviting ? 'Đang mời...' : 'Mời'}
                     </button>
                     <button
                        onClick={() => setShowInviteModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                     >
                        Hủy
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default CardClassList;
