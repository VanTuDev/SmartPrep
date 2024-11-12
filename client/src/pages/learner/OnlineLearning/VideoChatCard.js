import React, { useState } from "react";
import { Button, Dropdown, Modal, Space } from "antd";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate

const VideoChatCard = ({ room, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  const handleOk = () => {
    onDelete(room._id);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const dropdownItems = [{ label: "Delete", key: "delete" }];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full">
      <div className="font-semibold text-gray-800 mb-4 text-lg">
        {room.roomTitle || "Untitled Room"}
      </div>
      <div className="text-sm text-gray-600 space-y-2 min-h-[120px]">
        {/* Room Name */}
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
            🏷️
          </span>
          {room.roomName || "N/A"}
        </div>

        {/* Class Information */}
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
            🏫
          </span>
          {room.classId ? room.classId.name : "Class not available"}
        </div>

        {/* Class Description */}
        <div className="flex items-center">
          <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
            📚
          </span>
          {room.classId ? room.classId.description : "No description available"}
        </div>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <span className={`text-sm font-semibold text-gray-500`}>
          {/* Both buttons will now have similar styles */}
          <Button
            type="primary"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => navigate(`/room/${room.roomName}`)}
          >
            Đi đến lớp học
          </Button>
        </span>
        <Modal
          title="Confirm Deletion"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Are you sure you want to delete this room?</p>
        </Modal>
      </div>
    </div>
  );
};

export default VideoChatCard;
