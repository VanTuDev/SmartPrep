// File: Exam.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ExamHeader from "./ExamCreate/ExamHeader";
import ExamCreate from "./ExamCreate/ExamCreate";
import Submission from "./Submission/Submission";
import { Provider } from 'react-redux';
import { store } from '../../../store/store';

// Các tab trong phần giao diện (Exam và Submission)
const items = [
    { key: '1', label: 'Exam' },
    { key: '2', label: 'Submission' }
];

function Exam() {
    const navigate = useNavigate(); // Điều hướng trang
    const [activeTab, setActiveTab] = useState('1'); // State cho tab hiện tại (1: Exam, 2: Submission)
    const { examId: initialExamId } = useParams(); // Lấy examId từ URL
    const [examId, setExamId] = useState(initialExamId); // State lưu examId của bài kiểm tra hiện tại

    const examCreateRef = useRef(); // Tạo ref cho component ExamCreate

    // Xử lý chuyển tab khi người dùng thay đổi lựa chọn
    const onChangeTab = (key) => {
        setActiveTab(key);
    };

    // Cập nhật examId khi giá trị trong URL thay đổi
    useEffect(() => {
        setExamId(initialExamId);
    }, [initialExamId]);

    // Hàm xử lý đăng (post) bài kiểm tra mới hoặc cập nhật bài kiểm tra hiện có
    const handlePostExam = () => {
        if (examCreateRef.current) {
            examCreateRef.current.handlePostExam(); // Gọi hàm handlePostExam từ ExamCreate thông qua ref
        }
    };

    return (
        <Provider store={store}>
            <ExamHeader
                items={items}
                onChangeTab={onChangeTab} // Truyền hàm onChangeTab vào ExamHeader
                onPost={handlePostExam} // Truyền hàm handlePostExam vào ExamHeader
                activeTab={activeTab} // Truyền tab hiện tại vào ExamHeader để xác định tab đang mở
                setExamId={setExamId} // Truyền hàm setExamId để cập nhật examId
                examId={examId} // Truyền examId để sử dụng trong ExamHeader
            />
            <div className="mt-24">
                {activeTab === '1' && (
                    <ExamCreate
                        ref={examCreateRef} // Truyền ref vào ExamCreate để có thể truy cập hàm nội bộ của nó
                        examId={examId} // Truyền examId vào ExamCreate để load dữ liệu bài kiểm tra nếu cần
                    />
                )}
                {activeTab === '2' && <Submission examId={examId} />} {/* Tab Submission hiển thị nộp bài */}
            </div>
        </Provider>
    );
}

export default Exam;
