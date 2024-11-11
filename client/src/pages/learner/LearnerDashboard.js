import React, { useState, useEffect } from "react";
import HeaderComponent from "../../components/learner/LearnerHeader";
import CardComponent from "../../components/learner/Card.js";
import { Video } from "lucide-react";
import ViewExamLeaner from "../../pages/learner/ViewExamLeaner";
import axios from "axios";
import VideoChatCard from './OnlineLearning/VideoChatCard';  

const Dashboard = () => {
  const [examCount, setExamCount] = useState(0); // State to store exam count
  const [ongoingRooms, setOngoingRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms based on learner's userId
  const fetchRooms = async () => {
    try {
      const userId = localStorage.getItem("userId"); // Ensure userId is retrieved correctly

      // Fetch rooms for the learner
      const ongoingResponse = await axios.get(
        `http://localhost:5000/api/room/get-room-by-learnerId`, 
        {
          params: { userId: userId }, // Pass userId as a query parameter
          headers: { "Content-Type": "application/json" },
        }
      );

      // Set ongoing rooms to state
      setOngoingRooms(ongoingResponse.data.rooms); // Get the response data
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setLoading(false);
    }
  };

  // Call fetchRooms when the component mounts
  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle deleting a room (define this function as needed)
  const handleDelete = (roomId) => {
    console.log("Delete room with ID:", roomId);
    // Logic for deleting a room goes here
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <HeaderComponent />

      {/* Main Content */}
      <div className="px-8 py-12">
        {/* Lịch học */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-700">Lịch học</h2>
          {ongoingRooms.length > 0 ? (
            <div className="grid grid-cols-6 gap-6">
            {ongoingRooms.map((room) => (
              <VideoChatCard
                key={room._id}
                room={room}
                onDelete={handleDelete}
              />
            ))}
            </div>
          ) : (
            <CardComponent
              icon={<Video className="h-12 w-12 text-indigo-500" />}
              title="Lịch học"
              description="Hiện tại không có lớp học"
            />
          )}
        </div>

        {/* Bài kiểm tra */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-700">Bài kiểm tra</h2>
          <ViewExamLeaner onFetchExamCount={(count) => setExamCount(count)} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
