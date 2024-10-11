import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardClassList from './CardClassList';
import HeaderClassRoom from './HeaderClassRoom';
import CreateClassForm from './CreateClassForm';
import InstructorHeader from 'components/instructor/InstructorHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewClassList = () => {
   const [classes, setClasses] = useState([]); // Danh sách lớp học
   const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
   const [isCreating, setIsCreating] = useState(false); // Trạng thái hiển thị form tạo lớp
   const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
   const [error, setError] = useState(''); // Trạng thái hiển thị lỗi

   // Lấy token từ localStorage
   const token = localStorage.getItem('token');

   // Cấu hình axios với token để xác thực
   const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
         Authorization: `Bearer ${token}`, // Sử dụng token từ localStorage
      },
   });

   // Lấy danh sách lớp học từ server khi component mount
   useEffect(() => {
      const fetchClasses = async () => {
         try {
            // Kiểm tra nếu không có token
            if (!token) {
               setError('Vui lòng đăng nhập để lấy danh sách lớp học.');
               setIsLoading(false);
               return;
            }

            // Gửi yêu cầu đến API để lấy danh sách lớp học
            const response = await axiosInstance.get('/classrooms/instructor');

            // Kiểm tra phản hồi từ server
            if (response && response.data && response.data.classes) {
               setClasses(response.data.classes); // Gán danh sách lớp học vào state
            } else {
               setError('Không thể lấy danh sách lớp học. Vui lòng thử lại!');
            }
            setIsLoading(false); // Kết thúc trạng thái tải
         } catch (error) {
            console.error('Lỗi khi lấy danh sách lớp học:', error);
            setError('Không thể lấy danh sách lớp học. Vui lòng thử lại!');
            setIsLoading(false); // Kết thúc trạng thái tải nếu lỗi xảy ra
         }
      };
      fetchClasses();
   }, [token]); // Chạy lại khi token thay đổi

   // Cập nhật từ khóa tìm kiếm
   const handleSearch = (event) => {
      setSearchTerm(event.target.value);
   };

   // Lọc danh sách lớp theo từ khóa tìm kiếm
   const filteredClasses = classes.filter((classInfo) =>
      classInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   // Xử lý khi nhấn nút "Tạo lớp"
   const handleCreateClass = async (newClass) => {
      try {
         const response = await axiosInstance.post('/classrooms/create', newClass);
         setClasses([...classes, response.data.classRoom]);
         setIsCreating(false); // Đóng form sau khi tạo lớp thành công
         toast.success('Tạo lớp học thành công!');
      } catch (error) {
         console.error('Lỗi khi tạo lớp học:', error);
         toast.error('Không thể tạo lớp học. Vui lòng thử lại!');
      }
   };

   return (
      <div>
         <InstructorHeader />
         <HeaderClassRoom />
         <ToastContainer position="top-center" autoClose={3000} />
         <div className="flex flex-col items-center min-h-screen">
            <div className="w-10/12 bg-white p-8 mt-6">
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

               {/* Hiển thị thông báo lỗi nếu có */}
               {error && <p className="text-red-500 mb-4">{error}</p>}

               {/* Hiển thị trạng thái tải dữ liệu */}
               {isLoading && <p>Đang tải dữ liệu...</p>}

               {/* Hiển thị thông báo nếu không có lớp học nào */}
               {!isLoading && classes.length === 0 && (
                  <p>Không có lớp học nào. Hãy tạo lớp mới!</p>
               )}

               {/* Danh sách các lớp học hiển thị dưới dạng thẻ */}
               <div className="w-5/12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredClasses.map((classInfo) => (
                     <CardClassList
                        key={classInfo._id}
                        classInfo={classInfo}
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
