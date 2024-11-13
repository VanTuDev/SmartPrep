// File: ExamCreate.js

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetExam, fetchExam } from 'store/examSlice';
import { message } from "antd";
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation";
import QuestionCard from 'components/Card/QuestionCard';
import QuestionAdding from "./QuestionAdding";
import ExamHeader from './ExamHeader';
import Submission from '../Submission/Submission';
import { useNavigate } from 'react-router-dom';

const ExamCreate = forwardRef(({ examId }, ref) => {
    const [localExam, setLocalExam] = useState({ title: '', description: '', questions: [] });
    const [activeTab, setActiveTab] = useState('general');
    const { exam, loading, error } = useSelector((state) => state.exam);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const generalInformationRef = React.useRef();

    // States for selected values
    const [selectedGrade, setSelectedGrade] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [manualQuestionsFromExcel, setManualQuestionsFromExcel] = useState([]);


    // Expose functions for saving exam data through ref
    useImperativeHandle(ref, () => ({
        handlePostExam: () => generalInformationRef.current.handleCreateExam(),
        handleSaveDraft: () => generalInformationRef.current.handleCreateExamDraft()
    }));

    useEffect(() => {
        if (examId) {
            dispatch(fetchExam(examId));
        }
        return () => {
            dispatch(resetExam());
        };
    }, [dispatch, examId]);

    const handleExamInfoUpdate = (field, value) => {
        setLocalExam((prev) => ({ ...prev, [field]: value }));
    };

    // Method to add a manual question through QuestionAdding
    const handleAddManualQuestion = (newQuestion) => {
        generalInformationRef.current?.addManualQuestion(newQuestion);
    };

    const handleAddRandomQuestions = (newQuestions) => {
        generalInformationRef.current?.addRandomQuestions(newQuestions);
        setLocalExam((prev) => ({ ...prev, questions: [...prev.questions, ...newQuestions] }));
    };

    const handleAddSelectedQuestions = (selectedQuestions) => {
        generalInformationRef.current?.addSelectedQuestions(selectedQuestions);
        setLocalExam((prev) => ({ ...prev, questions: [...prev.questions, ...selectedQuestions] }));
    };

    const handleUpdateQuestion = (updatedQuestion) => {
        setLocalExam((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
        }));
    };

    const handleAddManualQuestionsFromExcel = (questions) => {
        setManualQuestionsFromExcel(questions);
    };

    const handleRemoveQuestion = (questionId) => {
        setLocalExam((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q._id !== questionId),
        }));
        generalInformationRef.current?.removeQuestion(questionId);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
        if (key === 'submission') {
            navigate(`/instructor/exam/submissions/${examId}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="w-3/5 mx-auto mt-5 mb-24 relative">
            <ExamHeader
                items={[{ key: 'general', label: 'General' }, { key: 'submission', label: 'Submissions' }]}
                onChangeTab={handleTabChange}
                onPost={() => generalInformationRef.current.handleCreateExam()}
                onSaveDraft={() => generalInformationRef.current.handleCreateExamDraft()}
                examData={localExam}
            />
            {activeTab === 'general' ? (
                <>
                    <SingleCollapse header="Thông tin bài kiểm tra">
                        <GeneralInformation
                            ref={generalInformationRef}
                            exam={localExam}
                            onUpdateExam={handleExamInfoUpdate}
                            onGradeSelect={setSelectedGrade}
                            onCategorySelect={setSelectedCategory}
                            onGroupSelect={setSelectedGroup}
                            manualQuestionsFromExcel={manualQuestionsFromExcel}
                        />
                    </SingleCollapse>

                    <div>
                        {/* Render Question Cards rand */}
                        {localExam.questions.length > 0 ? (
                            localExam.questions.map((question, index) => (
                                <QuestionCard
                                    key={question._id || index}
                                    question={question}
                                    index={index}
                                    onUpdate={handleUpdateQuestion}
                                    onRemove={() => handleRemoveQuestion(question._id)}
                                />
                            ))
                        ) : (
                            <p>No questions added yet.</p>
                        )}
                    </div>
                    <QuestionAdding
                        onAddRandomQuestions={handleAddRandomQuestions}
                        onAddSelectedQuestions={handleAddSelectedQuestions}
                        addManualQuestion={handleAddManualQuestion} // Pass handleAddManualQuestion here
                        onAddQuestionsFromExcel={handleAddManualQuestionsFromExcel}

                    />
                </>
            ) : (
                <Submission examId={examId} />
            )}
        </div>
    );
});

export default ExamCreate;
