import React, { useState } from 'react';
import ClassCard from '../../components/learner/ClassCard';
import HeaderComponent from '../../components/learner/LearnerHeader';
import { Menu, MenuButton, MenuItem, MenuItems, Popover } from '@headlessui/react';

const ClassList = () => {
   // Dữ liệu lớp học giả lập
   const classes = [
      {
         code: 'C3056ZN5',
         name: 'Test lớp',
         members: 2,
         joined: false,
         image: 'https://via.placeholder.com/150/0000FF/808080?text=Class+Image+1', // Đường dẫn ảnh giả lập
      },
      {
         code: 'D4034XD9',
         name: 'Lớp Hóa học',
         members: 3,
         joined: false,
         image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Class+Image+2', // Đường dẫn ảnh giả lập
      },
   ];
   const [classCode, setClassCode] = useState('');
   return (
      <div className=" bg-gray-50">
         {/* Header */}
         <HeaderComponent />
         <div className="min-h-screen bg-gray px-16 py-12">
            {/* Nút tham gia lớp */}
            <div className="flex justify-end mb-6">
               <Popover className="relative">
                  {/* Nút mở popover */}
                  <Popover.Button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                     Tham gia lớp
                  </Popover.Button>

                  {/* Nội dung popover */}
                  <Popover.Panel
                     className="absolute z-10 mt-2 right-0 transform translate-x-10 w-80 p-6 bg-white border border-gray-300 rounded-lg shadow-lg"
                  >
                     {/* Tiêu đề */}
                     <h3 className="text-center text-xl font-semibold text-indigo-700 mb-6">Tham gia lớp</h3>

                     {/* Ô nhập mã lớp */}
                     <input
                        type="text"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="Mã lớp"
                        className="w-full px-3 py-2 border-b-2 border-gray-400 focus:outline-none text-gray-600 mb-8"
                     />

                     {/* Nút xác nhận */}
                     <div className="flex justify-end">
                        <button
                           className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                           onClick={() => alert(`Mã lớp: ${classCode}`)}
                        >
                           Tham gia lớp
                        </button>
                     </div>
                  </Popover.Panel>
               </Popover>
            </div>

            {/* Danh sách các lớp học */}
            <div className="flex flex-wrap gap-8">
               {classes.map((classItem, index) => (
                  <ClassCard
                     key={index}
                     code={classItem.code}
                     name={classItem.name}
                     members={classItem.members}
                     joined={classItem.joined}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default ClassList;
