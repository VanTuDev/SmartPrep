import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Popover } from '@headlessui/react';
import { Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ClassDetail = () => {
    const { classId } = useParams(); // Get classId from route params
    const [classInfo, setClassInfo] = useState(null); // Store class details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [searchTerm, setSearchTerm] = useState(''); // Store search term
    const [showInviteModal, setShowInviteModal] = useState(false); // Invite modal state
    const [inviteEmails, setInviteEmails] = useState(''); // Emails input
    const [isInviting, setIsInviting] = useState(false);

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
            setClassInfo(response.data.classroom); // Store the class data
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết lớp học:', error);
            setError('Không thể lấy thông tin lớp học!');
        } finally {
            setLoading(false); // Stop loading
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

    useEffect(() => {
        fetchClassDetails();
    }, [classId]);

    const handleRemoveLearner = async (learnerId) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/classrooms/instructor/${classId}/kick/${learnerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            setClassInfo((prevClassInfo) => ({
                ...prevClassInfo,
                learners: prevClassInfo.learners.filter(
                    (learner) => learner._id !== learnerId
                ),
            }));
            toast.success('Đã xóa học sinh khỏi lớp!');
        } catch (error) {
            console.error('Lỗi khi xóa học sinh:', error);
            toast.error('Không thể xóa học sinh!');
        }
    };

    const filteredLearners = classInfo?.learners.filter((learner) =>
        learner.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-center">Đang tải thông tin lớp học...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!classInfo) return <p className="text-center">Không tìm thấy lớp học!</p>;

    const handleCardClick = () => {
        navigate(`/instructor/dashboard/class`); // Navigate to class page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Class Name and Description */}


            {/* Search Bar and Action Buttons */}
            <div className="flex justify-between items-center p-4 bg-white shadow-md mt-4">
                <input
                    type="text"
                    placeholder="Nhập tên học sinh"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 ms-5 border rounded-md w-1/3 focus:outline-none"
                />

                <button className="text-red-500 font-semibold">
                    <X className="font-bold" size={20} onClick={handleCardClick} />
                </button>
            </div>
            <div className="px-16 pt-8 pb-1">
                <div className="bg-white p-6 rounded-lg shadow-md relative flex">
                    <div className='w-1/2'>
                        <h1 className="text-3xl font-bold">{classInfo.name}</h1>
                        <p className="text-gray-600 mt-2"> <span className='font-bold text-blue-500'>Code: </span> {classInfo.description}</p>
                    </div>
                    <div className='w-1/2 flex justify-end items-end'>
                        <button
                            className="text-indigo-600 hover:bg-gray-100 p-2 rounded-full flex items-center justify-center"
                            onClick={() => setShowInviteModal(true)} // Open invite modal
                        >
                            <Plus size={24} /> Thêm thành viên
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-16 py-8">
                <div className="bg-white p-6 rounded-lg shadow-md relative">
                    {/* Instructor Details */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-2">Giáo viên</h2>
                        <div className="flex items-center py-4 border-b">
                            <img
                                src={classInfo.instructor.image || 'https://via.placeholder.com/150'}
                                alt={classInfo.instructor.fullname}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div>
                                <h3 className="font-semibold">{classInfo.instructor.fullname}</h3>
                                <p className="text-gray-500">{classInfo.instructor.email}</p>
                                <p className="text-gray-500">{classInfo.instructor.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Học viên</h2>
                        {filteredLearners.length > 0 ? (
                            filteredLearners.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex justify-between items-center py-4 border-b last:border-none"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={member.image || 'https://via.placeholder.com/150'}
                                            alt={member.fullname}
                                            className="w-10 h-10 rounded-full mr-4"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{member.fullname}</h3>
                                            <p className="text-gray-500">{member.email}</p>
                                        </div>
                                    </div>
                                    <Popover className="relative">
                                        <Popover.Button
                                            className="p-2 flex items-center"
                                            onClick={() => handleRemoveLearner(member._id)}
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
    );
};

export default ClassDetail;
