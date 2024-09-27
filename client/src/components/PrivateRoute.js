import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
   const isAuthenticated = localStorage.getItem('token'); // Assuming token is stored in localStorage

   return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
