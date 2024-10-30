// File: GeneralInformation.jsx

import React, { useState } from 'react';
import {
    Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber,
    Button, message, Space, List
} from 'antd';
import { Captions, Pencil, Folder } from 'lucide-react';
import CreateExamModal from '../../CreateExamModal';
import LibraryModal from '../../../../components/instructor/LibraryModal'; // Import LibraryModal

const { TextArea } = Input;
const { Title } = Typography;

const GeneralInformation = ({ exam , onUpdateExam }) => {

    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);



    const handleModalSubmit = ({ gradeId, categoryId, groupId, classRoomId }) => {
        onUpdateExam({
            ...exam, // Giữ nguyên dữ liệu hiện tại
            grade_id: gradeId,
            category_id: categoryId,
            group_id: groupId,
            classRoom_id: classRoomId || null,
        });
    
        setIsModalOpen(false);
    };

    const handleFieldChange = (field, value) => {
        onUpdateExam({ ...exam, [field]: value });
    };

    const handleAddRandomQuestions = (selectedQuestions) => {
        const updatedQuestions = [...exam.questions, ...selectedQuestions];
        onUpdateExam({ ...exam, questions: updatedQuestions });
        message.success('Questions added successfully!');
    };

    const handleDateChange = (field, date) => {
        const updatedDate = date ? date.toISOString() : null;
        handleFieldChange(field, updatedDate);
    };
    
    if (isModalOpen) {
        return (
            <CreateExamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        );
    }

    return (
        <div className="exam-configuration-container">
            <div className="p-4 rounded-lg">
                <div className="flex items-start w-full rounded-lg p-2">
                    <Captions className="primary-color" />
                    <Input
                        className="mx-4 input-custom"
                        size="large"
                        placeholder="Test title"
                        value={exam.title}
                        onChange={(e) =>  handleFieldChange('title', e.target.value)}
                    />
                </div>
                <div className="flex items-start w-full rounded-lg p-2">
                    <Pencil className="primary-color" />
                    <TextArea
                        className="mx-4 input-custom"
                        value={exam.description}
                        onChange={(e) => handleFieldChange('description', e.target.value)}
                        placeholder="Brief description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
            </div>

            <div className="mt-6 p-3">
                <Title level={4}>Exam Information</Title>
                <Space direction="vertical" className="w-full">
                    <Input placeholder="Selected Grade" value={exam.grade_id} disabled />
                    <Input placeholder="Selected Category" value={exam.category_id} disabled />
                    <Input placeholder="Selected Group" value={exam.group_id} disabled />
                    <Input placeholder="Selected ClassRoom" value={exam.classRoom_id} disabled />
                </Space>
            </div>

            <div className="mt-6">
                <Title level={4}>Questions</Title>
                <Button icon={<Folder />} onClick={() => setIsLibraryModalOpen(true)}>
                    Add Questions from Library
                </Button>
                <List
                    bordered
                    dataSource={exam.questions}
                    renderItem={(question) => (
                        <List.Item>
                            <div>
                                <strong>ID:</strong> {question._id || 'N/A'} - {question.question_text || 'No Text'}
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <LibraryModal
                isOpen={isLibraryModalOpen}
                onClose={() => setIsLibraryModalOpen(false)}
                onSubmit={handleAddRandomQuestions}
            />

            <div className="mt-6">
                <Title level={4}>Time Setup</Title>
                <Row className="mb-4" >
                    <Col span={12} className='mb-6'>
                        <InputNumber
                            value={exam.duration}
                            onChange={(value) => handleFieldChange('duration', value)}
                            addonAfter="Minutes"
                            className="w-full"
                        />
                    </Col>
                    <Col span={12} className='mb-6'>
                    </Col>
                    <Col span={12}>
                        <DatePicker value={exam.startDate} onChange={(date) => handleDateChange('start_date', date)}className="w-full" />
                        <TimePicker value={exam.startDate} onChange={(time) => handleDateChange('start_date', time)} className="w-full mt-2" />
                    </Col>
                    <Col span={12}>
                        <DatePicker value={exam.endDate} onChange={(date) => handleDateChange('end_date', date)} className="w-full" />
                        <TimePicker value={exam.endDate} onChange={(time) => handleDateChange('end_date', time)} className="w-full mt-2" />
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default GeneralInformation;
