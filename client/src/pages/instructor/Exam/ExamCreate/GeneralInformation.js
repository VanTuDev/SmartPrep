// File: GeneralInformation.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber, Switch,
    Button, message, Space, List
} from 'antd';
import { Captions, Pencil, Forward, Folder } from 'lucide-react';
import dayjs from 'dayjs';
import CreateExamModal from '../../CreateExamModal';
import LibraryModal from '../../../../components/instructor/LibraryModal'; // Import LibraryModal

const { TextArea } = Input;
const { Title } = Typography;

const GeneralInformation = ({ exam = {}, onUpdateExam }) => {
    const [title, setTitle] = useState(exam?.title || '');
    const [description, setDescription] = useState(exam?.description || '');
    const [isPublic, setIsPublic] = useState(exam?.access_type === 'public');
    const [duration, setDuration] = useState(exam.duration || 60);
    const [startDate, setStartDate] = useState(dayjs(exam.start_date) || null);
    const [endDate, setEndDate] = useState(dayjs(exam.end_date) || null);
    const [questions, setQuestions] = useState(exam.questions || []);
    const [loading, setLoading] = useState(false);
    const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedClassRoom, setSelectedClassRoom] = useState('');

    const accessLink = exam.access_link || `http://localhost:3000/${Math.random().toString(36).substring(2)}`;

    const updateExam = (updatedFields) => {
        const updatedExam = { ...exam, ...updatedFields, questions };
        onUpdateExam(updatedExam);
    };

    const handleModalSubmit = ({ gradeId, categoryId, groupId, classRoomId }) => {
        setSelectedGrade(gradeId);
        setSelectedCategory(categoryId);
        setSelectedGroup(groupId);
        setSelectedClassRoom(classRoomId || null);

        updateExam({
            grade_id: gradeId,
            category_id: categoryId,
            group_id: groupId,
            classRoom_id: classRoomId || null,
        });

        setIsModalOpen(false);
    };

    const handleAddRandomQuestions = (selectedQuestions) => {
        const updatedQuestions = [...questions, ...selectedQuestions];
        setQuestions(updatedQuestions);
        updateExam({ questions: updatedQuestions });
        message.success('Questions added successfully!');
    };

    const validateExam = () => {
        if (!title.trim() || !description.trim() || questions.length === 0) {
            message.error('Please fill out all required fields (title, description, and questions).');
            return false;
        }
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            message.error('End time must be after the start time.');
            return false;
        }
        return true;
    };

    const handleCreateExam = async () => {
        if (!validateExam()) return;

        try {
            setLoading(true);

            // Prepare payload
            const examData = {
                title: title.trim(),
                description: description.trim(),
                access_type: isPublic ? 'public' : 'private',
                duration: Number(duration),
                start_date: startDate ? startDate.toISOString() : null,
                end_date: endDate ? endDate.toISOString() : null,
                access_link: accessLink,
                status: 'published',
                grade_id: selectedGrade || null,
                category_id: selectedCategory || null,
                group_id: selectedGroup || null,
                classRoom_id: selectedClassRoom || null,
                questions: questions, // Sending questions directly (either IDs or new ones)
            };

            console.log('Sending Exam Data:', examData);

            // Make API request to create the exam
            const response = await axios.post(
                'http://localhost:5000/api/instructor/test/create',
                examData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            message.success('Exam created successfully!');
            console.log('Exam creation response:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Backend error response:', error.response.data);
                message.error(`Failed to create exam: ${error.response.data.error}`);
            } else {
                console.error('Network or server error:', error.message);
                message.error('Could not connect to server.');
            }
        } finally {
            setLoading(false);
        }
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="flex items-start w-full rounded-lg p-2">
                    <Pencil className="primary-color" />
                    <TextArea
                        className="mx-4 input-custom"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
            </div>

            <div className="mt-6 p-3">
                <Title level={4}>Exam Information</Title>
                <Space direction="vertical" className="w-full">
                    <Input placeholder="Selected Grade" value={selectedGrade} disabled />
                    <Input placeholder="Selected Category" value={selectedCategory} disabled />
                    <Input placeholder="Selected Group" value={selectedGroup} disabled />
                    <Input placeholder="Selected ClassRoom" value={selectedClassRoom} disabled />
                </Space>
            </div>

            <div className="mt-6">
                <Title level={4}>Questions</Title>
                <Button icon={<Folder />} onClick={() => setIsLibraryModalOpen(true)}>
                    Add Questions from Library
                </Button>
                <List
                    bordered
                    dataSource={questions}
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
                <Row className="mb-4">
                    <Col span={12}>
                        <InputNumber
                            value={duration}
                            onChange={setDuration}
                            addonAfter="Minutes"
                            className="w-full"
                        />
                    </Col>
                    <Col span={12}>
                        <DatePicker value={startDate} onChange={setStartDate} className="w-full" />
                        <TimePicker value={startDate} onChange={setStartDate} className="w-full mt-2" />
                    </Col>
                    <Col span={12}>
                        <DatePicker value={endDate} onChange={setEndDate} className="w-full" />
                        <TimePicker value={endDate} onChange={setEndDate} className="w-full mt-2" />
                    </Col>
                </Row>
            </div>

            <div className="mt-6 flex justify-end">
                <Button type="primary" loading={loading} onClick={handleCreateExam}>
                    Create Exam
                </Button>
            </div>
        </div>
    );
};

export default GeneralInformation;
