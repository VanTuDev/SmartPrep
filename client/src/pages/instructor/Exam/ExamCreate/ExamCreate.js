import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { resetExam, fetchExam } from 'store/examSlice';
import { message } from "antd";
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation";
import QuestionCard from 'components/Card/QuestionCard';
import QuestionAdding from "./QuestionAdding";
import ExamHeader from './ExamHeader';

const ExamCreate = forwardRef(({ examId }, ref) => {
    const [localExam, setLocalExam] = useState({ title: '', description: '', questions: [] });
    const [activeTab, setActiveTab] = useState('general');
    const { exam, loading, error } = useSelector((state) => state.exam);
    const dispatch = useDispatch();
    const generalInformationRef = React.useRef();

    useImperativeHandle(ref, () => ({
        handlePostExam: () => generalInformationRef.current.handleCreateExam(),
        handleSaveDraft: () => generalInformationRef.current.handleCreateExamDraft()  // Thêm handleSaveDraft
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

    const handleAddRandomQuestions = (newQuestions) => {
        if (generalInformationRef.current) {
            generalInformationRef.current.addRandomQuestions(newQuestions);
            setLocalExam((prev) => ({ ...prev, questions: [...prev.questions, ...newQuestions] }));
        } else {
            message.error("Unable to add questions: GeneralInformation ref not available.");
        }
    };

    const handleAddSelectedQuestions = (selectedQuestions) => {
        if (generalInformationRef.current) {
            generalInformationRef.current.addSelectedQuestions(selectedQuestions);
            setLocalExam((prev) => ({ ...prev, questions: [...prev.questions, ...selectedQuestions] }));
        } else {
            message.error("Unable to add selected questions: GeneralInformation ref not available.");
        }
    };

    const handleUpdateQuestion = (updatedQuestion) => {
        setLocalExam((prev) => ({
            ...prev,
            questions: prev.questions.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q)),
        }));
    };

    const handleRemoveQuestion = (questionId) => {
        setLocalExam((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q._id !== questionId),
        }));
        if (generalInformationRef.current) {
            generalInformationRef.current.removeQuestion(questionId); // Remove question ID in GeneralInformation
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="w-3/5 mx-auto mt-5 mb-24 relative">
            <ExamHeader
                items={[]}
                onChangeTab={() => { }}
                onPost={() => generalInformationRef.current.handleCreateExam()}
                onSaveDraft={() => generalInformationRef.current.handleCreateExamDraft()}  
            />
            <SingleCollapse header="Thông tin bài kiểm tra">
                <GeneralInformation
                    ref={generalInformationRef}
                    exam={localExam}
                    onUpdateExam={handleExamInfoUpdate}
                />
            </SingleCollapse>

            <div>
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
                handleAddQuestionsFromExcel={() => { }}
                exam={localExam}
                onAddRandomQuestions={handleAddRandomQuestions}
                onAddSelectedQuestions={handleAddSelectedQuestions}
            />
        </div>
    );
});

export default ExamCreate;