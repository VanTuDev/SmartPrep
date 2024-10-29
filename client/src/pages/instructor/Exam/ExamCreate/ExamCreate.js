import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {  resetExam, fetchExam, createExam } from 'store/examSlice';
import { message, Button } from "antd";
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation";
import QuestionCard from 'components/Card/QuestionCard';


function ExamCreate({ examId }) {
    const [editMode, setEditMode] = useState(null);
    const [questionIds, setQuestionIds] = useState([]); // Quản lý ID câu hỏi
    const [localExam, setLocalExam] = useState({ title: '', description: '' }); // Lưu trữ dữ liệu bài kiểm tra tạm thời
    const { exam, loading, error } = useSelector((state) => state.exam);
    const dispatch = useDispatch();

    // Tải bài kiểm tra khi component được mount
    useEffect(() => {
        if (examId) {
            dispatch(fetchExam(examId));
        }
        return () => {
            dispatch(resetExam());
        };
    }, [dispatch, examId]);

    // Đồng bộ câu hỏi từ Redux vào `questionIds`
    useEffect(() => {
        if (exam?.questions) {
            const ids = exam.questions.map((q) => q._id);
            setQuestionIds(ids);
        }
        if (exam) {
            setLocalExam({ title: exam.title || '', description: exam.description || '' });
        }
    }, [exam]);

    // Thêm các ID câu hỏi khi có câu hỏi mới
    const handleQuestionsUpdate = (newQuestions) => {
        const newIds = newQuestions.map((q) => q._id);
        setQuestionIds((prevIds) => [...new Set([...prevIds, ...newIds])]);
    };

    // Kiểm tra dữ liệu trước khi đăng bài kiểm tra
    const validateExamData = () => {
        const { title, description } = localExam;
        if (!title || !description || questionIds.length === 0) {
            message.error("Please fill out all required fields (title, description, and questions).");
            return false;
        }
        return true;
    };

    // Cập nhật dữ liệu bài kiểm tra từ GeneralInformation
    const handleExamInfoUpdate = (field, value) => {
        setLocalExam((prev) => ({ ...prev, [field]: value }));
    };


    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="w-3/5 mx-auto mt-5 mb-24">
            <div className="mb-4">
                <SingleCollapse header="Thông tin bài kiểm tra">
                    <GeneralInformation
                        exam={localExam}
                        onUpdateExam={handleExamInfoUpdate}
                    />
                </SingleCollapse>
            </div>

            <div>
                {exam?.questions.map((question, index) => (
                    <QuestionCard
                        key={question._id}
                        question={question}
                        index={index + 1}
                        editMode={editMode}
                        setEditMode={setEditMode}
                    />
                ))}
            </div>




        </div>
    );
}

export default ExamCreate;
