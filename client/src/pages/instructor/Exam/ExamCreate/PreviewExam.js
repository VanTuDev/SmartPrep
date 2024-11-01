import React from 'react';
import { Drawer, Space, Radio, Empty, Typography, Divider } from "antd";
import { AlarmClock, CalendarDays, Info, ClipboardList } from 'lucide-react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

function PreviewExam({ visible, onClose, exam }) {
    return (
        <Drawer
            title={
                <div className="drawer-header flex items-center justify-between">
                    <AlarmClock size={36} />
                    <p className="text-xl font-semibold">{exam?.duration || 0} phút</p>
                </div>
            }
            placement="right"
            onClose={onClose}
            open={visible}
            width="80vw"
        >
            <div className="w-3/5 mx-auto mt-5">
                {/* Display Exam General Information */}
                <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
                    <Title level={4}>{exam?.title || "Untitled Exam"}</Title>
                    <Text><Info className="mr-2" />{exam?.description || "No description available"}</Text>
                    <Divider />
                    <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex items-center">
                            <CalendarDays className="mr-2 text-gray-500" />
                            <Text strong>Start Date:</Text> {exam?.start_date ? dayjs(exam.start_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                        </div>
                        <div className="flex items-center">
                            <CalendarDays className="mr-2 text-gray-500" />
                            <Text strong>End Date:</Text> {exam?.end_date ? dayjs(exam.end_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                        </div>
                        <div className="flex items-center">
                            <ClipboardList className="mr-2 text-gray-500" />
                            <Text strong>Number of Questions:</Text> {exam?.questions?.length || 0}
                        </div>
                    </div>
                </div>

                {/* Display Exam Questions */}
                {exam?.questions?.length > 0 ? (
                    exam.questions.map((question, index) => (
                        <div key={index} className="p-4 mb-6 bg-white shadow-sm">
                            <p className="font-bold">{`Câu hỏi ${index + 1}: ${question.question_text}`}</p>
                            <Space direction="vertical">
                                {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center space-x-2">
                                        <Radio disabled>{option}</Radio>
                                    </div>
                                ))}
                            </Space>
                        </div>
                    ))
                ) : (
                    <Empty description="Không có câu hỏi nào" />
                )}
            </div>
        </Drawer>
    );
}

export default PreviewExam;
