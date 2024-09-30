import React, { useState } from 'react';
// import './QuestionCard.css'
import { Card, Input, Button, Radio, Space, message, Tooltip } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Trash2 } from 'lucide-react';

const QuestionCard = ({ question, index, editMode, setEditMode, onUpdate, onRemove }) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    // Update data to local state when changing question
    const handleAnswerChange = (id, text) => {
        const updatedAnswers = localQuestion.answers.map((answer) =>
            answer.id === id ? { ...answer, text } : answer
        );
        setLocalQuestion({ ...localQuestion, answers: updatedAnswers });
    };

    // Func add answer
    const handleAddAnswer = () => {
        const newAnswer = { id: localQuestion.answers.length + 1, text: '' };
        setLocalQuestion({ ...localQuestion, answers: [...localQuestion.answers, newAnswer] });
    };

    // Func remove answer
    const handleRemoveAnswer = (id) => {
        const updatedAnswers = localQuestion.answers.filter((answer) => answer.id !== id);
        setLocalQuestion({ ...localQuestion, answers: updatedAnswers });
    };

    // Func update correct answer
    const handleCorrectAnswerChange = (id) => {
        setLocalQuestion({ ...localQuestion, correctAnswer: id });
    };

    // Func save question
    const handleSaveQuestion = () => {
        if (!localQuestion.text.trim()) {
            message.error('Question should not empty!');
            return;
        }
        if (localQuestion.answers.some((answer) => !answer.text.trim())) {
            message.error('All choice must be filled!');
            return;
        }
        if (localQuestion.correctAnswer === null) {
            message.error('Choose correct answer!');
            return;
        }

        onUpdate(localQuestion); // Save data to parent
        setEditMode(null); // Return preview mode
        message.success('Saved!');
    };

    // Func turn into edit mode
    const handleCardClick = () => {
        if (editMode !== localQuestion.id) {
            setEditMode(localQuestion.id); // Set edit mode for question
        }
    };

    return (
        <Card
            className="w-full p-4 mb-4 card-custom"
            title={`Question ${index}`}
            bordered={false}
            onClick={handleCardClick}
        >
            {editMode === localQuestion.id ? (
                <div>
                    <div className="mb-4">
                        <Input
                            className='input-custom'
                            size='large'
                            placeholder="Enter question"
                            value={localQuestion.text}
                            onChange={(e) => setLocalQuestion({ ...localQuestion, text: e.target.value })}
                            onClick={(e) => e.stopPropagation()} // Prevent click
                        />
                    </div>
                    <div className="w-full mb-4">
                        <Space direction="vertical" className='w-full'>
                            {localQuestion.answers.map((answer, index) => (
                                <div key={answer.id} className="w-full flex items-center space-x-2">
                                    <Tooltip title="Choose correct answer">
                                        <Radio
                                            className='custom-radio'

                                            checked={localQuestion.correctAnswer === answer.id}
                                            onChange={() => handleCorrectAnswerChange(answer.id)}
                                            onClick={(e) => e.stopPropagation()} // Prevent click
                                        />
                                    </Tooltip>
                                    <Input
                                        className='input-custom w-4/5'
                                        value={answer.text}
                                        placeholder={`Answer ${index + 1}`}
                                        onChange={(e) => handleAnswerChange(answer.id, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {localQuestion.answers.length > 1 && (
                                        <Tooltip title="Delete">
                                            <Button
                                                className='primary-color'
                                                type="link"
                                                icon={<MinusCircleOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveAnswer(answer.id);
                                                }}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            ))}
                        </Space>
                    </div>
                    <Tooltip title="Add choice">
                        <button
                            size='small'
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddAnswer();
                            }}
                            className="button-outlined-custom-non-p p-2"
                        >
                            <PlusOutlined />
                        </button>
                    </Tooltip>

                    <div className='flex justify-end space-x-2'>
                        <Tooltip title="Delete question" >
                            <button className='button-error-custom' onClick={onRemove}>
                                <Trash2 />
                            </button>
                        </Tooltip>
                        <button className='button-normal-custom px-3 py-2' onClick={handleSaveQuestion}>
                            Update
                        </button>

                    </div>
                </div>
            ) : (
                <div>
                    <p><strong>{localQuestion.text}</strong></p>
                    <Space direction="vertical">
                        {localQuestion.answers.map((answer, index) => (
                            <div key={answer.id}>
                                <Radio checked={localQuestion.correctAnswer === answer.id} disabled />
                                <span>{answer.text}</span>
                            </div>
                        ))}
                    </Space>
                </div>
            )}
        </Card>
    );
};

export default QuestionCard;
