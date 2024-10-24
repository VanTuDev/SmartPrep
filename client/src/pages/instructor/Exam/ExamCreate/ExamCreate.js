

// GIAO DIỆN TẠO CÂU HỎI - Tạo câu hỏi

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { addQuestion, updateQuestion, removeQuestion, setEditMode } from 'store/questionSlice';
import { updateExam, updateQuestion, removeQuestion, addQuestion, resetExam } from 'store/examSlice';
import 'styles/instructor/ExamCreate.css'
import { Input, message } from "antd";
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation/GeneralInformation";
import SectionCollapse from "components/Collapse/SectionCollapse";
import QuestionCard from 'components/Card/QuestionCard';
import QuestionAdding from './QuestionAdding/QuestionAdding';
import { fetchExam } from "store/examSlice";
import { generateRandomId } from 'utils/generateRandomId';

const { TextArea } = Input;

function ExamCreate({ examId }) {
    const [editMode, setEditMode] = useState(null);
    const { exam, loading, error } = useSelector((state) => state.exam);

    const dispatch = useDispatch();

    // Gọi API để tải bài test khi component được mount
    useEffect(() => {
        if (examId) {
            dispatch(fetchExam(examId));
        }

        return () => {
            dispatch(resetExam()); // This will reset the exam state when the component is unmounted
        };
    }, [dispatch, examId]);

    const handleUpdateExam = (updatedData) => {
        dispatch(updateExam(updatedData));
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: generateRandomId(),
            question_text: 'New Question?',
            question_type: 'multiple-choice',
            options: ["1", "2"],
            correct_answers: ["1"]
        };
        dispatch(addQuestion(newQuestion));
    };

    const handleUpdateQuestion = (id, updatedQuestion) => {
        dispatch(updateQuestion({ ...updatedQuestion, id: id })); // Make sure to include the ID
    };

    const handleRemoveQuestion = (id) => {
        dispatch(removeQuestion(id));
    };

    const handleAddQuestionsFromExcel = (questions) => {
        // Thêm từng câu hỏi vào store
        questions.forEach((question) => {
            dispatch(addQuestion({ ...question, id: generateRandomId() }));
        });
        message.success("Thêm câu hỏi từ Excel thành công!");
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <>
            <div className="w-3/5 mx-auto mt-5 mb-24">
                <div className='mb-4'>
                    <SingleCollapse header="General information">
                        <GeneralInformation exam={exam} onUpdateExam={handleUpdateExam} />
                    </SingleCollapse>
                </div>

                {/* Questions Section */}
                <div>
                    {exam?.questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            index={index + 1}
                            editMode={editMode}
                            setEditMode={setEditMode}
                            onUpdate={(updatedQuestion) => handleUpdateQuestion(question.id, updatedQuestion)}
                            onRemove={() => handleRemoveQuestion(question.id)}
                        />
                    ))}
                </div>

                <QuestionAdding handleAddQuestionsFromExcel={handleAddQuestionsFromExcel} handleAddQuestion={handleAddQuestion} />
            </div>
        </>
    );
}

export default ExamCreate;