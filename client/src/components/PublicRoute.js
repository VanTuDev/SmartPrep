import {jwtDecode} from 'jwt-decode'; // Lưu ý không destructure, chỉ import default
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Kiểm tra token

  // Nếu không có token, render trang công khai
  if (!token) return children;

  try {
    const userInfo = jwtDecode(token); // Decode token
    const role = userInfo.role;

    // Điều hướng đến dashboard tương ứng với role
    return <Navigate to={`/${role}/dashboard`} />;
  } catch (error) {
    console.error('Invalid token:', error); // Ghi log nếu có lỗi
    localStorage.removeItem('token'); // Xóa token lỗi
    return children; // Render trang công khai nếu token không hợp lệ
  }
};

export default PublicRoute;
