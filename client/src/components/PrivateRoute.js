import React from 'react';
import { Navigate } from 'react-router-dom';

// Tạo PrivateRoute để kiểm tra trạng thái đăng nhập
const PrivateRoute = ({ children }) => {
   const token = localStorage.getItem('token'); // Kiểm tra xem token đã tồn tại chưa
   return token ? children : <Navigate to="/login" />; // Chuyển hướng về trang login nếu chưa có token
};

export default PrivateRoute;
