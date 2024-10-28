import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LearnerProfile() {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Hàm lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        navigate('/login');
        return;
      }

      const data = await response.json();
      setUserInfo(data);
      setEditedInfo(data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Hàm xử lý cập nhật thông tin người dùng
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("Không có token. Không thể cập nhật thông tin.");
      return;
    }

    try {
      const formData = new FormData();
      Object.keys(editedInfo).forEach((key) => {
        formData.append(key, editedInfo[key]);
      });

      if (selectedImage) formData.append('profile', selectedImage); // Thêm ảnh vào form data nếu có

      // Kiểm tra lại dữ liệu đang được gửi đi
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await fetch('http://localhost:5000/api/users/updateuser', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Lỗi khi cập nhật thông tin:", response.statusText);
        return;
      }

      const updatedData = await response.json();
      setUserInfo(updatedData);
      setEditMode(false);
      console.log("Cập nhật thành công:", updatedData);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  if (!userInfo) {
    return <div>Đang tải thông tin người dùng...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Thông tin người dùng</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-6">
          <div className="w-32 h-32">
          <img
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage)
                : userInfo.profile?.startsWith('http')
                  ? userInfo.profile // Use the profile URL directly if it's a full URL
                  : userInfo.profile
                    ? `http://localhost:5000/uploads/${userInfo.profile}` // Use backend path otherwise
                    : "https://via.placeholder.com/150" // Placeholder image if no profile available
            }
            alt="Profile"
            className="w-full h-full object-cover rounded-full shadow-md"
          />
          </div>
          {editMode && (
            <div className="ml-4">
              <input type="file" onChange={handleImageChange} className="text-sm text-gray-500" />
            </div>
          )}
        </div>

        {editMode ? (
          <>
            <div className="grid gap-4 grid-cols-2">
              <div>
                <label className="font-bold">Full Name:</label>
                <input
                  type="text"
                  name="fullname"
                  value={editedInfo.fullname}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="font-bold">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={editedInfo.phone}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="font-bold">Birthday:</label>
                <input
                  type="date"
                  name="birthday"
                  value={editedInfo.birthday}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
              <div>
                <label className="font-bold">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={editedInfo.address}
                  onChange={handleChange}
                  className="border rounded p-2 w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                Lưu
              </button>
              <button onClick={toggleEditMode} className="bg-gray-500 text-white px-4 py-2 rounded">
                Hủy
              </button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Username:</strong> {userInfo.username}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Full Name:</strong> {userInfo.fullname}</p>
            <p><strong>Phone:</strong> {userInfo.phone || 'Chưa cập nhật'}</p>
            <p><strong>Birthday:</strong> {userInfo.birthday || 'Chưa cập nhật'}</p>
            <p><strong>Address:</strong> {userInfo.address || 'Chưa cập nhật'}</p>
            <button onClick={toggleEditMode} className="bg-green-500 text-white px-4 py-2 rounded mt-4">
              Chỉnh sửa
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default LearnerProfile;
