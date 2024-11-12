import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardClassList from './CardClassList';
import InstructorHeader from 'components/instructor/InstructorHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateClassForm from './CreateClassForm';

const ViewClassList = () => {
   const [classes, setClasses] = useState([]); // Danh sách lớp học
   const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
   const [isCreating, setIsCreating] = useState(false); // Trạng thái form tạo lớp
   const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
   const [error, setError] = useState(''); // Hiển thị lỗi

   const token = localStorage.getItem('token'); // Lấy token từ localStorage

   // Cấu hình axios instance với token để xác thực
   const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   // Hàm gọi API lấy danh sách lớp học
   useEffect(() => {
      const fetchClasses = async () => {
         try {
            if (!token) {
               setError('Vui lòng đăng nhập để xem danh sách lớp học.');
               setIsLoading(false);
               return;
            }

            const response = await axiosInstance.get('/classrooms/instructor/classes');
            console.log('Dữ liệu lớp học:', response.data); // Kiểm tra dữ liệu từ API

            if (response.status === 200 && response.data.classes) {
               setClasses(response.data.classes); // Gán danh sách lớp học
            } else {
               setError('Không thể lấy danh sách lớp học. Vui lòng thử lại!');
            }
         } catch (error) {
            console.error('Lỗi khi lấy danh sách lớp:', error);
            setError('Không thể lấy danh sách lớp học.');
         } finally {
            setIsLoading(false); // Kết thúc trạng thái tải
         }
      };

      fetchClasses();
   }, [token]);

   // Hàm xử lý tạo lớp mới
   const handleCreateClass = async (newClass) => {
      try {
         const response = await axiosInstance.post('/classrooms/instructor/create', newClass);
         setClasses([...classes, response.data.classRoom]); // Cập nhật danh sách lớp học
         setIsCreating(false); // Đóng form
         toast.success('Tạo lớp thành công!');
      } catch (error) {
         console.error('Lỗi khi tạo lớp học:', error);
         toast.error('Không thể tạo lớp học.');
      }
   };

   const handleDeleteSuccess = (deletedClassId) => {
      // Cập nhật danh sách lớp bằng cách loại bỏ lớp đã bị xóa
      setClasses((prevClasses) =>
         prevClasses.filter((classInfo) => classInfo._id !== deletedClassId)
      );
   };

   const handleEditSuccess = (updatedClass) => {
      if (!updatedClass || !updatedClass._id) {
         console.error('Dữ liệu lớp học không hợp lệ:', updatedClass);
         return; // Ngăn cập nhật state nếu dữ liệu không hợp lệ
      }
   
      setClasses((prevClasses) =>
         prevClasses.map((classInfo) =>
            classInfo._id === updatedClass._id ? updatedClass : classInfo
         )
      );
   };

   // Hàm lọc danh sách lớp theo từ khóa
   const filteredClasses = classes.filter((classInfo) =>
      classInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div>
         <InstructorHeader />
         <ToastContainer position="top-center" autoClose={3000} />
         <div className="flex flex-col items-center min-h-screen">
            <div className="w-10/12 bg-white p-8 mt-6">
               {/* Thanh tìm kiếm và nút tạo lớp */}
               <div className="flex justify-between items-center mb-4">
                  <input
                     type="text"
                     placeholder="Nhập từ khóa"
                     className="border-b-2 border-black w-96 text-gray-700 py-2 focus:outline-none"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                     className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                     onClick={() => setIsCreating(true)}
                  >
                     Tạo lớp +
                  </button>
               </div>

               {/* Thông báo lỗi */}
               {error && <p className="text-red-500 mb-4">{error}</p>}

               {/* Trạng thái tải dữ liệu */}
               {isLoading ? (
                  <p>Đang tải dữ liệu...</p>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {filteredClasses.length > 0 ? (
                        filteredClasses.map((classInfo) => (
                           <CardClassList
                              key={classInfo._id} // Đảm bảo classInfo có _id
                              classInfo={classInfo} // Truyền classInfo vào CardClassList
                              onDeleteSuccess={handleDeleteSuccess}
                              onEditSuccess={handleEditSuccess}
                           />
                        ))
                     ) : (
                        <p>Không có lớp học nào. Hãy tạo lớp mới!</p>
                     )}
                  </div>
               )}
            </div>
         </div>

         {/* Hiển thị form tạo lớp nếu đang tạo */}
         {isCreating && (
            <CreateClassForm
               onCreate={handleCreateClass}
               onClose={() => setIsCreating(false)}
            />
         )}
      </div>
   );
};

export default ViewClassList;
