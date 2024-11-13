// CalendarTab.js
import { useState } from 'react';
import Calendar from 'react-calendar';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import '../../../styles/calendar.css';
import { Modal } from 'antd';
import { toast, ToastContainer } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CalendarTab = ({ exams }) => {
    const [calendarEvents, setCalendarEvents] = useState(
        exams.map((exam) => ({
            id: exam._id,
            title: exam.title,
            start: dayjs(exam.start_date).toDate(),
            end: dayjs(exam.end_date).toDate(),
            expired: dayjs().isAfter(dayjs(exam.end_date)),
            color: generateRandomColor()
        }))
    );

    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedExams, setSelectedExams] = useState([]);

    function generateRandomColor() {
        const r = Math.floor(66);
        const g = Math.floor(133);
        const b = Math.floor(244);
        return `rgba(${r}, ${g}, ${b}, 0.6)`;
    }

    const handleExamClick = (examId, expired, start) => {
        const now = dayjs();
        if (expired) {
            toast.info("Bài kiểm tra đã kết thúc. Bạn không thể tham gia vào thời điểm này.");
        } else if (now.isBefore(start)) {
            toast.info("Bài kiểm tra chưa bắt đầu. Vui lòng quay lại sau."); // Show toast if exam hasn’t started
        } else {
            // Only navigate if the exam is active and not expired
            window.location.href = `/learner/TakeExam/${examId}`;
        }
    };

    const handleDateClick = (date) => {
        const examsOnDate = calendarEvents.filter(event =>
            dayjs(event.start).isSameOrBefore(date, 'day') &&
            dayjs(event.end).isSameOrAfter(date, 'day')
        );

        setSelectedExams(examsOnDate);
        setSelectedDate(date);
        setIsModalVisible(true);
    };

    // Adjust renderCalendarEvents to only show colors on the start date
    const renderCalendarEvents = ({ date }) => {
        const eventsOnStartDate = calendarEvents.filter(event =>
            dayjs(event.start).isSame(date, 'day') // Only match the start date for displaying color
        );
 
        return (
            <div className="relative h-full w-full mb-3">
                {eventsOnStartDate.map((event, index) => (
                    <div
                        key={event.id}
                        className="absolute top-0 left-0 right-0 bottom-0 rounded"
                        style={{
                            backgroundColor: event.color,
                            zIndex: index, // Layer colors with z-index for overlap
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="calendar-container w-full">
            <Calendar className="w-full p-3"
                onClickDay={handleDateClick}
                tileContent={renderCalendarEvents}
                tileClassName={({ date }) =>
                    calendarEvents.some(event =>
                        dayjs(event.start).isSame(date, 'day') // Only highlight the start date
                    )
                        ? 'highlight' // Ensures each tile with an event start date has the highlight class
                        : ''
                }
            />

            <Modal
                title={`Exams on ${dayjs(selectedDate).format('DD/MM/YYYY')}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                {selectedExams.length > 0 ? (
                    <div className="space-y-2">
                        {selectedExams.map(exam => (
                            <div
                                key={exam.id}
                                className={`p-2 rounded ${exam.expired ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
                                onClick={() => handleExamClick(exam.id, exam.expired, exam.start)}
                                style={{ backgroundColor: exam.color }}
                            >
                                {exam.title}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Hôm nay không có bài kiểm tra nào.</p>
                )}
            </Modal>

            {/* Toast container to show notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CalendarTab;
