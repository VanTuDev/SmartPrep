// File: Exam.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

import ExamHeader from "./ExamCreate/ExamHeader";
import ExamCreate from "./ExamCreate/ExamCreate";
import Submission from "./Submission/Submission";

// Define tabs for the UI (Exam and Submission)
const items = [
    { key: '1', label: 'Exam' },
    { key: '2', label: 'Submission' }
];

function Exam() {
    const navigate = useNavigate(); // For navigation between routes
    const { examId: initialExamId } = useParams(); // Get examId from the URL
    const [examId, setExamId] = useState(initialExamId); // Track the current examId
    const [activeTab, setActiveTab] = useState('1'); // State for active tab ('1': Exam, '2': Submission)

    const examCreateRef = useRef(); // Create a ref for ExamCreate to access its functions

    // Handle tab change when user switches tabs
    const onChangeTab = (key) => {
        setActiveTab(key);
    };

    // Update examId when the URL param changes
    useEffect(() => {
        setExamId(initialExamId);
    }, [initialExamId]);

    // Function to handle posting a new exam or updating an existing exam
    const handlePostExam = () => {
        if (examCreateRef.current) {
            examCreateRef.current.handlePostExam(); // Call handlePostExam in ExamCreate through ref
        }
    };

    return (
        <Provider store={store}>
            <ExamHeader
                items={items}
                onChangeTab={onChangeTab} // Pass onChangeTab to ExamHeader
                onPost={handlePostExam} // Pass handlePostExam to ExamHeader
                activeTab={activeTab} // Current active tab to highlight in ExamHeader
                setExamId={setExamId} // Update examId when needed
                examId={examId} // Current examId to use in ExamHeader
            />
            <div className="mt-24">
                {activeTab === '1' && (
                    <ExamCreate
                        ref={examCreateRef} // Pass ref to ExamCreate to access its internal functions
                        examId={examId} // Pass examId to load specific exam data if needed
                    />
                )}
                {activeTab === '2' && (
                    <Submission examId={examId} /> // Display Submission tab for submissions
                )}
            </div>
        </Provider>
    );
}

export default Exam;
