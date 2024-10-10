import React, { useRef } from 'react';
import { Drawer, Space, Radio } from "antd";
import { AlarmClock } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ExportPdfPage({ visible, onClose, exam }) {
    const pdfRef = useRef();

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Tiêu đề bài kiểm tra
        doc.setFontSize(16);
        doc.text(`Exam: ${exam?.title}`, 10, 10);

        let yPosition = 20; // Vị trí dòng hiện tại trong PDF

        // Duyệt qua các câu hỏi và thêm vào PDF
        exam?.questions.forEach((question, index) => {
            // Thêm câu hỏi vào PDF
            doc.setFontSize(14);
            doc.text(`Question ${index + 1}: ${question.question_text}`, 10, yPosition);
            yPosition += 8;

            // Thêm các lựa chọn vào PDF
            question.options.forEach((option, i) => {
                const isCorrect = question.correct_answers.includes(option);
                doc.setFontSize(12);

                // Thêm lựa chọn và hiển thị (Correct Answer) nếu đúng
                const optionText = `${String.fromCharCode(65 + i)}. ${option} ${isCorrect ? '(Correct Answer)' : ''}`;
                doc.text(optionText, 20, yPosition);
                yPosition += 6;
            });

            yPosition += 10; // Thêm khoảng cách giữa các câu hỏi
        });

        // Lưu file PDF
        doc.save('exam.pdf');
    };

    return (
        <>
            <Drawer
                title={
                    <div className="drawer-header">
                        <div></div>
                        <div className="title text-lime-500 flex items-center space-x-3">
                        </div>
                        <div>
                            <button onClick={exportToPDF} className="button-normal-custom px-2 py-2">
                                Export to PDF
                            </button>
                        </div>
                    </div>
                }
                placement="right"
                onClose={onClose}
                visible={visible}
                width="100vw"
                headerStyle={{ padding: '0 16px' }}
                bodyStyle={{ padding: 0 }} // Optional styling
            >
                <div className="w-3/5 mx-auto mt-5 mb-24" id="exam-content" ref={pdfRef}>
                    {/* Main Content */}
                    <div className='shadow-lg border-gray-950'>
                        {exam?.questions.map((question, index) => (
                            <div className='w-full p-4 mb-4' key={index}>
                                <p><strong>{`Question ${index + 1}: `}{question.question_text}</strong></p>
                                <Space direction="vertical">
                                    {question.options.map((option, i) => (
                                        <div key={i} className='flex items-center w-full'>
                                            <Radio className='mx-3' checked={question.correct_answers.includes(option)} disabled />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                </Space>
                            </div>
                        ))}
                    </div>
                </div>
            </Drawer>
        </>
    );
}

export default ExportPdfPage;
