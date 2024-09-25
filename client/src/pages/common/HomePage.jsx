import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="container mx-auto my-8">
            <h1 className="text-4xl font-bold">Chào mừng đến với Hệ thống Thi Trực tuyến</h1>
            <p className="mt-4">Vui lòng đăng nhập hoặc đăng ký để bắt đầu.</p>
            <div className="mt-8">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded mr-4">Đăng Nhập</Link>
                <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded">Đăng Ký</Link>
            </div>
        </div>
    );
};

export default HomePage;
