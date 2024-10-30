import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { resetExam, fetchExam } from 'store/examSlice';
import SingleCollapse from "components/Collapse/SingleCollapse";
import GeneralInformation from "./GeneralInformation";
import QuestionCard from 'components/Card/QuestionCard';


function ExamCreate({ examId, exam, setExam, onUpdateExam }) {

    const { examExist, isloading, error } = useSelector((state) => state.exam);
    const dispatch = useDispatch();

    useEffect(() => {
        if (examId) {
            dispatch(fetchExam(examId));
        }
        return () => {
            dispatch(resetExam());
        };
    }, [dispatch, examId]);

    useEffect(() => {
        if (examExist) {
            setExam((prev) => ({
                ...prev,
                ...examExist,
                start_date: examExist.start_date ? dayjs(examExist.start_date) : null,
                end_date: examExist.end_date ? dayjs(examExist.end_date) : null,
                questions: examExist.questions || [], // Đảm bảo luôn là mảng
            }));
        }
    }, [examExist]);


    if (isloading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="w-3/5 mx-auto mt-5 mb-24">
            <div className="mb-4">
                <SingleCollapse header="Thông tin bài kiểm tra">
                    <GeneralInformation exam={exam} onUpdateExam={onUpdateExam} />
                </SingleCollapse>
            </div>

            <div>
                {exam.questions.length > 0 ? (
                    exam.questions.map((question, index) => (
                        <QuestionCard
                            key={question._id}
                            question={question}
                            index={index + 1}
                        />
                    ))
                ) : (
                    <p>No questions available.</p>
                )}
            </div>
        </div>
    );
}

export default ExamCreate;