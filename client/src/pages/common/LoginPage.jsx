import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/Form/InputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { login } from '../../utils/api';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const result = await login(username, password);
            if (result.token) {
                localStorage.setItem('token', result.token); // Lưu token vào localStorage
                navigate('/learner/dashboard'); // Điều hướng đến trang LearnerDashboard sau khi đăng nhập
            } else {
                setError('Đăng nhập thất bại.');
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-2xl font-bold">Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
                <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <InputField label="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                <PrimaryButton text="Đăng Nhập" />
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default LoginPage;
