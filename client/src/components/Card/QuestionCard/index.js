// File: QuestionCard.js

import React, { useState, useEffect } from 'react';
import { Card, Input, Checkbox, Space, Tooltip, Button, message, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Trash2 } from 'lucide-react';

const QuestionCard = ({ question = {}, index, onUpdate, onRemove }) => {
    const [localQuestion, setLocalQuestion] = useState({
        question_text: '',
        question_type: 'multiple-choice',
        options: [''],
        correct_answers: [],
        ...question
    });

    useEffect(() => {
        setLocalQuestion({ ...localQuestion, ...question });
    }, [question]);

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
            message.error('Question text should not be empty!');
            return;
        }
        if (localQuestion.options.some((answer) => !answer.trim())) {
            message.error('All answer choices must be filled!');
            return;
        }

        onUpdate(localQuestion);
        message.success('Question saved!');
    };

    return (
        <Card
            className="w-full p-4 mb-4 card-custom"
            title={`Question ${index + 1}`}
            bordered
            style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <p><strong>Question ID:</strong> {localQuestion._id || 'New Question'}</p>
                    <Input
                        size="large"
                        placeholder="Enter question text"
                        value={localQuestion.question_text}
                        onChange={(e) => setLocalQuestion({ ...localQuestion, question_text: e.target.value })}
                        className="mb-4"
                        style={{ fontSize: '16px', width: '70%' }} // Narrowed width
                    />
                </Col>

                <Col span={24}>
                    <Space direction="vertical" className="w-full">
                        {localQuestion.options.map((option, i) => (
                            <Row key={i} align="middle" gutter={8}>
                                <Col flex="30px">
                                    <Tooltip title="Mark as correct">
                                        <Checkbox
                                            checked={localQuestion.correct_answers.includes(option)}
                                            onChange={(e) => handleCorrectAnswerChange(e.target.checked, option)}
                                        />
                                    </Tooltip>
                                </Col>
                                <Col flex="auto">
                                    <Input
                                        value={option}
                                        placeholder={`Answer ${i + 1}`}
                                        onChange={(e) => handleAnswerChange(i, e.target.value)}
                                        style={{ fontSize: '14px', width: '85%' }} // Reduced width of answer inputs
                                    />
                                </Col>
                                <Col flex="30px">
                                    {localQuestion.options.length > 1 && (
                                        <Button
                                            type="link"
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => handleRemoveAnswer(option)}
                                            style={{ color: '#ff4d4f' }}
                                        />
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </Space>
                </Col>

                <Col span={24}>
                    <div className="flex items-center mt-4">
                        <Tooltip title="Add Answer">
                            <Button
                                type="link"
                                icon={<PlusOutlined />}
                                onClick={handleAddAnswer}
                                className="p-0"
                                style={{ color: '#52c41a' }}
                            />
                        </Tooltip>
                    </div>
                </Col>

                <Col span={24} className="flex justify-end space-x-2 mt-4">
                    <Tooltip title="Delete question">
                        <Button
                            type="primary"
                            danger
                            icon={<Trash2 />}
                            onClick={() => onRemove(localQuestion._id)}
                        />
                    </Tooltip>
                    <Button type="primary" onClick={handleSaveQuestion}>
                        Save
                    </Button>
                </Col>
            </Row>
        </Card>
    );
};

export default QuestionCard;
