import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Popover } from '@headlessui/react';
import { Plus, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import TabPane from 'antd/es/tabs/TabPane';
import { Tabs } from 'antd';
import Exam from './Exam';

const Member = () => {
    const { classId } = useParams();
    const [classInfo, setClassInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmails, setInviteEmails] = useState('');
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

    if (loading) return <p className="text-center">Đang tải thông tin lớp học...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!classInfo) return <p className="text-center">Không tìm thấy lớp học!</p>;

    const filteredLearners = classInfo.learners.filter((learner) =>
        learner.fullname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="py-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Giảng viên</h2>
                    <div className="flex items-center">
                        <img
                            src={classInfo.instructor.image || 'https://via.placeholder.com/150'}
                            alt={classInfo.instructor.fullname}
                            className="w-12 h-12 rounded-full mr-4"
                        />
                        <div>
                            <h3 className="font-semibold">{classInfo.instructor.fullname}</h3>
                            <p className="text-gray-500">{classInfo.instructor.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Learners List */}
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
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">Chưa có thành viên nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Member;
