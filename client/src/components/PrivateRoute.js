import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
   const isAuthenticated = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage

   return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
