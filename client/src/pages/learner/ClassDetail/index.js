import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogIn, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tabs } from 'antd';
import Exam from './Exam';
import Member from './Member';
import Chatting from './Chatting';

const { TabPane } = Tabs;

const ClassDetail = () => {
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Configure axios instance
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:5000/api',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const fetchClassDetails = async () => {
        try {
            const response = await axiosInstance.get(`/classrooms/details/${classId}`);
            setClassInfo(response.data.classroom);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết lớp học:', error);
            setError('Không thể lấy thông tin lớp học!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    const handleLeaveClass = async () => {
        try {
            const response = await axiosInstance.delete(`/classrooms/learner/${classId}/leave`);
            if (response.status === 200) {
                toast.success('Đã rời khỏi lớp thành công!');
                navigate('/learner/dashboard');
            } else {
                toast.error('Không thể rời khỏi lớp.');
            }
        } catch (error) {
            console.error('Lỗi khi rời khỏi lớp:', error);
            toast.error('Lỗi trong quá trình rời lớp.');
        } finally {
            setShowConfirmModal(false);
        }
    };

    if (loading) return <p className="text-center">Đang tải thông tin lớp học...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!classInfo) return <p className="text-center">Không tìm thấy lớp học!</p>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Search Bar and Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md mt-4">
                <input
                    type="text"
                    placeholder="Nhập tên học sinh"
                    className="px-4 py-2 ms-5 border rounded-md w-1/3 focus:outline-none"
                />

                <button className="text-red-500 font-semibold" onClick={() => navigate('/learner/dashboard')}>


                    <X size={20} />
                </button>
            </div>

            {/* Class Info */}
            <div className="px-16 pt-2 pb-1">
                <div className="bg-white p-6 rounded-lg shadow-md">

                    <div className='flex justify-between'>
                        <h1 className="w-1/2 text-3xl font-bold">{classInfo.name}</h1>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"

                            onClick={() => setShowConfirmModal(true)}
                        >
                            <LogIn />
                        </button>
                    </div>
                    <p className="text-gray-600 mt-2">
                        <span className="font-bold text-blue-500">Code: </span> {classInfo.code}
                    </p>
                    <p className="text-gray-400">
                        <span className="font-bold text-gray-600">Mô tả: </span> {classInfo.description || 'Chưa có mô tả.'}
                    </p>
                </div>
            </div>

            {/* Tabs for Members and Exams */}
            <Tabs defaultActiveKey="1" className="px-16">
                <TabPane tab="Thành viên" key="1">
                    <Member />
                </TabPane>
                <TabPane tab="Bài thi" key="2">
                    <Exam classId={classId} /> {/* Truyền classId vào Exam */}
                </TabPane>
                <TabPane tab="Phòng chat" key="3">
                    <Chatting classId={classId} />
                </TabPane>
            </Tabs>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Xác nhận rời lớp</h3>
                        <p>Bạn có chắc chắn muốn rời khỏi lớp <strong>{classInfo.name}</strong> không?</p>
                        <div className="flex justify-end mt-6 gap-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-md"
                                onClick={() => setShowConfirmModal(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                                onClick={handleLeaveClass}
                            >
                                Rời Lớp
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassDetail;
