import React, { useState } from 'react';

const InviteLearnerForm = ({ onInvite, onClose }) => {
   const [emails, setEmails] = useState('');

   // Kiểm tra email đầu vào có hợp lệ không trước khi gọi hàm `onInvite`
   const handleInvite = () => {
      if (!emails) {
         alert("Vui lòng nhập email!");
         return;
      }

      const emailList = emails.split(',').map((email) => email.trim());
      if (emailList.length === 0) {
         alert("Vui lòng nhập ít nhất một email hợp lệ!");
         return;
      }

      // Gọi hàm `onInvite` với danh sách email sau khi đã kiểm tra
      onInvite(emailList);
      onClose();
   };

   return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
         <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Mời thành viên</h2>
            <textarea
               value={emails}
               onChange={(e) => setEmails(e.target.value)}
               className="border border-gray-300 rounded-lg p-2 w-full mb-4"
               placeholder="Nhập danh sách email, ngăn cách bằng dấu phẩy"
            />
            <div className="flex justify-end">
               <button
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg mr-2"
                  onClick={onClose}
               >
                  Hủy
               </button>
               <button
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                  onClick={handleInvite}
               >
                  Mời
               </button>
            </div>
         </div>
      </div>
   );
};

export default InviteLearnerForm;
