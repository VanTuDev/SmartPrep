// File: GeneralInformation.js

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import { Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber, Button, message, Divider } from 'antd';
import { Captions, Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import CreateExamModal from '../../CreateExamModal';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionCard from 'components/Card/QuestionCard';

const { TextArea } = Input;
const { Title } = Typography;

const GeneralInformation = forwardRef(({ exam = {}, onUpdateExam, manualQuestionsFromExcel }, ref) => {
    const [title, setTitle] = useState(exam?.title || '');
    const [description, setDescription] = useState(exam?.description || '');
    const [isPublic, setIsPublic] = useState(exam?.access_type === 'public');
    const [duration, setDuration] = useState(exam?.duration || 60);
    const [startDate, setStartDate] = useState(dayjs(exam?.start_date) || null);
    const [startTime, setStartTime] = useState(dayjs(exam?.start_date) || null);
    const [endDate, setEndDate] = useState(dayjs(exam?.end_date) || null);
    const [endTime, setEndTime] = useState(dayjs(exam?.end_date) || null);
    const [questions, setQuestions] = useState(exam?.questions || []);
    const [randomQuestionIds, setRandomQuestionIds] = useState([]);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [newManualQuestions, setNewManualQuestions] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedClassRooms, setSelectedClassRooms] = useState([]);
    

    const { examId } = useParams();
    const navigate = useNavigate();

    // Add Excel questions to manual questions when the prop changes
    useEffect(() => {
        if (manualQuestionsFromExcel && manualQuestionsFromExcel.length > 0) {
            setNewManualQuestions((prevQuestions) => [
                ...prevQuestions,
                ...manualQuestionsFromExcel.map((q, index) => ({
                    ...q,
                    tempId: `excel-${Date.now()}-${index}` // Unique ID for each question
                }))
            ]);
        }
    }, [manualQuestionsFromExcel]);

    const accessLink = exam.access_link || `http://localhost:3000/${Math.random().toString(36).substring(2)}`;

    // Expose functions to the parent component via ref
    useImperativeHandle(ref, () => ({
        handleCreateExam,
        addRandomQuestions,
        addSelectedQuestions,
        removeQuestion,
        addManualQuestion,
        handleManualQuestionUpdate,
        handleRemoveManualQuestion

    }));

    // Update the exam information
    const updateExam = (updatedFields) => {
        const updatedExam = { ...exam, ...updatedFields, questions };
        onUpdateExam(updatedExam);
    };

    // Handle form modal submission
    const handleModalSubmit = ({ gradeId, categoryId, groupId, classRoomIds }) => {
        setSelectedGrade(gradeId);
        setSelectedCategory(categoryId);
        setSelectedGroup(groupId);
        setSelectedClassRooms(classRoomIds);
        updateExam({
            grade_id: gradeId,
            category_id: categoryId,
            group_id: groupId,
            classRoom_ids: classRoomIds,
        });
        setIsModalOpen(false);
    };

    // Add random questions to the exam
    const addRandomQuestions = (newQuestions) => {
        const newRandomIds = newQuestions.map((q) => q._id);
        setRandomQuestionIds((prevIds) => Array.from(new Set([...prevIds, ...newRandomIds])));
        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
        message.success('Random questions added successfully!');
    };

    // Add selected questions to the exam
    const addSelectedQuestions = (selectedQuestions) => {
        const newSelectedIds = selectedQuestions.map((q) => q._id);
        setSelectedQuestionIds((prevIds) => Array.from(new Set([...prevIds, ...newSelectedIds])));
        setQuestions((prevQuestions) => [...prevQuestions, ...selectedQuestions]);
        message.success('Selected questions added successfully!');
    };

    // Validate the exam form fields
    const validateExam = () => {
        if (!title.trim() || !description.trim() || (questions.length === 0 && newManualQuestions.length === 0)) {
            message.error('Please fill out all required fields (title, description, and questions).');
            return false;
        }
        if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
            message.error('End date must be after the start date.');
            return false;
        }
        if (startDate && startTime && endDate && endTime) {
            const start = dayjs(startDate).set('hour', startTime.hour()).set('minute', startTime.minute());
            const end = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute());
            if (end.isBefore(start)) {
                message.error('End time must be after the start time.');
                return false;
            }
        }
        return true;
    };

    // Submit the exam creation request
    const handleCreateExam = async () => {
        if (!validateExam()) return;
        try {
            setLoading(true);

            const allQuestionIds = [
                ...randomQuestionIds,
                ...selectedQuestionIds,
                ...questions.filter(q => typeof q === 'string'),
                ...newManualQuestions,
            ];

            const start = dayjs(startDate).set('hour', startTime.hour()).set('minute', startTime.minute());
            const end = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute());

            const examData = {
                title: title.trim(),
                description: description.trim(),
                access_type: isPublic ? 'public' : 'private',
                duration: Number(duration),
                start_date: start.toISOString(),
                end_date: end.toISOString(),
                access_link: accessLink,
                status: 'published',
                grade_id: selectedGrade || null,
                category_id: selectedCategory || null,
                group_id: selectedGroup || null,
                classRoom_ids: selectedClassRooms || [],
                questions: allQuestionIds,
            };

            await axios.post('http://localhost:5000/api/instructor/test/create', examData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            message.success('Exam created successfully!');
            navigate("/instructor/dashboard");
        } catch (error) {
            console.error('Failed to create exam:', error);
            message.error('Failed to create exam.');
        } finally {
            setLoading(false);
        }
    };

    // Add a manually created question
    const addManualQuestion = () => {
        const newQuestion = {
            question_text: '',
            question_type: 'multiple-choice',
            options: [''],
            correct_answers: [],
            tempId: `temp-${Date.now()}`,
        };
        setNewManualQuestions([...newManualQuestions, newQuestion]);
    };

    const handleManualQuestionUpdate = (updatedQuestion) => {
        setNewManualQuestions((prevQuestions) =>
            prevQuestions.map((q) => (q.tempId === updatedQuestion.tempId ? updatedQuestion : q))
        );
    };

    const handleRemoveManualQuestion = (tempId) => {
        setNewManualQuestions((prevQuestions) => prevQuestions.filter((q) => q.tempId !== tempId));
    };

    const removeQuestion = (questionId) => {
        setQuestions((prevQuestions) => prevQuestions.filter((q) => q._id !== questionId));
        setRandomQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));
        setSelectedQuestionIds((prevIds) => prevIds.filter((id) => id !== questionId));
    };

    const disabledDate = (current) => current && current.isBefore(dayjs(), 'day');

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
                <Title level={4}>Exam Information</Title>
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
            <Divider orientation="left">Time Setup</Divider>
            <div className="time-setup-section">
                <Row gutter={16}>
                    <Col span={12}>
                        <Title level={5}>Start Date & Time</Title>
                        <DatePicker
                            placeholder="Select Start Date"
                            value={startDate}
                            onChange={setStartDate}
                            className="w-full mb-2"
                            disabledDate={disabledDate}
                        />
                        <TimePicker
                            placeholder="Select Start Time"
                            value={startTime}
                            onChange={setStartTime}
                            className="w-full"
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={5}>End Date & Time</Title>
                        <DatePicker
                            placeholder="Select End Date"
                            value={endDate}
                            onChange={setEndDate}
                            className="w-full mb-2"
                            disabledDate={disabledDate}
                        />
                        <TimePicker
                            placeholder="Select End Time"
                            value={endTime}
                            onChange={setEndTime}
                            className="w-full"
                        />
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col span={12}>
                        <Title level={5}>Duration (minutes)</Title>
                        <InputNumber
                            value={duration}
                            onChange={setDuration}
                            className="w-full"
                            placeholder="Enter duration in minutes"
                        />
                    </Col>
                </Row>


            </div>
            <div >
                <Divider orientation="left">Manual Questions</Divider>
                {newManualQuestions.length > 0 ? (
                    newManualQuestions.map((question, index) => (
                        <QuestionCard
                            key={question.tempId}
                            question={question}
                            index={index}
                            pdate={(updatedQuestion) => {
                                setNewManualQuestions((prevQuestions) =>
                                    prevQuestions.map((q) => (q.tempId === updatedQuestion.tempId ? updatedQuestion : q))
                                );
                            }}
                            onRemove={() => {
                                setNewManualQuestions((prevQuestions) =>
                                    prevQuestions.filter((q) => q.tempId !== question.tempId)
                                );
                            }}
                        />
                    ))
                ) : (
                    <p>Chưa có câu hỏi nào.</p>
                )}
            </div>
        </div>
    );
});

export default GeneralInformation;
