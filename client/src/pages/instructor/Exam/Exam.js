// File: Exam.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ExamHeader from "./ExamCreate/ExamHeader";
import ExamCreate from "./ExamCreate/ExamCreate";
import Submission from "./Submission/Submission";
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

const items = [
    { key: '1', label: 'Exam' },
    { key: '2', label: 'Submission' }
];

function Exam() {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState('1');
    const { examId: initialExamId } = useParams();
    const [examId, setExamId] = useState(initialExamId);

    const examCreateRef = useRef(); // Tạo ref cho ExamCreate

    const onChangeTab = (key) => {
        setActiveTab(key);
    };

    useEffect(() => {
        setExamId(initialExamId);
    }, [initialExamId]);

    const handlePostExam = () => {
        if (examCreateRef.current) {
            examCreateRef.current.handlePostExam(); // Gọi hàm thông qua ref
        }
    };

    return (
        <Provider store={store}>
            <ExamHeader
                items={items}
                onChangeTab={onChangeTab}
                onPost={handlePostExam} // Truyền hàm vào header
                activeTab={activeTab}
                setExamId={setExamId}
                examId={examId}
            />
            <div className="mt-24">
                {activeTab === '1' && (
                    <ExamCreate
                        ref={examCreateRef} // Truyền ref vào ExamCreate
                        examId={examId}
                    />
                )}
                {activeTab === '2' && <Submission examId={examId} />}
            </div>
        </Provider>
    );
}

export default Exam;
