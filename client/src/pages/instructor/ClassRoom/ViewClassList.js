import React, { useState } from 'react';
import CardClassList from './CardClassList';
import HeaderClassRoom from './HeaderClassRoom';
import CreateClassForm from './CreateClassForm';
import InstructorHeader from 'components/instructor/InstructorHeader';

// Dữ liệu giả (mockData) để hiển thị các lớp học
const mockData = [
   { _id: '1', code: 'RPAP1V02', name: 'Lớp Tiếng Anh', members: 15 },
   { _id: '2', code: 'MATH1234', name: 'Lớp Toán Cao Cấp', members: 30 },
   { _id: '3', code: 'PHYS2345', name: 'Lớp Vật Lý Đại Cương', members: 20 },
   { _id: '4', code: 'CHEM5678', name: 'Lớp Hóa Học', members: 18 }
];

const ViewClassList = () => {
   const [classes, setClasses] = useState(mockData); // Sử dụng mockData làm dữ liệu khởi tạo
   const [searchTerm, setSearchTerm] = useState('');
   const [isCreating, setIsCreating] = useState(false); // Trạng thái để hiển thị form tạo lớp

   // Xử lý khi nhấn nút "Mời thành viên"
   const handleInviteClick = (classInfo) => {
      alert(`Mời thành viên vào lớp ${classInfo.name}`);
   };

   // Cập nhật từ khóa tìm kiếm
   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   // Lọc danh sách lớp theo từ khóa tìm kiếm
   const filteredClasses = classes.filter((classInfo) =>
      classInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // Thêm lớp mới vào danh sách
   const handleCreateClass = (newClass) => {
      setClasses([...classes, newClass]);
   };

   return (
      <div>
         <InstructorHeader />
         <HeaderClassRoom />
         <div className="flex flex-col items-center min-h-screen">
            <div className="w-10/12 bg-white p-8 mt-6 ">
               {/* Thanh header chứa ô tìm kiếm và nút "Tạo lớp" */}
               <div className="flex justify-between items-center mb-4">
                  {/* Ô tìm kiếm */}
                  <div className="flex items-center">
                     <input
                        type="text"
                        placeholder="Nhập từ khóa"
                        className="appearance-none bg-transparent border-b-2 border-black w-96 text-gray-700 mr-3 py-2 leading-tight focus:outline-none"
                        value={searchTerm}
                        onChange={handleSearch}
                     />
                     {/* Icon tìm kiếm */}
                     <svg
                        className="w-5 h-5 text-gray-500 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                     </svg>
                  </div>

                  {/* Nút "Tạo lớp" */}
                  <button
                     className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                     onClick={() => setIsCreating(true)} // Hiển thị form tạo lớp
                  >
                     Tạo lớp +
                  </button>
               </div>

               {/* Danh sách các lớp học hiển thị dưới dạng thẻ với 4 cột */}
               <div className=" w-5/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((classInfo) => (
                     <CardClassList
                        key={classInfo._id}
                        classInfo={classInfo}
                        onInviteClick={handleInviteClick}
                     />
                  ))}
               </div>
            </div>
         </div>

         {/* Hiển thị form tạo lớp nếu đang trong trạng thái "isCreating" */}
         {isCreating && (
            <CreateClassForm
               onCreate={handleCreateClass} // Xử lý tạo lớp mới
               onClose={() => setIsCreating(false)} // Đóng form tạo lớp
            />
         )}
      </div>
   );
};

export default ViewClassList;
