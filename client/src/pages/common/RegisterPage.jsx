import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/Form/InputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { register } from '../../utils/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const result = await register(username, email, password);
            if (result.msg) {
                navigate('/login'); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
            } else {
                setError('Đăng ký thất bại.');
            }
        } catch (error) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-2xl font-bold">Đăng Ký</h2>
            <form onSubmit={handleRegister}>
                <InputField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <InputField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                <InputField label="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                <PrimaryButton text="Đăng Ký" />
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
};

export default RegisterPage;
