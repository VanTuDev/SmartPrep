import React, { useState } from "react";
import { Button, Dropdown, Modal, Space } from "antd";
import { EllipsisVertical } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Thêm import useNavigate

const VideoChatCard = ({ room, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Khởi tạo useNavigate để điều hướng

  const handleDropdownClick = (key) => {
    if (key === "delete") {
      setIsModalOpen(true);
    }
  };

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
      <div className="text-sm text-gray-600 space-y-2">
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
          <Button
            type="primary"
            onClick={() => navigate(`/room/${room.roomName}`)}
          >
            Đi đến lớp học
          </Button>
        </span>

        <Dropdown
          className="mx-3"
          menu={{
            items: dropdownItems.map((item) => ({
              ...item,
              onClick: () => handleDropdownClick(item.key),
            })),
          }}
          trigger={["click"]}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <EllipsisVertical />
            </Space>
          </a>
        </Dropdown>

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
