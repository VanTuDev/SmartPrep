import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/Form/InputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { Mail, Key } from 'lucide-react';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Dùng cho cả email hoặc username
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Đăng nhập thành công!');
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.user._id);

        if (result.user.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/learner/dashboard');
        }
      } else {
        toast.error(result.error || 'Đăng nhập thất bại.');
        setError(result.error || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };




  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-9 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/image/logo.svg" alt="Logo" className="h-24" />
        </div>
        <h2 className="text-2xl font-medium text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="flex my-6 h-3/5 items-center w-full gap-0">
            <Mail color="#737373" strokeWidth={1.5} className="mr-2" />
            <InputField
              label=""
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email hoặc Tên đăng nhập"
              className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex my-6 h-3/5 items-center w-full">
            <Key color="#737373" strokeWidth={1.5} className="mr-2" />
            <InputField
              label=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mật khẩu"
            />
          </div>
          <div className='flex justify-end my-5 text-center'>
            <a className=' text-indigo-600' href='/forgot-password'>Quên mật khẩu ?</a>
          </div>
          <div className="flex justify-center items-center h-full">
            <PrimaryButton text="Đăng Nhập" />
          </div>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <p className="text-center mt-4">
            Chưa có tài khoản? <a href="/register" className="text-indigo-600">Đăng ký</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;