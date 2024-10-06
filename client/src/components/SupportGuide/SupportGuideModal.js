import React, { useState } from 'react';
import Modal from 'react-modal';

// Cấu hình modal cho Tailwind
Modal.setAppElement('#root');

const UserGuideModal = ({ isOpen, onRequestClose }) => {
  // Danh sách video URLs
  const videos = [
    { id: 1, title: 'Thumb1', videoId: '4Q2LT8X2cM8' },
    { id: 2, title: 'Thumb2', videoId: 'qRuSS93OEfw' },
    { id: 3, title: 'Thumb3', videoId: 'w28YjHjafy0' },
    { id: 4, title: 'Thumb4', videoId: '4Q2LT8X2cM8' },
    { id: 5, title: 'Thumb5', videoId: 'qRuSS93OEfw' },
    { id: 6, title: 'Thumb6', videoId: 'w28YjHjafy0' },
    { id: 7, title: 'Thumb7', videoId: '4Q2LT8X2cM8' },
    { id: 8, title: 'Thumb8', videoId: 'qRuSS93OEfw' },
    { id: 9, title: 'Thumb9', videoId: 'w28YjHjafy0' },
  ];

  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center w-full h-full"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
    >
      <div className="bg-white rounded-lg w-[80%] h-[85%] flex">
        {/* Cột bên trái: Support */}
        <div className="w-1/4 p-6 border-r border-gray-300">
          <h2 className="text-xl font-bold mb-4">Support</h2>
          <p className="text-sm text-gray-700 mb-4">From Monday to Friday, 9:00 AM - 6:00 PM</p>
          <div className="flex items-center gap-2 mb-6">
            <span className="text-blue-500 text-2xl">📞</span>
            <span className="text-lg font-bold">08 6868 5247</span>
          </div>
          {/* QR Code */}
          <div className="flex justify-center">
            <img src="/path/to/qr_code_image.png" alt="Zalo QR Code" className="w-40 h-40 object-contain" />
          </div>
        </div>

        {/* Cột bên phải: User Guide Videos */}
        <div className="w-3/4 p-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold mb-4">User Guide</h2>
            <button
              onClick={onRequestClose}
              className="text-gray-500 hover:text-gray-700 text-xl transition duration-300"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mb-6">Hi! Let's get started with Ninequiz through some simple instructional videos!</p>

          {/* Video Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => setSelectedVideo(video.videoId)} // Sử dụng videoId để xác định video
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition duration-300"
              >
                {/* Thumbnail Image */}
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`} // Sử dụng `videoId` để tạo thumbnail URL
                  alt={`Thumbnail for ${video.title}`}
                  className="w-full h-58 object-cover"
                />
                {/* Video Title */}
                <div className="p-4 text-center">
                  <p className="text-sm font-semibold text-gray-800">{video.title}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hiển thị trình phát video khi có video được chọn */}
          {selectedVideo && (
            <div
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setSelectedVideo(null)} // Đóng trình phát video khi click bên ngoài
            >
              <div className="relative" onClick={(e) => e.stopPropagation()}> {/* Ngăn click thoát ra khi click vào iframe */}
                <iframe
                  width="1024"
                  height="576"
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                  className="rounded-lg shadow-md"
                ></iframe>
                {/* Nút đóng trong khung video */}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UserGuideModal;
