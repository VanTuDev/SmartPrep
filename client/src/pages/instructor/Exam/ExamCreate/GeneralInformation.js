import React, { useState, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import {
    Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber,
    Button, message, Space, Divider
} from 'antd';
import { Captions, Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import CreateExamModal from '../../CreateExamModal';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;
const { Title } = Typography;

const GeneralInformation = forwardRef(({ exam = {}, onUpdateExam }, ref) => {
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

    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedClassRooms, setSelectedClassRooms] = useState([]);
    const navigate = useNavigate();

    const accessLink = exam.access_link || `http://localhost:3000/${Math.random().toString(36).substring(2)}`;

    useImperativeHandle(ref, () => ({
        handleCreateExam,
        handleCreateExamDraft,  // Chia sẻ hàm này với component cha
        addRandomQuestions,
        addSelectedQuestions,
        removeQuestion,
    }));

    const updateExam = (updatedFields) => {
        const updatedExam = { ...exam, ...updatedFields, questions };
        onUpdateExam(updatedExam);
    };

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

    const addRandomQuestions = (newQuestions) => {
        const newRandomIds = newQuestions.map((q) => q._id);
        setRandomQuestionIds((prevIds) => Array.from(new Set([...prevIds, ...newRandomIds])));
        setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
        message.success('Random questions added successfully!');
    };

    const addSelectedQuestions = (selectedQuestions) => {
        const newSelectedIds = selectedQuestions.map((q) => q._id);
        setSelectedQuestionIds((prevIds) => Array.from(new Set([...prevIds, ...newSelectedIds])));
        setQuestions((prevQuestions) => [...prevQuestions, ...selectedQuestions]);
        message.success('Selected questions added successfully!');
    };

    const validateExam = () => {
        if (!title.trim() || !description.trim() || (randomQuestionIds.length === 0 && selectedQuestionIds.length === 0)) {
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

    const handleCreateExam = async () => {
        if (!validateExam()) return;
        try {
            setLoading(true);
            const allQuestionIds = [...new Set([...randomQuestionIds, ...selectedQuestionIds])];
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
            navigate("/instructor/dashboard");
        } catch (error) {
            console.error('Failed to create exam:', error);
            message.error('Failed to create exam.');
        } finally {
            setLoading(false);
        }
    };

    // Function to handle saving the exam as a draft
    const handleCreateExamDraft = async () => {
        if (!validateExam()) return;
        try {
            setLoading(true);
            const allQuestionIds = [...new Set([...randomQuestionIds, ...selectedQuestionIds])];
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
                status: 'draft',  // Set status to draft
                grade_id: selectedGrade || null,
                category_id: selectedCategory || null,
                group_id: selectedGroup || null,
                classRoom_ids: selectedClassRooms || [],
                questions: allQuestionIds,
            };

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

            message.success('Exam saved as draft successfully!');
            console.log('Draft creation response:', response.data);
        } catch (error) {
            console.error('Failed to save exam as draft:', error);
            message.error('Failed to save exam as draft.');
        } finally {
            setLoading(false);
        }
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

            {/* <div className="mt-6 p-3">
                <Title level={4}>Grade and Category</Title>
                <Space direction="vertical" className="w-full">
                    <Input placeholder="Selected Grade" value={selectedGrade} disabled />
                    <Input placeholder="Selected Category" value={selectedCategory} disabled />
                    <Input placeholder="Selected ClassRoom(s)" value={selectedClassRooms.join(', ')} disabled />
                </Space>
            </div> */}

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
            <Button onClick={handleCreateExamDraft} loading={loading}>
                Save as Draft
            </Button>
        </div>
    );
});

export default GeneralInformation;  