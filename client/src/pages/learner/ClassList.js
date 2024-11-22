import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClassCard from '../../components/learner/ClassCard';
import HeaderComponent from '../../components/learner/LearnerHeader';
import { Popover } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const  ClassList = () => {
    const [classes, setClasses] = useState([]); // Danh sách lớp học đã tham gia
    const [classCode, setClassCode] = useState(''); // Mã lớp học để tham gia
    const [isLoading, setIsLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(''); // Hiển thị lỗi nếu có
    const [searchTerm, setSearchTerm] = useState('');

    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    // Cấu hình axios instance với token để xác thực
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const filteredClasses = classes.filter((classInfo) =>
        classInfo.name.toLowerCase().includes(searchTerm.toLowerCase())
     );
    // Hàm lấy danh sách lớp học learner đã tham gia
    useEffect(() => {
        const fetchLearnerClasses = async () => {
            try {
                if (!token) {
                    setError('Vui lòng đăng nhập để xem danh sách lớp học.');
                    setIsLoading(false);
                    return;
                }

                const response = await axiosInstance.get('/classrooms/learner/classes');
                console.log('Dữ liệu lớp học đã tham gia:', response.data);

                if (response.status === 200 && response.data.classes) {
                    setClasses(response.data.classes); // Gán danh sách lớp học
                } else {
                    setError('Không thể lấy danh sách lớp học. Vui lòng thử lại!');
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách lớp học:', error);
                setError('Không thể lấy danh sách lớp học.');
            } finally {
                setIsLoading(false); // Kết thúc trạng thái tải
            }
        };

        fetchLearnerClasses();
    }, [token]);

    // Hàm xử lý tham gia lớp học
    const handleJoinClass = async () => {
        try {
           const response = await axiosInstance.post('/classrooms/learner/join', {
              code: classCode,
           });
  
           if (response.status === 200) {
              toast.success('Yêu cầu tham gia lớp đã được gửi.');
           }
        } catch (error) {
           console.error('Lỗi khi gửi yêu cầu tham gia lớp:', error);
           toast.error(
              error.response?.data?.message || 'Không thể gửi yêu cầu tham gia lớp.'
           );
        }
     };

    return (
        <div className="bg-gray-50">
            <HeaderComponent />
            <ToastContainer position="top-center" autoClose={3000} />
            <div className="min-h-screen bg-gray px-16 py-12">
                {/* Nút tham gia lớp */}
                <div className="flex justify-end mb-6">
                    <Popover className="relative">
                        <Popover.Button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                            Tham gia lớp
                        </Popover.Button>
                        <Popover.Panel className="absolute z-10 mt-2 right-0 w-80 p-6 bg-white border border-gray-300 rounded-lg shadow-lg">
                            <h3 className="text-center text-xl font-semibold text-indigo-700 mb-6">
                                Tham gia lớp
                            </h3>
                            <input
                                type="text"
                                value={classCode}
                                onChange={(e) => setClassCode(e.target.value)}
                                placeholder="Mã lớp"
                                className="w-full px-3 py-2 border-b-2 border-gray-400 focus:outline-none text-gray-600 mb-8"
                            />
                            <div className="flex justify-end">
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                    onClick={handleJoinClass}
                                >
                                    Tham gia lớp
                                </button>
                            </div>
                        </Popover.Panel>
                    </Popover>
                </div>

                {/* Thông báo lỗi */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                {/* Trạng thái tải dữ liệu */}
                {isLoading ? (
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <div className="flex flex-wrap gap-8">
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((classInfo) => (
                                <ClassCard
                                    key={classInfo._id} // Use _id as the key
                                    classInfo={classInfo} // Pass the entire classInfo object
                                    onLeaveSuccess={(classId) => setClasses(classes.filter((c) => c._id !== classId))}
                                />
                            ))
                        ) : (
                            <p>Chưa có lớp học nào. Hãy tham gia lớp mới!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassList;
