import React, { useState, useEffect } from 'react';
import VideoChatCard from './VideoChatCard';
import axios from 'axios';
import { Button, Modal, Dropdown, Menu, message } from 'antd';  // Thêm Modal và các thành phần cần thiết

export default function VideoChatDashboard() {
  const [ongoingRooms, setOngoingRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);  // Để mở/đóng modal
  const [selectedClass, setSelectedClass] = useState(null); // Lưu lớp học được chọn
  const [roomTitle, setRoomTitle] = useState(''); // Lưu tiêu đề phòng học
  const [classes, setClasses] = useState([]); // Lưu danh sách lớp học

  const authorId = localStorage.getItem('userId');

  // Fetch ongoing rooms when the component mounts
  const fetchRooms = async () => {
    try {
      const ongoingResponse = await axios.get(
        `http://localhost:5000/api/room/get-room-by-author`,
        { 
          params: { author: authorId },  // Truyền authorId qua params trong URL
          headers: { 'Content-Type': 'application/json' }
        }
      );

      setOngoingRooms(ongoingResponse.data.rooms); // Get the response data
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/classrooms/instructor/classes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
        setClasses(response.data.classes);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchRooms();
    fetchClasses();
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle deleting a room
  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`http://localhost:5000/api/room/delete/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOngoingRooms(ongoingRooms.filter(room => room._id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  // Handle creating a room
  const handleCreateRoom = async () => {
    if (!selectedClass) {
      message.error("Please select a class first.");
      return;
    }

    if (!roomTitle) {
      message.error("Room Title is required!");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/room/create-room', {
        roomTitle,
        author: authorId,
        classId: selectedClass._id,
      });

      if (response.data.message === 'Room created successfully') {
        message.success("Room created successfully!");
        // Fetch updated room list after creation
        fetchRooms();  // Call fetchRooms here with updated rooms
        setIsModalOpen(false);  // Close the modal after room is created
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  // Handle selecting a class from the dropdown
  const handleClassSelect = (classId) => {
    const selected = classes.find(cls => cls._id === classId);
    setSelectedClass(selected);
  };

  const classMenu = (
    <Menu>
      {classes.map(cls => (
        <Menu.Item key={cls._id} onClick={() => handleClassSelect(cls._id)}>
          {cls.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="w-full flex justify-center items-start mt-0">
      <div className="w-10/12">
        {/* Button to open the modal */}
        <div className="flex justify-end mb-6">
          <Button
            className="bg-violet-800 text-white px-4 py-1.5 rounded-md flex items-center space-x-2 hover:bg-violet-950 transition"
            onClick={() => setIsModalOpen(true)}  // Open the modal when button is clicked
          >
            <span>Tạo Lớp học</span>
            <span className="ml-1">+</span>
          </Button>
        </div>

        {/* Ongoing Rooms Section */}
        <div>
          <h1 className="text-xl font-semibold text-gray-700">Ongoing Rooms</h1>
          <div className="border-b border-gray-300 my-4"></div>
          {ongoingRooms.length > 0 ? (
            <div className="grid grid-cols-4 gap-6">
              {ongoingRooms.map((room) => (
                <VideoChatCard
                  key={room._id}
                  room={room}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center mt-12">
              <img src="/image/noRoom.png" alt="No Rooms" className="h-40 mb-6" />
              <p className="text-gray-300 text-lg">Currently, no rooms are ongoing</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal to create a room */}
      <Modal
        title="Create Room"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="mb-4">
          <label htmlFor="roomTitle" className="block text-sm font-semibold text-gray-700">Room Title</label>
          <input
            type="text"
            id="roomTitle"
            value={roomTitle}
            onChange={(e) => setRoomTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full mt-2"
            placeholder="Enter Room Title"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="classSelect" className="block text-sm font-semibold text-gray-700">Select Class</label>
          <Dropdown overlay={classMenu}>
            <Button className="w-full mt-2">
              {selectedClass ? selectedClass.name : 'Select Class'}
            </Button>
          </Dropdown>
        </div>

        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full"
          onClick={handleCreateRoom}  // Call handleCreateRoom when the button is clicked
        >
          Create Room
        </Button>
      </Modal>
    </div>
  );
}
