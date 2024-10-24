// XEM BÀI THI ĐANG TẠO

import React from 'react';
import { Drawer, Space, Radio } from "antd";
import { AlarmClock } from 'lucide-react';

function PreviewExam({ visible, onClose, exam }) {

    return (
        <>
            <Drawer
                title={
                    <div className="drawer-header">
                        <div></div>
                        <div className="title text-lime-500 flex items-center space-x-3">
                            <AlarmClock size={36} />
                            <p className='text-xl'>{exam?.duration}'</p>
                        </div>
                        <div></div>
                    </div>
                }
                placement="right"
                onClose={onClose}
                visible={visible}
                width="100vw" // Adjust width as needed
                headerStyle={{ padding: '0 16px' }}
                bodyStyle={{ padding: 0 }} // Optional styling
            >
                <div className="w-3/5 mx-auto mt-5 mb-24">
                    {/* Main Content */}
                    <div className='shadow-lg border-gray-950'>
                        {exam?.questions.map((question, index) => (
                            <div className='w-full p-4 mb-4'>
                                <p><strong>{`Question ${index + 1}: `}{question.question_text}</strong></p>
                                <Space direction="vertical">
                                    {question.options.map((option, index) => (
                                        <div key={index}>
                                            <Radio checked={question.correct_answers.includes(option)} disabled />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                </Space>
                            </div>
                        ))}
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default PreviewExam;