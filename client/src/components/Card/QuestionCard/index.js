import React, { useState } from 'react';
import { Card, Input, Button, Radio, Space, message, Tooltip } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Trash2 } from 'lucide-react';

const QuestionCard = ({ question, index, editMode, setEditMode, onUpdate, onRemove }) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    // Update an answer's text
    const handleAnswerChange = (index, text) => {
        const updatedAnswers = [...localQuestion.options];
        updatedAnswers[index] = text;
        setLocalQuestion({ ...localQuestion, options: updatedAnswers });
    };

    // Add a new answer
    const handleAddAnswer = () => {
        setLocalQuestion({ ...localQuestion, options: [...localQuestion.options, ''] });
    };

    // Remove an answer
    const handleRemoveAnswer = (optionText) => {
        const updatedAnswers = localQuestion.options.filter((answer) => answer !== optionText);

        // Nếu đáp án bị xóa là đáp án đúng, thì cập nhật trường correct thành null
        let updatedCorrect = localQuestion.correct_answers;
        if (localQuestion.correct_answers === optionText) {
            updatedCorrect = null;
        }

        setLocalQuestion({ ...localQuestion, options: updatedAnswers, correct_answers: updatedCorrect });
    };

    // Update the correct answer (ensure it exists in the options)
    const handleCorrectAnswerChange = (correctText) => {
        if (localQuestion.options.includes(correctText)) {
            setLocalQuestion({ ...localQuestion, correct_answers: [correctText] });
        } else {
            message.error('Correct answer must be one of the provided options!');
        }
    };

    // Save the question
    const handleSaveQuestion = () => {
        if (!localQuestion.question_text.trim()) {
            message.error('Question should not be empty!');
            return;
        }
        if (localQuestion.options.some((answer) => !answer.trim())) {
            message.error('All choices must be filled!');
            return;
        }
        if (!localQuestion.options.includes(localQuestion.correct_answers[0])) {
            message.error('Choose a correct answer!');
            return;
        }

        onUpdate(localQuestion); // Save data to parent
        setEditMode(null); // Return to preview mode
        message.success('Saved!');
    };

    // Enter edit mode
    const handleCardClick = () => {
        if (editMode !== localQuestion.id) {
            setEditMode(localQuestion.id); // Set edit mode for this question
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
                            className="input-custom"
                            size="large"
                            placeholder="Enter question"
                            value={localQuestion.question_text}
                            onChange={(e) => setLocalQuestion({ ...localQuestion, question_text: e.target.value })}
                            onClick={(e) => e.stopPropagation()} // Prevent click
                        />
                    </div>
                    <div className="w-full mb-4">
                        <Space direction="vertical" className="w-full">
                            {localQuestion.options.map((option, index) => (
                                <div key={index} className="w-full flex items-center space-x-2">
                                    <Tooltip title="Choose correct answer">
                                        <Radio
                                            className="custom-radio"
                                            checked={localQuestion.correct_answers.includes(option)}
                                            onChange={() => handleCorrectAnswerChange(option)}
                                            onClick={(e) => e.stopPropagation()} // Prevent click
                                        />
                                    </Tooltip>
                                    <Input
                                        className="input-custom w-4/5"
                                        value={option}
                                        placeholder={`Answer ${index + 1}`}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    {localQuestion.options.length > 1 && (
                                        <Tooltip title="Delete">
                                            <Button
                                                className="primary-color"
                                                type="link"
                                                icon={<MinusCircleOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveAnswer(option);
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
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddAnswer();
                            }}
                            className="button-outlined-custom-non-p p-2"
                        >
                            <PlusOutlined />
                        </button>
                    </Tooltip>

                    <div className="flex justify-end space-x-2">
                        <Tooltip title="Delete question">
                            <button className="button-error-custom" onClick={onRemove}>
                                <Trash2 />
                            </button>
                        </Tooltip>
                        <button className="button-normal-custom px-3 py-2" onClick={handleSaveQuestion}>
                            Update
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <p><strong>{localQuestion.question_text}</strong></p>
                    <Space direction="vertical">
                        {localQuestion.options.map((option, index) => (
                            <div key={index}>
                                <Radio checked={localQuestion.correct_answers.includes(option)} disabled />
                                <span>{option}</span>
                            </div>
                        ))}
                    </Space>
                </div>
            )}
        </Card>
    );
};

export default QuestionCard;
