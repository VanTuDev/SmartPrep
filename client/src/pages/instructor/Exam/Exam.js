import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { message } from 'antd';
import dayjs from 'dayjs';
import ExamHeader from "./ExamCreate/ExamHeader";
import ExamCreate from "./ExamCreate/ExamCreate";
import Submission from "./Submission/Submission";


//Import using Redux
import { Provider } from 'react-redux';
import { store } from '../../../store/store';


const items = [
    {
        key: '1',
        label: 'Exam',
    },
    {
        key: '2',
        label: 'Submission',
    }
];

function Exam() {
    const navigate = useNavigate(); 
    const [activeTab, setActiveTab] = useState('1');
    const { examId: initialExamId } = useParams();
    const [examId, setExamId] = useState(initialExamId);
    const [exam, setExam] = useState({
        title: "",
        description: "",
        access_type: "",
        duration: 0,
        start_date: null,
        end_date: null,
        access_link: "",
        status: 'published',
        grade_id: null,
        category_id: null,
        group_id: null,
        classRoom_id: null,
        questions: [], // Khởi tạo mặc định là mảng rỗng
    });
    
    const [loading, setLoading] = useState(false);
    const accessLink = exam.access_link || `http://localhost:3000/${Math.random().toString(36).substring(2)}`;

    const onChangeTab = (key) => {
        setActiveTab(key)
    }

    useEffect(() => {
        setExamId(initialExamId); // Update local examId when params change
    }, [initialExamId]);
    console.log(examId)

    const onUpdateExam = (updatedExam) => {
        setExam((prev) => ({
            ...prev,
            ...updatedExam,
            questions: updatedExam.questions || [], // Đảm bảo mảng câu hỏi hợp lệ
        }));
        console.log(exam);
        
    };

    const validateExam = () => {
        if (!exam.title.trim() || !exam.description.trim() || exam.questions.length === 0) {
            message.error('Please fill out all required fields (title, description, and questions).');
            return false;
        }
        if (exam.startDate && exam.endDate && dayjs(exam.endDate).isBefore(dayjs(exam.startDate))) {
            message.error('End time must be after the start time.');
            return false;
        }
        return true;
    };

    const handleCreateExam = async () => {
        if (!validateExam()) return;

        try {
            setLoading(true);
            onUpdateExam({ access_link: accessLink });
            console.log('Sending Exam Data:', exam);

            // Make API request to create the exam
            const response = await axios.post(
                'http://localhost:5000/api/instructor/test/create',
                exam,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );

            message.success('Exam created successfully!');
            console.log('Exam creation response:', response.data);
            navigate("/instructor/dashboard")
        } catch (error) {
            if (error.response) {
                console.error('Backend error response:', error.response.data);
                message.error(`Failed to create exam: ${error.response.data.error}`);
            } else {
                console.error('Network or server error:', error.message);
                message.error('Could not connect to server.');
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <Provider store={store}>
            <ExamHeader items={items} onChangeTab={onChangeTab} loading={loading} handleCreateExam={handleCreateExam} />
            <div className="mt-24">
                {activeTab === '1' && <ExamCreate examId={examId} exam={exam} setExam={setExam} onUpdateExam={onUpdateExam}/>}
                {activeTab === '2' && <Submission examId={examId} />}
            </div>
        </Provider>
    );
}

export default Exam;