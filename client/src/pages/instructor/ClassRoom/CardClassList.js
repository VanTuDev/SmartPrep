import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Eye, Pencil, Trash } from 'lucide-react';
import { Button, Modal } from 'antd';
import { useEffect } from 'react';
import Select from 'react-select';
import * as XLSX from 'xlsx';

const CardClassList = ({ classInfo, onEditSuccess, onDeleteSuccess }) => {
   const [showEditModal, setShowEditModal] = useState(false); // Trạng thái hiển thị modal chỉnh sửa
   const [showInviteModal, setShowInviteModal] = useState(false); // Trạng thái hiển thị modal mời thành viên
   const [editedName, setEditedName] = useState(classInfo.name); // Tên lớp chỉnh sửa
   const [editedCode, setEditedCode] = useState(classInfo.code); // Mã lớp chỉnh sửa
   const [inviteEmails, setInviteEmails] = useState(''); // Input cho danh sách email để mời
   const [isInviting, setIsInviting] = useState(false); // Trạng thái cho quá trình mời thành viên
   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
   const [learnerOptions, setLearnerOptions] = useState([]); // Lưu danh sách người dùng có role learner
   const [selectedLearners, setSelectedLearners] = useState([]); // Lưu trữ các learner được chọn
   const [excelLearners, setExcelLearners] = useState([]);

   useEffect(() => {
      const fetchLearners = async () => {
         try {
            const response = await axios.get('http://localhost:5000/api/users/instructors/learners', {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.status === 200) {
               const existingLearnerIds = classInfo.learners.map((learner) => learner._id.toString());
               const options = response.data
                  .filter((learner) => !existingLearnerIds.includes(learner._id.toString()))
                  .map((learner) => ({
                     value: learner._id,
                     label: `${learner.fullname} (${learner.email})`,
                     email: learner.email,
                  }));
               setLearnerOptions(options);
            }
         } catch (error) {
            console.error('Lỗi khi lấy danh sách learner:', error);
         }
      };
      fetchLearners();
   }, [classInfo.learners]);

   // Lọc email từ file Excel để đảm bảo chỉ mời learner
   const filterLearnerEmails = async (emails) => {
      try {
         const response = await axios.get('http://localhost:5000/api/users/instructors/learners', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         if (response.status === 200) {
            // Chỉ lấy các learner có email nằm trong danh sách emails từ file Excel
            const learnerEmails = response.data
               .filter((learner) => learner.role === 'learner' && emails.includes(learner.email))
               .map((learner) => learner.email);
            return learnerEmails;
         }
      } catch (error) {
         console.error('Lỗi khi lọc danh sách learner từ email:', error);
         return [];
      }
   };

   // Hàm xử lý xóa lớp học
   const handleDeleteClass = async () => {
      try {
         const response = await axios.delete(
            `http://localhost:5000/api/classrooms/instructor/delete/${classInfo._id}`,
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            }
         );

         if (response.status === 200) {
            onDeleteSuccess && onDeleteSuccess(classInfo._id);
            toast.success('Xóa lớp học thành công!');
         } else {
            toast.error('Không thể xóa lớp học!');
         }
      } catch (error) {
         console.error('Lỗi khi xóa lớp học:', error);
         toast.error('Đã xảy ra lỗi, vui lòng thử lại!');
      } finally {
         setIsDeleteModalVisible(false); // Close the modal
      }
   };


   // Hàm xử lý cập nhật lớp học
   const handleEditClass = async () => {
      try {
         const updatedClass = {
            name: editedName,
            code: editedCode,
         };

         const response = await axios.put(
            `http://localhost:5000/api/classrooms/instructor/update/${classInfo._id}`,
            updatedClass,
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            }
         );

         // Kiểm tra phản hồi API và lấy classroom từ response.data
         if (response.status === 200 && response.data.classroom) {
            onEditSuccess(response.data.classroom); // Đảm bảo đúng với cấu trúc trả về
            setShowEditModal(false); // Đóng modal sau khi cập nhật thành công
            toast.success(response.data.msg || 'Cập nhật lớp học thành công!');
         } else {
            toast.error('Không thể cập nhật lớp học!');
         }
      } catch (error) {
         console.error('Lỗi khi cập nhật lớp:', error);
         toast.error('Không thể cập nhật lớp học!');
      }
   };


   // Hàm xử lý khi tải lên file Excel
   const handleFileUpload = async (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = async (e) => {
         const data = new Uint8Array(e.target.result);
         const workbook = XLSX.read(data, { type: 'array' });
         const sheetName = workbook.SheetNames[0];
         const sheet = workbook.Sheets[sheetName];
         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

         // Lấy email từ cột đầu tiên của file Excel
         const emails = jsonData.slice(1).map((row) => row[0]).filter(Boolean);

         // Lọc chỉ lấy email của learner
         const filteredEmails = await filterLearnerEmails(emails);
         setExcelLearners(filteredEmails); // Lưu danh sách email learner hợp lệ từ file Excel

         // Loại bỏ những learner có email từ file Excel trong danh sách learnerOptions
         const filteredOptions = learnerOptions.filter(
            (option) => !filteredEmails.includes(option.email)
         );
         setLearnerOptions(filteredOptions);
      };

      reader.readAsArrayBuffer(file);
   };

   // Hàm mời thành viên khi nhấn "Mời"
   const handleInviteMembers = async () => {
      const emails = [...excelLearners, ...selectedLearners.map((learner) => learner.email)];

      if (emails.length === 0) {
         toast.error('Vui lòng chọn ít nhất một learner!');
         return;
      }

      setIsInviting(true);
      try {
         const response = await axios.post(
            `http://localhost:5000/api/classrooms/instructor/${classInfo._id}/add-learners`,
            { emails },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
         );

         if (response.status === 200) {
            const newLearners = response.data.addedLearners;
            const updatedClassInfo = { ...classInfo, learners: [...classInfo.learners, ...newLearners] };
            onEditSuccess(updatedClassInfo);
            setSelectedLearners([]);
            setExcelLearners([]);
            setShowInviteModal(false);
            toast.success('Mời thành viên thành công!');
         } else {
            toast.error('Không thể mời thành viên!');
         }
      } catch (error) {
         console.error('Lỗi khi mời thành viên:', error.response ? error.response.data : error.message);
         toast.error('Không thể mời thành viên!!!');
      } finally {
         setIsInviting(false);
      }
   };

   const handleInviteFromExcel = async (emails) => {
      setIsInviting(true);
      try {
         const response = await axios.post(
            `http://localhost:5000/api/classrooms/instructor/${classInfo._id}/add-learners`,
            { emails },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
         );

         if (response.status === 200) {
            const newLearners = response.data.addedLearners;
            const updatedClassInfo = { ...classInfo, learners: [...classInfo.learners, ...newLearners] };
            onEditSuccess(updatedClassInfo);
            toast.success('Mời thành viên từ file thành công!');
         } else {
            toast.error('Không thể mời thành viên từ file!');
         }
      } catch (error) {
         console.error('Lỗi khi mời thành viên từ file:', error.response ? error.response.data : error.message);
         toast.error('Không thể mời thành viên từ file!');
      } finally {
         setIsInviting(false);
      }
   };

   const navigate = useNavigate();

   const handleCardClick = () => {
      navigate(`/instructor/dashboard/class/detail/${classInfo._id}`); // Navigate to class details page
   };

   return (
      <div className="bg-white shadow-md rounded-lg p-4 m-2 w-64" >
         {/* Mã lớp và tiêu đề */}
         <div className="flex items-center justify-between mb-4">
            <span className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
               Mã lớp: {classInfo.code}
            </span>
            <span className="text-sm bg-blue-700 px-2 py-1 rounded text-white">
               Thành viên: {classInfo.learners ? classInfo.learners.length : 0}
            </span>
         </div>

         {/* Tên lớp học */}
         <h3 className="text-lg font-bold mb-2 text-gray-800">{classInfo.name}</h3>

         {/* Thông tin khác */}
         <p className="text-sm mb-4 text-gray-600">
            Yêu cầu chờ duyệt: {classInfo.pending_requests ? classInfo.pending_requests.length : 0}
         </p>

         {/* Các nút hành động */}
         <div className="flex justify-around mt-4">
            <Button
               onClick={() => setShowInviteModal(true)} // Hiển thị modal mời thành viên
               className="bg-green-500 text-white rounded-lg px-3 py-1 hover:bg-green-600 transition duration-200"
            >
               Mời
            </Button>
            <Button
               onClick={() => setShowEditModal(true)} // Hiển thị modal chỉnh sửa khi nhấn "Sửa"
               className="bg-yellow-500 text-white rounded-lg px-3 py-1 hover:bg-yellow-600 transition duration-200"
               title='Sửa thông tin lớp'
            >
               <Pencil />
            </Button>
            <Button
               type="primary"
               danger
               onClick={() => setIsDeleteModalVisible(true)} // Open confirmation modal
               title='Xoá lớp'
            >
               <Trash />
            </Button>
            <Button
               onClick={handleCardClick}
               className="bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-600 transition duration-200"
               title='Xem chi tiết'
            >
               <Eye />
            </Button>
         </div>

         {/* Modal chỉnh sửa lớp học */}
         {showEditModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-xl font-semibold mb-4">Chỉnh sửa lớp học</h3>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Tên lớp:</label>
                     <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border rounded p-2 w-full"
                     />
                  </div>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Mã lớp:</label>
                     <input
                        type="text"
                        value={editedCode}
                        onChange={(e) => setEditedCode(e.target.value)}
                        className="border rounded p-2 w-full"
                     />
                  </div>
                  <div className="flex justify-end space-x-4">
                     <button
                        onClick={handleEditClass}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
                     >
                        Cập nhật
                     </button>
                     <button
                        onClick={() => setShowEditModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                     >
                        Hủy
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Modal mời thành viên */}
         {showInviteModal && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
               <div className="bg-white rounded-lg p-6 w-96">
                  <h3 className="text-xl font-semibold mb-4">Mời thành viên</h3>
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Danh sách email (ngăn cách bởi dấu phẩy):</label>
                     <Select
                        isMulti
                        options={learnerOptions} // Các lựa chọn learner
                        value={selectedLearners}
                        onChange={(selected) => setSelectedLearners(selected)}
                        className="w-full"
                        placeholder="Chọn learner để mời vào lớp"
                        noOptionsMessage={() => 'Không còn learner nào để mời'}
                     />
                  </div>
                  {/* Thêm phần tải lên file Excel */}
                  <div className="mb-4">
                     <label className="block text-sm font-medium">Tải lên danh sách học sinh (Excel):</label>
                     <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        className="border rounded p-2 w-full"
                     />
                  </div>
                  <div className="flex justify-end space-x-4">
                     <button
                        onClick={handleInviteMembers}
                        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ${isInviting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={isInviting}
                     >
                        {isInviting ? 'Đang mời...' : 'Mời'}
                     </button>
                     <button
                        onClick={() => setShowInviteModal(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-200"
                     >
                        Hủy
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* Delete Confirmation Modal */}
         <Modal
            title="Xác nhận xóa lớp học"
            visible={isDeleteModalVisible}
            onOk={handleDeleteClass}
            onCancel={() => setIsDeleteModalVisible(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
         >
            <p>Bạn có chắc chắn muốn xóa lớp học này không?</p>
         </Modal>

      </div>
   );
};

export default CardClassList;