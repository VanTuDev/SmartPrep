import React, { useState } from 'react';
import {
    Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber, Button,
    message, List, Switch, Space
} from 'antd';
import { Captions, Pencil, Folder } from 'lucide-react';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title } = Typography;

const GeneralInformation = ({ exam = {}, onUpdateExam, onOpenLibraryModal }) => {
    const [title, setTitle] = useState(exam?.title || '');
    const [description, setDescription] = useState(exam?.description || '');
    const [isPublic, setIsPublic] = useState(exam?.access_type === 'public');
    const [duration, setDuration] = useState(exam.duration || 30);
    const [startDate, setStartDate] = useState(dayjs(exam.start_date) || null);
    const [endDate, setEndDate] = useState(dayjs(exam.end_date) || null);
    const [questions, setQuestions] = useState(exam.questions || []);

    const updateExam = (updatedFields) => {
        const updatedExam = { ...exam, ...updatedFields, questions };
        onUpdateExam(updatedExam);
    };

    const handleAddQuestions = (selectedQuestions) => {
        const updatedQuestions = [...questions, ...selectedQuestions];
        setQuestions(updatedQuestions);
        updateExam({ questions: updatedQuestions });
        message.success('Questions added successfully!');
    };

    return (
        <div className="exam-configuration-container">
            <div className="p-4 rounded-lg">
                <div className="flex items-start w-full p-2">
                    <Captions className="primary-color" />
                    <Input
                        className="mx-4 input-custom"
                        size="large"
                        placeholder="Test title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            updateExam({ title: e.target.value });
                        }}
                    />
                </div>
                <div className="flex items-start w-full p-2">
                    <Pencil className="primary-color" />
                    <TextArea
                        className="mx-4 input-custom"
                        value={description}
                        onChange={(e) => {
                            setDescription(e.target.value);
                            updateExam({ description: e.target.value });
                        }}
                        placeholder="Brief description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center space-x-2">
                <Switch
                    checked={isPublic}
                    onChange={(checked) => {
                        setIsPublic(checked);
                        updateExam({ access_type: checked ? 'public' : 'private' });
                    }}
                />
                <span>{isPublic ? 'Public' : 'Private'}</span>
            </div>

            <div className="mt-6">
                <Title level={4}>Time Setup</Title>
                <Row gutter={16}>
                    <Col span={8}>
                        <InputNumber
                            value={duration}
                            onChange={(value) => {
                                setDuration(value);
                                updateExam({ duration: value });
                            }}
                            addonAfter="Minutes"
                            className="w-full"
                        />
                    </Col>
                    <Col span={8}>
                        <DatePicker
                            value={startDate}
                            onChange={(value) => {
                                setStartDate(value);
                                updateExam({ start_date: value });
                            }}
                            className="w-full"
                        />
                    </Col>
                    <Col span={8}>
                        <TimePicker
                            value={startDate}
                            onChange={(value) => {
                                setStartDate(value);
                                updateExam({ start_date: value });
                            }}
                            className="w-full mt-2"
                        />
                    </Col>
                </Row>
            </div>

            <div className="mt-6">
                <Title level={4}>Questions</Title>
                <Button icon={<Folder />} onClick={onOpenLibraryModal}>
                    Add Questions from Library
                </Button>
                <List
                    bordered
                    dataSource={questions}
                    renderItem={(question) => (
                        <List.Item key={question._id}>
                            <div>
                                <strong>ID:</strong> {question._id} - {question.question_text}
                            </div>
                        </List.Item>
                    )}
                />
            </div>
        </div>
    );
};

export default GeneralInformation;
