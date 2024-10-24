import React, { useState } from 'react';
import { Eye, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ClassCard = ({ classInfo, onLeaveSuccess }) => {
   const [showConfirmModal, setShowConfirmModal] = useState(false); // State for modal visibility
   const token = localStorage.getItem('token'); // Get token from localStorage

   // Configure axios instance with token for authorization
   const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   // Handler to leave the class
   const handleLeaveClass = async () => {
      try {
         console.log('Leaving class with ID:', classInfo._id); // Debugging log

         const response = await axiosInstance.delete(`/classrooms/learner/${classInfo._id}/leave`);
         if (response.status === 200) {
            toast.success('Đã rời khỏi lớp thành công!');
            onLeaveSuccess(classInfo._id); // Update parent component’s state
         } else {
            toast.error('Không thể rời khỏi lớp.');
         }
      } catch (error) {
         console.error('Lỗi khi rời khỏi lớp:', error);
         toast.error('Lỗi trong quá trình rời lớp.');
      } finally {
         setShowConfirmModal(false); // Close the modal
   }
   };

   const navigate = useNavigate();

   const handleCardClick = () => {
      navigate(`/learner/dashboard/class/detail/${classInfo._id}`); // Navigate to class details page
   };

   return (
      <div className="flex flex-col w-64 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
         {/* Mã lớp */}

         <div className='flex justify-between items-center'>
            <div className="bg-blue-500 text-white text-sm px-2 py-1 rounded-lg w-min">
               {classInfo.code}
            </div>
            <div
               className="flex justify-end"
               title="Xem chi tiết lớp học"
               onClick={handleCardClick}
            >
               <Eye className="h-5 w-5 text-blue-300 hover:text-blue-700 cursor-pointer" />
            </div>
         </div>
         {/* Tên lớp */}
         <h3 className="text-lg font-bold text-gray-700 mb-2">{classInfo.name}</h3>

         {/* Số thành viên */}
         <div className="text-gray-600 mb-4">{classInfo.learners.length} thành viên</div>

         {/* Trạng thái tham gia */}
         <button className="px-4 py-2 text-gray-600 font-semibold border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
            Đã Tham Gia
         </button>

         {/* Nút rời lớp */}
         <div
            className="mt-4 flex justify-end"
            title="Thoát khỏi lớp"
            onClick={() => setShowConfirmModal(true)}
         >
            <LogIn className="h-5 w-5 text-gray-400 hover:text-gray-700 cursor-pointer" />
         </div>

         {/* Confirmation Modal */}
         {showConfirmModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
               <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-bold mb-4">Xác nhận rời lớp</h3>
                  <p>Bạn có chắc chắn muốn rời khỏi lớp <strong>{classInfo.name}</strong> không?</p>
                  <div className="flex justify-end mt-6 gap-4">
                     <button
                        className="px-4 py-2 bg-gray-300 rounded-md"
                        onClick={() => setShowConfirmModal(false)}
                     >
                        Hủy
                     </button>
                     <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        onClick={handleLeaveClass}
                     >
                        Rời Lớp
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default ClassCard;
