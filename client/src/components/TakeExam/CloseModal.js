import React from 'react';
import { Modal } from 'antd';

const CloseModal = ({ visible, onConfirm, onCancel }) => {
   return (
      <Modal
         title="Xác nhận thoát bài thi"
         visible={visible}
         onOk={onConfirm}
         onCancel={onCancel}
         okText="Thoát"
         cancelText="Hủy"
      >
         <p>Bạn có chắc chắn muốn thoát khỏi bài thi này không? Nếu bạn thoát, tiến trình làm bài sẽ không được lưu lại.</p>
      </Modal>
   );
};

export default CloseModal;