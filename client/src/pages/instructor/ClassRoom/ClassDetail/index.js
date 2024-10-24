import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Popover } from '@headlessui/react';
import { Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

const ClassDetail = () => {
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmails, setInviteEmails] = useState('');
    const [isInviting, setIsInviting] = useState(false);
    const [selectedLearner, setSelectedLearner] = useState(null);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

    const navigate = useNavigate();

    const fetchClassDetails = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/classrooms/details/${classId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setClassInfo(response.data.classroom);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết lớp học:', error);
            setError('Không thể lấy thông tin lớp học!');
        } finally {
            setLoading(false);
        }
    };

    const handleInviteMembers = async () => {
        const emailList = inviteEmails.split(',').map((email) => email.trim());
        if (emailList.length === 0) {
            toast.error('Vui lòng nhập ít nhất một email hợp lệ!');
            return;
        }

        setIsInviting(true); // Start inviting process
        try {
            const response = await axios.post(
                `http://localhost:5000/api/classrooms/instructor/${classId}/add-learners`,
                { emails: emailList },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success('Mời thành viên thành công!');
                setInviteEmails(''); // Reset input
                setShowInviteModal(false); // Close modal
                fetchClassDetails(); // Refresh class data
            } else {
                toast.error('Không thể mời thành viên!');
            }
        } catch (error) {
            console.error('Lỗi khi mời thành viên:', error);
            toast.error('Không thể mời thành viên!');
        } finally {
            setIsInviting(false); // End inviting process
        }
    };

    const handleRemoveLearner = async () => {
        if (!selectedLearner) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/classrooms/instructor/${classId}/kick/${selectedLearner}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setClassInfo((prevClassInfo) => ({
                ...prevClassInfo,
                learners: prevClassInfo.learners.filter(
                    (learner) => learner._id !== selectedLearner
                ),
            }));
            toast.success('Đã xóa học sinh khỏi lớp!');
        } catch (error) {
            console.error('Lỗi khi xóa học sinh:', error);
            toast.error('Không thể xóa học sinh!');
        } finally {
            setIsConfirmModalVisible(false); // Close the modal after the action
            setSelectedLearner(null); // Reset selected learner
        }
    };

    const handleApproveRequest = async (learnerId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/classrooms/instructor/${classId}/approve/${learnerId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Yêu cầu tham gia đã được phê duyệt!');
            fetchClassDetails(); // Refresh class data
        } catch (error) {
            console.error('Lỗi khi phê duyệt yêu cầu:', error);
            toast.error('Không thể phê duyệt yêu cầu!');
        }
    };

    const handleRejectRequest = async (learnerId) => {
        try {
            await axios.post(
                `http://localhost:5000/api/classrooms/instructor/${classId}/reject/${learnerId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            toast.success('Yêu cầu tham gia đã bị từ chối.');
            fetchClassDetails(); // Refresh class data
        } catch (error) {
            console.error('Lỗi khi từ chối yêu cầu:', error);
            toast.error('Không thể từ chối yêu cầu!');
        }
    };



    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    if (loading) return <p className="text-center">Đang tải thông tin lớp học...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!classInfo) return <p className="text-center">Không tìm thấy lớp học!</p>;

    const filteredLearners = classInfo.learners.filter((learner) =>
        learner.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openConfirmModal = (learnerId) => {
        setSelectedLearner(learnerId);
        setIsConfirmModalVisible(true);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Search Bar and Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md mt-4">
                <input
                    type="text"
                    placeholder="Nhập tên học sinh"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 ms-5 border rounded-md w-1/3 focus:outline-none"
                />
                <button className="text-red-500 font-semibold" onClick={() => navigate('/instructor/dashboard/class')}>
                    <X size={20} />
                </button>
            </div>

            {/* Class Info */}
            <div className="px-16 pt-8 pb-1">
                <div className="bg-white p-6 rounded-lg shadow-md flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{classInfo.name}</h1>
                        <p className="text-gray-600 mt-2">
                            <span className="font-bold text-blue-500">Code: </span> {classInfo.code}
                        </p>
                        <p className="text-gray-400">
                            <span className="font-bold text-gray-600">Mô tả: </span> {classInfo.description || 'Chưa có mô tả.'}
                        </p>
                    </div>
                    <button
                        className="text-indigo-600 hover:bg-gray-100 p-2 rounded-full flex items-center justify-center"
                        onClick={() => setShowInviteModal(true)} // Open invite modal
                    >
                        <Plus size={24} /> Thêm thành viên
                    </button>
                </div>
            </div>

            <Tabs defaultActiveKey="1" className='px-16'>
                {/* Learners List */}
                {/* Tab for Class Information */}
                <TabPane tab="Thành viên" key="1">
                    <div className="py-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Học viên</h2>
                            {filteredLearners.length > 0 ? (
                                filteredLearners.map((learner) => (
                                    <div key={learner._id} className="flex justify-between items-center py-4 border-b">
                                        <div className="flex items-center">
                                            <div>
                                                <h3 className="font-semibold">{learner.fullname}</h3>
                                                <p className="text-gray-500">{learner.email}</p>
                                            </div>
                                        </div>
                                        <Popover className="relative">
                                            <Popover.Button
                                                className="p-2 flex items-center"
                                                onClick={() => openConfirmModal(learner._id)}
                                            >
                                                Xoá <X className="me-3" size={20} />
                                            </Popover.Button>
                                        </Popover>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Chưa có thành viên nào.</p>
                            )}
                        </div>
                    </div>

                    {isConfirmModalVisible && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg">
                                <h3 className="text-xl font-semibold mb-4">Xác nhận xóa học viên</h3>
                                <p>Bạn có chắc chắn muốn xóa học viên này không?</p>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button
                                        onClick={handleRemoveLearner}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        onClick={() => setIsConfirmModalVisible(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Pending Requests */}
                    <div className="py-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-4">Yêu cầu đang chờ phê duyệt</h2>
                            {classInfo.pending_requests.length > 0 ? (
                                classInfo.pending_requests.map((request) => (
                                    <div key={request._id} className="flex justify-between items-center py-4 border-b">
                                        <div className="flex items-center">
                                            <div>
                                                <h3 className="font-semibold">{request.fullname}</h3>
                                                <p className="text-gray-500">{request.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleApproveRequest(request._id)}
                                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                            >
                                                Phê duyệt
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request._id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Từ chối
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">Không có yêu cầu nào đang chờ.</p>
                            )}
                        </div>


                        {/* Invite Modal */}
                        {showInviteModal && (
                            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white rounded-lg p-6 w-96">
                                    <h3 className="text-xl font-semibold mb-4">Mời thành viên</h3>
                                    <textarea
                                        value={inviteEmails}
                                        onChange={(e) => setInviteEmails(e.target.value)}
                                        className="border rounded p-2 w-full h-24"
                                        placeholder="Nhập email, cách nhau bằng dấu phẩy"
                                    />
                                    <div className="flex justify-end space-x-4 mt-4">
                                        <button
                                            onClick={handleInviteMembers}
                                            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 ${isInviting ? 'opacity-50 cursor-not-allowed' : ''
                                                }`}
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
                    </div>
                </TabPane>
                {/* Tab for Class Information */}
                <TabPane tab="Bài thi" key="2">

                </TabPane>
            </Tabs>
        </div>
    );
};

export default ClassDetail;
