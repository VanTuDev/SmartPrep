import React, { useState, useEffect } from 'react';
import { Dropdown, Modal, Space } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import dayjs from 'dayjs';

const MiniExamCard = ({ exam = {}, grades = {}, subjects = {}, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [examStatus, setExamStatus] = useState(exam.status);

    // Check and set the status based on current date
    useEffect(() => {
        const now = dayjs();
        const start = dayjs(exam.start_date);
        const end = dayjs(exam.end_date);

        if (now.isBefore(start)) {
            setExamStatus(exam.status); // show as 'published' or 'draft'
        } else if (now.isAfter(end)) {
            setExamStatus('end');
        } else {
            setExamStatus('start');
        }
    }, [exam.start_date, exam.end_date, exam.status]);

    const handleDropdownClick = (key) => {
        if (key === 'update') {
            onUpdate(exam._id);
        } else if (key === 'delete') {
            setIsModalOpen(true);
        }
    };

    const handleOk = () => {
        onDelete(exam._id);
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dropdownItems = [
        { label: 'Update', key: 'update' },
        { label: 'Delete', key: 'delete' },
    ];

    // Determine the color based on the status
    const statusColor =
        examStatus === 'published'
            ? 'text-green-600'
            : examStatus === 'draft'
                ? 'text-yellow-600'
                : examStatus === 'start'
                    ? 'text-blue-600'
                    : 'text-gray-500';

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
            <div className="font-semibold text-gray-800 mb-4 text-lg">
                {exam.title || 'Untitled Exam'}
            </div>
            <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🕒</span>
                    {exam.start_date ? dayjs(exam.start_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏰</span>
                    {exam.end_date ? dayjs(exam.end_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏳</span>
                    Thời gian làm bài: {exam.duration || 0} phút
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📋</span>
                    Số câu hỏi: {exam.questions_id ? exam.questions_id.length : 0}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🏫</span>
                    Khối: {grades[exam.grade_id] || 'N/A'}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📘</span>
                    Môn: {subjects[exam.category_id] || 'N/A'}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🔗</span>
                    <a href={exam.access_link} target="_blank" rel="noopener noreferrer">
                        Link kiểm tra
                    </a>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <span className={`text-sm font-semibold ${statusColor}`}>
                    <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🌍</span>
                        {examStatus}
                    </div>
                </span>

                <Dropdown
                    className="mx-3"
                    menu={{
                        items: dropdownItems.map((item) => ({
                            ...item,
                            onClick: () => handleDropdownClick(item.key),
                        })),
                    }}
                    trigger={['click']}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <EllipsisVertical />
                        </Space>
                    </a>
                </Dropdown>

                <Modal
                    title="Xác nhận xóa"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <p>Bạn có chắc chắn muốn xóa bài kiểm tra này không?</p>
                </Modal>
            </div>
        </div>
    );
};

export default MiniExamCard;
