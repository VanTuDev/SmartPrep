import React, { useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation";
import SectionCollapse from "components/Collapse/SectionCollapse";
import { Input, Button } from "antd";
import QuestionCard from 'components/Card/QuestionCard';

const { TextArea } = Input;

function ExamCreate() {
    const [questions, setQuestions] = useState([
        { id: 1, text: 'AOTY is:', answers: [{ id: 1, text: 'Saitama' }, { id: 2, text: 'One Piece' }, { id: 3, text: 'Dragon Ball' }, { id: 4, text: 'Doraemon' }], correctAnswer: null },
    ]);
    const [editMode, setEditMode] = useState(null);  // Stores the question ID being edited

    const handleAddQuestion = () => {
        setQuestions([...questions, { id: questions.length + 1, text: '', answers: [{ id: 1, text: '' }], correctAnswer: null }]);
    };

    const handleUpdateQuestion = (id, updatedQuestion) => {
        setQuestions(questions.map((q) => (q.id === id ? updatedQuestion : q)));
    };

    const handleRemoveQuestion = (id) => {
        setQuestions(questions.filter((q) => q.id !== id));
    };
    return (
        <>
            <div className="w-3/5 mx-auto mt-5">
                <div className='mb-4'>
                    <SingleCollapse header="General information">
                        <GeneralInformation />
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
                    {questions.map((question, index) => (
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

                    <Button type="dashed" onClick={handleAddQuestion} className="w-full mt-4">
                        Add question
                    </Button>
                </div>
            </div>
        </>
    );
}

export default ExamCreate;