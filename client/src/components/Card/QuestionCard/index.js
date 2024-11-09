// QuestionCard.js

import React, { useState } from 'react';
import { Card, Input, Checkbox, Space, Tooltip, Button, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Trash2 } from 'lucide-react';

const QuestionCard = ({ question, index, onUpdate, onRemove }) => {
    const [localQuestion, setLocalQuestion] = useState(question);

    const handleAnswerChange = (index, text) => {
        const updatedAnswers = [...localQuestion.options];
        updatedAnswers[index] = text;
        setLocalQuestion({ ...localQuestion, options: updatedAnswers });
    };

    const handleAddAnswer = () => {
        setLocalQuestion({ ...localQuestion, options: [...localQuestion.options, ''] });
    };

    const handleRemoveAnswer = (optionText) => {
        const updatedAnswers = localQuestion.options.filter((answer) => answer !== optionText);
        const updatedCorrect = localQuestion.correct_answers.filter((ans) => ans !== optionText);
        setLocalQuestion({ ...localQuestion, options: updatedAnswers, correct_answers: updatedCorrect });
    };

    const handleCorrectAnswerChange = (checked, option) => {
        const updatedCorrectAnswers = checked
            ? [...localQuestion.correct_answers, option]
            : localQuestion.correct_answers.filter((ans) => ans !== option);
        setLocalQuestion({ ...localQuestion, correct_answers: updatedCorrectAnswers });
    };

    const handleSaveQuestion = () => {
        if (!localQuestion.question_text.trim()) {
            message.error('Question should not be empty!');
            return;
        }
        if (localQuestion.options.some((answer) => !answer.trim())) {
            message.error('All choices must be filled!');
            return;
        }
        onUpdate(localQuestion); // Update the question in the parent component
        message.success('Question saved!');
    };

    return (
        <Card
            className="w-full p-4 mb-4 card-custom"
            title={`Question ${index + 1}`}
            bordered={true}
            style={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
        >
            <div>
                <p><strong>Question ID:</strong> {localQuestion._id || 'N/A'}</p>
                <Input
                    size="large"
                    placeholder="Enter question"
                    value={localQuestion.question_text}
                    onChange={(e) => setLocalQuestion({ ...localQuestion, question_text: e.target.value })}
                    className="mb-4"
                />

                <Space direction="vertical" className="w-full">
                    {localQuestion.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                            <Tooltip title="Mark as correct">
                                <Checkbox
                                    checked={localQuestion.correct_answers.includes(option)}
                                    onChange={(e) => handleCorrectAnswerChange(e.target.checked, option)}
                                />
                            </Tooltip>
                            <Input
                                value={option}
                                placeholder={`Answer ${i + 1}`}
                                onChange={(e) => handleAnswerChange(i, e.target.value)}
                                className="w-full"
                            />
                            {localQuestion.options.length > 1 && (
                                <Button
                                    type="link"
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => handleRemoveAnswer(option)}
                                />
                            )}
                        </div>
                    ))}
                </Space>

                <div className="flex items-center mt-4">
                    <Tooltip title="Add Answer">
                        <Button
                            type="link"
                            icon={<PlusOutlined />}
                            onClick={handleAddAnswer}
                            className="p-0"
                        />
                    </Tooltip>
                </div>

                <div className="flex justify-end space-x-2 mt-4">
                    <Tooltip title="Delete question">
                        <Button
                            type="primary"
                            danger
                            icon={<Trash2 />}
                            onClick={() => onRemove(localQuestion._id)} // Pass question ID to the remove function
                        />
                    </Tooltip>
                    <Button type="primary" onClick={handleSaveQuestion}>
                        Save
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default QuestionCard;
