import React from 'react';
import { Dropdown, Modal, Space } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import dayjs from 'dayjs';

const MiniExamCard = ({ exam, onUpdate, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

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

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
            <div className="font-semibold text-gray-800 mb-4 text-lg">{exam.title}</div>
            <div className="text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🕒</span>
                    {dayjs(exam.start_date).format('DD/MM/YYYY HH:mm')}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏰</span>
                    {dayjs(exam.end_date).format('DD/MM/YYYY HH:mm')}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">⏳</span>
                    Thời gian làm bài: {exam.duration} phút
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📋</span>
                    Số câu hỏi: {exam.questions.length}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🏫</span>
                    Khối: {exam.grade}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">📘</span>
                    Môn: {exam.subject}
                </div>
                <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🔗</span>
                    <a href={exam.access_link} target="_blank" rel="noopener noreferrer">
                        Link kiểm tra
                    </a>
                </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
                <span
                    className={`text-sm font-semibold ${exam.status === 'published' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                >
                    <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">🌍</span>
                        {exam.status}
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
