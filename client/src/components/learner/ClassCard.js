import React from 'react';
import { LogIn } from 'lucide-react';

const ClassCard = ({ code, title, members, joined }) => {
   return (
      <div className="flex flex-col w-64 p-4 bg-white border border-gray-300 rounded-lg shadow-sm">
         {/* Mã lớp */}
         <div className="bg-blue-500 text-white text-sm px-2 py-1 rounded-lg w-min mb-2">{code}</div>

         {/* Tên lớp */}
         <h3 className="text-lg font-bold text-gray-700 mb-2">{title}</h3>

         {/* Số thành viên */}
         <div className="text-gray-600 mb-4">{members} thành viên</div>

         {/* Trạng thái tham gia */}

         <button className="px-4 py-2 text-gray-600 font-semibold border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
            Đã Tham Gia
         </button>


         {/* Nút vào lớp - Chỉ hiển thị nếu đã tham gia */}

         <div className="mt-4 flex justify-end" title='Thoát khỏi lớp'>
            <LogIn className="h-5 w-5 text-gray-400 hover:text-gray-700 cursor-pointer" />
         </div>
      </div>
   );
};

export default ClassCard;
