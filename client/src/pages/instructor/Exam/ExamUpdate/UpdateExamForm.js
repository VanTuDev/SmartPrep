import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber,
   Button, message, Divider
} from 'antd';
import { Captions, Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionAdding from '../ExamCreate/QuestionAdding';
import QuestionCard from '../../../../components/Card/QuestionCard/index';
import ExamHeader from '../ExamCreate/ExamHeader';
const { TextArea } = Input;
const { Title } = Typography;

const UpdateExamForm = () => {
   const { examId } = useParams();
   const navigate = useNavigate();
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [isPublic, setIsPublic] = useState(false);
   const [duration, setDuration] = useState(60);
   const [startDate, setStartDate] = useState(null);
   const [startTime, setStartTime] = useState(null);
   const [endDate, setEndDate] = useState(null);
   const [endTime, setEndTime] = useState(null);
   const [questions, setQuestions] = useState([]);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchExamData = async () => {
         try {
            const response = await axios.get(`http://localhost:5000/api/instructor/test/${examId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const examData = response.data;

            setTitle(examData.title);
            setDescription(examData.description);
            setIsPublic(examData.access_type === 'public');
            setDuration(examData.duration);
            setStartDate(dayjs(examData.start_date));
            setStartTime(dayjs(examData.start_date));
            setEndDate(dayjs(examData.end_date));
            setEndTime(dayjs(examData.end_date));
            setQuestions(examData.questions_id || []);
         } catch (error) {
            console.error('Failed to fetch exam data:', error);
         }
      };
      fetchExamData();
   }, [examId]);

   const validateExam = () => {
      if (!title.trim() || !description.trim() || questions.length === 0) {
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

   const handleUpdateExam = async () => {
      if (!validateExam()) return;
      try {
         setLoading(true);
         const start = dayjs(startDate).set('hour', startTime.hour()).set('minute', startTime.minute());
         const end = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute());

         const updatedExamData = {
            title: title.trim(),
            description: description.trim(),
            access_type: isPublic ? 'public' : 'private',
            duration: Number(duration),
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            questions: questions,
         };

         await axios.put(`http://localhost:5000/api/instructor/test/update/${examId}`, updatedExamData, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         message.success('Exam updated successfully!');
         navigate("/instructor/dashboard");
      } catch (error) {
         console.error('Failed to update exam:', error);
         message.error('Failed to update exam');
      } finally {
         setLoading(false);
      }
   };

   const addRandomQuestions = (newQuestions) => {
      setQuestions((prevQuestions) => [...new Set([...prevQuestions, ...newQuestions])]);
      message.success('Random questions added successfully!');
   };

   const addSelectedQuestions = (selectedQuestions) => {
      setQuestions((prevQuestions) => [...new Set([...prevQuestions, ...selectedQuestions])]);
      message.success('Selected questions added successfully!');
   };

   const handleUpdateQuestion = (updatedQuestion) => {
      setQuestions(prevQuestions =>
         prevQuestions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q))
      );
   };

   const handleRemoveQuestion = (questionId) => {
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));
   };

   const disabledDate = (current) => current && current.isBefore(dayjs(), 'day');

   return (
      <>
         <ExamHeader
            items={[
               { key: 'general', label: 'General' },
               { key: 'submission', label: 'Submissions' },
            ]}
            onChangeTab={(key) =>
               navigate(
                  `/instructor/exam/${key === 'general' ? examId : `submissions/${examId}`
                  }`
               )
            }
            currentTab="submission"
         />

         <div className="exam-update-layout pt-30  " style={{ display: 'flex', height: '100vh' }}>

            {/* Question Management Section (Scrollable on the left, occupying 2/5 of the width) */}
            <div className='pt-45' style={{
               width: '40%',
               height: '100vh',
               overflowY: 'auto',
               padding: '1rem',
               borderRight: '1px solid #f0f0f0',
            }}>
               <Divider orientation="left">Manage Questions</Divider>
               {questions.map((question, index) => (
                  <QuestionCard
                     key={question._id || index}
                     question={question}
                     index={index}
                     onUpdate={handleUpdateQuestion}
                     onRemove={handleRemoveQuestion}
                  />
               ))}
               <QuestionAdding onAddRandomQuestions={addRandomQuestions} onAddSelectedQuestions={addSelectedQuestions} />
            </div>

            {/* Exam Info Section (Fixed width on the right, occupying 3/5 of the width) */}
            <div style={{
               width: '60%',
               padding: '2rem'
            }}>
               <Title level={4}>Update Exam Information</Title>
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
               <Divider orientation="left">Time Setup</Divider>
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
               <div className="mt-4">
                  <Button type="primary" onClick={handleUpdateExam} loading={loading} style={{ width: '100%' }}>
                     Update Exam
                  </Button>
               </div>
            </div>
         </div>
      </>
   );
};


export default UpdateExamForm;
