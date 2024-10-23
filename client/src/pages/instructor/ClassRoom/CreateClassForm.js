import React, { useState } from 'react';

const CreateClassForm = ({ onCreate, onClose }) => {
   const [className, setClassName] = useState('');
   const [description, setDescription] = useState('');

   // Hàm xử lý khi nhấn nút "Tạo lớp"
   const handleCreateClass = () => {
      if (className.trim() === '') {
         alert('Vui lòng nhập tên lớp!');
         return;
      }
 
      // Tạo một lớp mới với dữ liệu nhập vào
      const newClass = {
         _id: Math.random().toString(36).substr(2, 9), // Tạo ID ngẫu nhiên cho lớp
         code: `CLASS${Math.floor(1000 + Math.random() * 9000)}`, // Mã lớp ngẫu nhiên
         name: className,
         members: 0,
         description: description
      };

      onCreate(newClass); // Gửi dữ liệu lớp mới lên component cha
      onClose(); // Đóng form
   };

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Tạo lớp mới</h2>
            <div className="mb-4">
               <label className="block mb-2">Tên lớp:</label>
               <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
               />
            </div>
            <div className="mb-4">
               <label className="block mb-2">Mô tả:</label>
               <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 w-full"
               />
            </div>
            <div className="flex justify-end">
               <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={onClose}
               >
                  Hủy
               </button>
               <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  onClick={handleCreateClass}
               >
                  Tạo lớp
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateClassForm;