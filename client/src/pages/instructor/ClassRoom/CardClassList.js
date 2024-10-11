import React from 'react';

const CardClassList = ({ classInfo, onInviteClick }) => {
   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-2 w-64">
         <div className="flex items-center justify-between">
            {/* Hiển thị mã lớp học */}
            <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
               {classInfo.code}
            </span>
         </div>
         {/* Tên lớp học */}
         <h3 className="text-xl font-semibold mt-2">{classInfo.name}</h3>
         {/* Số lượng thành viên */}
         <p className="text-gray-600">Số lượng thành viên: {classInfo.members}</p>
         {/* Nút mời thành viên */}
         <button
            onClick={() => onInviteClick(classInfo)}
            className="bg-purple-500 text-white rounded-lg px-4 py-2 mt-4"
         >
            Mời thành viên
         </button>
      </div>
   );
};

export default CardClassList;
