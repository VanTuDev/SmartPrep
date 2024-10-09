import React from "react";
import { Modal, Button } from "antd";


const SubmitModal = ({ visible, onConfirm, onCancel, examTitle, totalQuestions, answeredQuestions }) => {
   return (
      <Modal
         title={examTitle}
         visible={visible}
         onOk={onConfirm}
         onCancel={onCancel}
         footer={[
            <Button key="cancel" onClick={onCancel}>
               Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={onConfirm}>
               Xác nhận nộp bài
            </Button>,
         ]}
      >
         <p>Bạn đã làm {answeredQuestions}/{totalQuestions} câu</p>
         <ul>
            <li>Sau khi xác nhận, hệ thống sẽ lưu kết quả cuối cùng bạn đã làm</li>
            <li>Bạn sẽ không thể tiếp tục làm bài trắc nghiệm này hoặc chỉnh sửa bài đã nộp</li>
         </ul>
      </Modal>
   );
};

export default SubmitModal;