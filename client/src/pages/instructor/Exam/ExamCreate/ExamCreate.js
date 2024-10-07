import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { addQuestion, updateQuestion, removeQuestion, setEditMode } from 'store/questionSlice';
import { updateExam, updateQuestion, removeQuestion, addQuestion } from 'store/examSlice';
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

function ExamCreate({examId}) {
    const [editMode, setEditMode] = useState(null); 
    const { exam, loading, error } = useSelector((state) => state.exam);

    const dispatch = useDispatch();

    // Gọi API để tải bài test khi component được mount
    useEffect(() => {
        // const examId = "6703d8dc3f1250100f136c43"
        if(examId){
            dispatch(fetchExam(examId));
        }
    }, [dispatch, examId]);

    const handleUpdateExam = (updatedData) => {
        dispatch(updateExam(updatedData));
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            id: generateRandomId(),
            question_text: 'New Question?',
            question_type: 'multiple-choice',
            options: ["abc", "cdf"],
            correct_answers: ["abc"]
        };
        dispatch(addQuestion(newQuestion));
    };

    const handleUpdateQuestion = (id, updatedQuestion) => {
        dispatch(updateQuestion({ ...updatedQuestion, id: id })); // Make sure to include the ID
    };

    const handleRemoveQuestion = (id) => {
        dispatch(removeQuestion(id));
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

                <div className='mb-4'>
                    <SectionCollapse
                        header="Section 1"
                    >
                        <div>
                            <Input
                                className='input-custom'
                                size='large'
                                placeholder="Enter section title"
                            />
                            <TextArea
                                className='input-custom mt-3'
                                placeholder="Enter section description"
                                autoSize={{ minRows: 2, maxRows: 2 }}
                            />
                        </div>
                    </SectionCollapse>
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

                <QuestionAdding handleAddQuestion={handleAddQuestion}/>
            </div>
        </>
    );
}

export default ExamCreate;