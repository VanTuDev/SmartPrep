// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { resetExam, fetchExam, createExam } from '../../../store/examSlice';
// import { message, Button, Input } from 'antd';
// import GeneralInformation from './GeneralInformation';
// import QuestionCard from '../../../components/Card/QuestionCard';
// import SingleCollapse from '../../../components/Collapse/SingleCollapse';

// function ExamCreate({ examId }) {
//    const [localExam, setLocalExam] = useState({ title: '', description: '' });
//    const [questionIds, setQuestionIds] = useState([]);
//    const dispatch = useDispatch();
//    const { exam, loading, error } = useSelector((state) => state.exam);

//    useEffect(() => {
//       if (examId) {
//          dispatch(fetchExam(examId));
//       }
//       return () => {
//          dispatch(resetExam());
//       };
//    }, [dispatch, examId]);

//    useEffect(() => {
//       if (exam) {
//          setLocalExam({
//             title: exam.title || '',
//             description: exam.description || '',
//          });
//          setQuestionIds(exam.questions.map((q) => q._id));
//       }
//    }, [exam]);

//    const handleQuestionsUpdate = (newQuestions) => {
//       const newIds = newQuestions.map((q) => q._id);
//       setQuestionIds((prevIds) => [...new Set([...prevIds, ...newIds])]);
//    };

//    const handleExamInfoUpdate = (field, value) => {
//       setLocalExam((prev) => ({ ...prev, [field]: value }));
//    };

//    const validateExamData = () => {
//       const { title, description } = localExam;
//       if (!title || !description || questionIds.length === 0) {
//          message.error('Please fill out all required fields.');
//          return false;
//       }
//       return true;
//    };

//    const handleCreateExam = () => {
//       if (!validateExamData()) return;
//       dispatch(createExam({ ...localExam, questions: questionIds }));
//       message.success('Exam created successfully!');
//    };

//    if (loading) return <p>Loading...</p>;
//    if (error) return <p>Error: {error}</p>;

//    return (
//       <div className="w-3/5 mx-auto mt-5 mb-24">
//          <SingleCollapse header="General Information">
//             <GeneralInformation exam={localExam} onUpdateExam={handleExamInfoUpdate} />
//          </SingleCollapse>

//          <div className="mt-6">
//             {exam?.questions.map((question, index) => (
//                <QuestionCard
//                   key={question._id}
//                   question={question}
//                   index={index + 1}
//                   onUpdate={handleQuestionsUpdate}
//                />
//             ))}
//          </div>

//          <div className="mt-6 flex justify-end">
//             <Button type="primary" onClick={handleCreateExam}>
//                Create Exam
//             </Button>
//          </div>
//       </div>
//    );
// }

// export default ExamCreate;
