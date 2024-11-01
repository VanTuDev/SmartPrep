import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LearnerHeader from '../learner/LearnerHeader';

const LearnerProfile = () => {
  const [userInfo, setUserInfo] = useState(null); // Trạng thái để lưu thông tin người dùng
  const [editedInfo, setEditedInfo] = useState({}); // Trạng thái để lưu thông tin đã chỉnh sửa
  const [editMode, setEditMode] = useState(false); // Trạng thái để bật tắt chế độ chỉnh sửa
  const [selectedImage, setSelectedImage] = useState(null); // Trạng thái để lưu hình ảnh được chọn
  const [success, setSuccess] = useState(''); // Trạng thái thông báo thành công
  const [error, setError] = useState(''); // Trạng thái thông báo lỗi
  const navigate = useNavigate(); // Hook điều hướng

  // Lấy thông tin người dùng khi component được render
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    try {
      if (!token) {
        setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        setError(`Lỗi khi lấy thông tin người dùng: ${errorResponse.error || 'Không xác định'}`);
        return;
      }

      const data = await response.json();
      setUserInfo(data); // Lưu dữ liệu người dùng vào state
      setEditedInfo(data); // Cập nhật state đã chỉnh sửa
    } catch (err) {
      setError('Có lỗi xảy ra trong quá trình lấy thông tin.');
    }
  };

  // Cập nhật thông tin người dùng
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const formData = new FormData();
      formData.append('username', editedInfo.username);
      formData.append('fullname', editedInfo.fullname);
      formData.append('email', editedInfo.email);
      formData.append('phone', editedInfo.phone);
      formData.append('role', editedInfo.role);

      if (selectedImage) {
        formData.append('profile', selectedImage);
      }

      const response = await fetch('http://localhost:5000/api/users/updateuser', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const responseData = await response.json();
        setError(`Lỗi khi cập nhật thông tin: ${responseData.error || 'Không xác định'}`);
        return;
      }

      const updatedData = await response.json();
      setUserInfo(updatedData);
      setEditMode(false);
      setSelectedImage(null); // Reset hình ảnh sau khi cập nhật thành công
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError('Có lỗi xảy ra trong quá trình cập nhật.');
    }
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    setEditedInfo({
      ...editedInfo,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý thay đổi ảnh đại diện
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Gọi API lấy thông tin người dùng khi component được render lần đầu
  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="">
      <LearnerHeader></LearnerHeader>
      <div className="container mx-auto p-6">
        {/* Thông báo lỗi và thành công */}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <div className="bg-white shadow-md rounded-lg p-6">


          {/* Hiển thị thông tin người dùng */}
          {userInfo ? (
            <>
              <div className="flex items-center space-x-6 mb-6">
                {/* Hiển thị và cập nhật ảnh đại diện */}
                <div className="flex flex-col items-center">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : userInfo?.profile
                          ? `http://localhost:5000/uploads/${userInfo.profile}`
                          : "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="rounded-full w-32 h-32 mb-4"
                  />
                  {editMode && (
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="text-sm text-gray-500"
                    />
                  )}
                  <h2 className="text-xl font-semibold mt-4">{userInfo.fullname || 'Tên người dùng'}</h2>
                  <p className="text-gray-500">ID: {userInfo?._id || '---'}</p>
                </div>

                {/* Các trường thông tin khác */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Thông tin</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-700">Tên đăng nhập</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="username"
                          value={editedInfo.username || ''}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        />
                      ) : (
                        <p className="p-2">{userInfo.username}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Email</label>
                      {editMode ? (
                        <input
                          type="email"
                          name="email"
                          value={editedInfo.email || ''}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        />
                      ) : (
                        <p className="p-2">{userInfo.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Số điện thoại</label>
                      {editMode ? (
                        <input
                          type="text"
                          name="phone"
                          value={editedInfo.phone || ''}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        />
                      ) : (
                        <p className="p-2">{userInfo.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700">Vai trò</label>
                      {editMode ? (
                        <select
                          name="role"
                          value={editedInfo.role || ''}
                          onChange={handleChange}
                          className="border rounded p-2 w-full"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="instructor">Instructor</option>
                        </select>
                      ) : (
                        <p className="p-2">{userInfo.role}</p>
                      )}
                    </div>
                  </div>
                  {/* Nút Lưu và Hủy */}
                  {editMode ? (
                    <div className="flex justify-end space-x-4">
                      <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Lưu
                      </button>
                      <button onClick={() => setEditMode(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEditMode(true)} className="bg-green-500 text-white px-4 py-2 rounded">
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnerProfile;
