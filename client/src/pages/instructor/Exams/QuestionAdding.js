import React, { useState } from "react";
import { LayoutTemplate, Upload as LucideUpload, Folder, Shuffle, Plus } from "lucide-react";
import { Modal, Upload, Button, message } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import LibraryModal from "../../../components/instructor/LibraryModal";
import QuestionCard from "./QuestionCard";
import * as XLSX from "xlsx";

function QuestionAdding({ handleAddQuestionsFromExcel, handleAddQuestion, exam = {}, onAddRandomQuestions }) {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
   const [questions, setQuestions] = useState(exam.questions || []); // Dùng dữ liệu câu hỏi từ props

   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);
   const openLibraryModal = () => setIsLibraryModalOpen(true);
   const closeLibraryModal = () => setIsLibraryModalOpen(false);

   const addNewQuestion = () => {
      const newQuestion = {
         question_text: "Câu hỏi mới chưa có nội dung",
         options: ["Option A", "Option B", "Option C", "Option D"],
         correct_answers: [],
      };
      setQuestions([...questions, newQuestion]); // Thêm câu hỏi mới
   };

   const handleAddRandomQuestions = (selectedQuestions) => {
      const updatedQuestions = [...questions, ...selectedQuestions];
      setQuestions(updatedQuestions); // Cập nhật danh sách câu hỏi
      message.success("Questions added successfully!");
   };

   const handleFileRead = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
         const binaryStr = e.target.result;
         const workbook = XLSX.read(binaryStr, { type: "binary" });
         const sheetName = workbook.SheetNames[0];
         const worksheet = workbook.Sheets[sheetName];
         const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

         if (rows.length <= 1) {
            message.error("File không có dữ liệu hoặc định dạng không hợp lệ.");
            return;
         }

         const questions = rows.slice(1).map((row, i) => {
            if (row.length < 2) {
               console.warn(`Hàng ${i + 2} không hợp lệ, bỏ qua:`, row);
               message.warning(`Hàng ${i + 2} không hợp lệ, đã bỏ qua.`);
               return null;
            }
            const question_text = row[0];
            const options = row.slice(1, -1);
            const lastColumnValue = row[row.length - 1];
            if (typeof lastColumnValue !== "string") {
               message.error(`Lỗi tại hàng ${i + 2}. Cột cuối cùng phải là một chuỗi.`);
               return null;
            }
            const correct_answers = lastColumnValue.split(",").map((a) => a.trim());

            return {
               question_text,
               question_type: "multiple-choice",
               options,
               correct_answers,
            };
         }).filter(Boolean);

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

   const uploadProps = {
      name: "file",
      multiple: false,
      accept: ".xlsx, .xls",
      beforeUpload: (file) => {
         const isExcel = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
         ].includes(file.type);
         if (!isExcel) {
            message.error("Chỉ được phép upload file Excel (.xlsx hoặc .xls)!");
            return Upload.LIST_IGNORE;
         }
         handleFileRead(file);
         return false;
      },
   };

   const downloadSampleFile = () => {
      const link = document.createElement("a");
      link.href = "/sampleFileForQuestion/sample_questions.xlsx";
      link.download = "sample_questions.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   return (
      <>
         {/* Thanh điều khiển dưới cùng bên phải */}
         <div className="fixed bottom-5 right-5 bg-white p-4 rounded-lg shadow-lg flex space-x-4 border-2">
            <button onClick={openModal} className="flex flex-col items-center">
               <LucideUpload />
               <div className="text-xs">Upload files</div>
            </button>

            <button onClick={openLibraryModal} className="flex flex-col items-center">
               <Folder />
               <div className="text-xs">Library</div>
            </button>

            <button onClick={onAddRandomQuestions} className="flex flex-col items-center">
               <Shuffle />
               <div className="text-xs">Random</div>
            </button>

            <button
               onClick={addNewQuestion}
               className="flex items-center space-x-2 p-2 rounded-lg border text-white bg-violet-700 transition"
            >
               <Plus className="w-5 h-5" />
               <span>Add question</span>
            </button>
         </div>

         {/* Library Modal */}
         <LibraryModal
            isOpen={isLibraryModalOpen}
            onClose={closeLibraryModal}
            onSubmit={handleAddRandomQuestions}
         />

         {/* Modal Upload Excel */}
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
                     <InboxOutlined style={{ fontSize: "32px", color: "#585890" }} />
                  </p>
                  <p className="ant-upload-text">Kéo thả file vào đây hoặc nhấp để chọn file</p>
                  <p className="ant-upload-hint">Chỉ hỗ trợ các file Excel (.xlsx hoặc .xls)</p>
               </Upload.Dragger>
            </div>
         </Modal>

         {/* Hiển thị danh sách câu hỏi */}
         <div className="mt-6">
            {questions.map((question, index) => (
               <QuestionCard key={index} question={question} index={index} />
            ))}
         </div>
      </>
   );
}

export default QuestionAdding;
