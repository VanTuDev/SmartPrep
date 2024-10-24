
// CÁC THANH UP LOAD QUESTION


import React, { useState } from "react";
import { LayoutTemplate, Upload as LucideUpload, Folder, BotMessageSquare, Plus } from "lucide-react";
import { Modal, Upload, Button, message } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";

function QuestionAdding({ handleAddQuestionsFromExcel, handleAddQuestion }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Hàm để mở modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Hàm để đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Hàm xử lý file và đọc dữ liệu từ file Excel
    const handleFileRead = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Kiểm tra nếu file rỗng hoặc không có dữ liệu hợp lệ
            if (rows.length <= 1) {
                message.error("File không có dữ liệu hoặc định dạng không hợp lệ.");
                return;
            }

            // Chuyển đổi dữ liệu thành danh sách câu hỏi
            const questions = [];
            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];

                // Kiểm tra các cột của hàng hiện tại
                if (row.length < 2) {
                    console.warn(`Hàng ${i + 1} không hợp lệ, bỏ qua:`, row);
                    message.warning(`Hàng ${i + 1} trong file không hợp lệ, đã bỏ qua.`);
                    continue;
                }

                const question_text = row[0]; // Cột chứa nội dung câu hỏi
                const options = row.slice(1, row.length - 1); // Các cột từ thứ 2 đến cột gần cuối là các options
                // const correct_answers = row[row.length - 1].split(',').map(answer => answer.trim()); // Cột cuối cùng chứa correct_answers
                // Kiểm tra và xử lý giá trị ở cột cuối cùng, nếu không phải chuỗi thì báo lỗi ngay
                const lastColumnValue = row[row.length - 1];
                if (typeof lastColumnValue !== 'string') {
                    message.error(`Lỗi dữ liệu tại hàng ${i + 1}. Cột cuối cùng phải là một chuỗi chứa đáp án đúng.`);
                    return;
                }

                // Tách đáp án thành mảng các đáp án đúng
                const correct_answers = lastColumnValue.split(',').map(answer => answer.trim());

                questions.push({
                    question_text,
                    question_type: 'multiple-choice',
                    options,
                    correct_answers
                });
            }

            if (questions.length === 0) {
                message.error("Không tìm thấy câu hỏi hợp lệ trong file.");
            } else {
                handleAddQuestionsFromExcel(questions);
                message.success("Thêm câu hỏi từ Excel thành công!");
                closeModal();
            }
        };
        reader.readAsBinaryString(file);
    };

    // Cấu hình của component Upload
    const uploadProps = {
        name: "file",
        multiple: false,
        accept: ".xlsx, .xls",
        beforeUpload: (file) => {
            const isExcel = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || file.type === "application/vnd.ms-excel";
            if (!isExcel) {
                alert("Chỉ được phép upload file Excel (.xlsx hoặc .xls)!");
                return Upload.LIST_IGNORE;
            }
            console.log("File đã chọn: ", file);
            handleFileRead(file);
            return false; // Không tự động upload, xử lý bằng tay
        },
    };

    // Hàm xử lý khi người dùng muốn tải file mẫu
    const downloadSampleFile = () => {
        const link = document.createElement("a");
        link.href = "/sampleFileForQuestion/sample_questions.xlsx"; // Đường dẫn file mẫu
        link.download = "sample_questions.xlsx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg flex space-x-4 border-2">
                <button className="flex flex-col items-center">
                    <LayoutTemplate />
                    <div className="text-xs">Section</div>
                </button>
                {/* upload file excel */}
                <button onClick={openModal} className="flex flex-col items-center">
                    <LucideUpload />
                    <div className="text-xs">Upload files</div>
                </button>
                {/* tạo random câu hỏi */}
                <button className="flex flex-col items-center">
                    <Folder />
                    <div className="text-xs">Library</div>
                </button>
                <button className="flex flex-col items-center">
                    <BotMessageSquare />
                    <div className="text-xs">AI</div>
                </button>
                <button onClick={handleAddQuestion} className="button-normal-custom p-2">
                    <Plus />
                    Add question
                </button>
            </div>

            {/* Modal Upload excel*/}
            <Modal
                title="Upload Excel File"
                visible={isModalOpen}
                onCancel={closeModal}
                footer={[
                    <Button key="sample" icon={<DownloadOutlined />} onClick={downloadSampleFile}>
                        Tải file mẫu
                    </Button>,
                    <Button key="back" onClick={closeModal}>
                        Đóng
                    </Button>,
                ]}
                centered
                className="rounded-lg"
            >
                <div className="p-4">
                    <Upload.Dragger {...uploadProps} className="p-8 rounded-lg">
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined style={{ fontSize: '32px', color: '#585890' }} />
                        </p>
                        <p className="ant-upload-text">Kéo thả file vào đây hoặc nhấp để chọn file</p>
                        <p className="ant-upload-hint">Chỉ hỗ trợ các file Excel (.xlsx hoặc .xls)</p>
                    </Upload.Dragger>
                </div>
            </Modal>
        </>
    );
}

export default QuestionAdding;
