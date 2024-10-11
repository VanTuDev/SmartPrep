import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChooseRole = () => {
   const navigate = useNavigate();

   const handleRoleSelection = async (role) => {
      try {
         // Lấy thông tin userId từ localStorage
         const userId = localStorage.getItem('userId');
         if (!userId) {
            toast.error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            navigate('/login');
            return;
         }

         // Gửi yêu cầu cập nhật role
         const response = await fetch('http://localhost:5000/api/users/updateuser', {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ role }),
         });

         const result = await response.json();

         if (response.ok) {
            localStorage.setItem('userRole', role); // Lưu vai trò vào localStorage
            toast.success('Cập nhật vai trò thành công!');

            // Điều hướng đến trang tương ứng dựa trên vai trò
            if (role === 'instructor') {
               navigate('/instructor/dashboard');
            } else if (role === 'learner') {
               navigate('/learner/dashboard');
            }
         } else {
            toast.error(result.error || 'Cập nhật vai trò thất bại.');
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      }
   };

   return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl text-center mb-6 font-bold">Chọn vai trò của bạn</h2>
            <div className="flex justify-between gap-6">
               <div
                  className="cursor-pointer p-6 border border-gray-200 rounded-lg shadow-md text-center hover:bg-indigo-100"
                  onClick={() => handleRoleSelection('instructor')}
               >
                  <h3 className="text-xl font-semibold">Instructor</h3>
                  <p className="text-gray-500 mt-2">Dành cho giảng viên</p>
               </div>

               <div
                  className="cursor-pointer p-6 border border-gray-200 rounded-lg shadow-md text-center hover:bg-indigo-100"
                  onClick={() => handleRoleSelection('learner')}
               >
                  <h3 className="text-xl font-semibold">Learner</h3>
                  <p className="text-gray-500 mt-2">Dành cho học viên</p>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ChooseRole;
