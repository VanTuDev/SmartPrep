import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Đảm bảo kết nối đến đúng URL
const socket = io.connect('http://localhost:5000', {
    auth: { token: localStorage.getItem('token') }
});

const Chatting = ({ classId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    // Tải tin nhắn cũ từ API khi component mount
    const fetchMessages = async () => {
      try {
        // Fetch current user information
        const userResponse = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCurrentUser(userResponse.data);

        // Fetch old messages for the class
        const response = await axios.get(`http://localhost:5000/api/classes/${classId}/messages`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      }
    };

    fetchMessages();

    // Kết nối với phòng chat của lớp qua Socket.IO
    socket.emit('joinClass', { classId });

    // Nhận tin nhắn mới từ server qua WebSocket
    socket.on('chat-message', (data) => {
      setMessages([...messages, data]);
    });
    
    // Ngắt kết nối khi component bị unmount
    return () => socket.off('chat-message');
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    // Emit message to WebSocket server
    socket.emit('message', { classId, message: newMessage });

    // Lưu tin nhắn vào database thông qua API
    try {
      await axios.post(
        `http://localhost:5000/api/classes/${classId}/messages`,
        { message: newMessage },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
    } catch (error) {
      console.error('Error saving message:', error);
    }

    setNewMessage('');
  };

  return (
    <div className="chat-container bg-white" style={{ height: '60vh', padding: '10px' }}>
      <div className="messages" style={{ maxHeight: '50vh', overflowY: 'scroll', marginBottom: '10px' }}>
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender?._id === currentUser?._id;

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                marginBottom: '8px'
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '8px',
                  borderRadius: '8px',
                  backgroundColor: isCurrentUser ? '#DCF8C6' : '#F1F0F0',
                  color: isCurrentUser ? '#333' : '#333',
                  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)'
                }}
              >
                <strong>{msg.sender?.username || 'Unknown'}:</strong> {msg.message}
                <div style={{ fontSize: '0.8rem', color: '#999', textAlign: isCurrentUser ? 'right' : 'left' }}>
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Nhập tin nhắn..."
        style={{ width: '80%', padding: '8px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 15px', borderRadius: '4px', background: '#4CAF50', color: '#fff' }}>
        Gửi
      </button>
    </div>
  );
};

export default Chatting;
