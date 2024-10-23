import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Key } from 'lucide-react';
import PrimaryButton from 'components/Button/PrimaryButton';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token'); // Lấy token từ URL

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu không khớp!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/resetPW', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Mật khẩu đã được đặt lại thành công!');
        navigate('/login');
      } else {
        toast.error(result.error || 'Lỗi khi đặt lại mật khẩu.');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form className="max-w-md w-full bg-white p-8 rounded-lg shadow-md z-10" onSubmit={handleResetPassword}>
        <div className="text-center">
          <img src="/image/logo.svg" alt="Logo" className="h-24 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-indigo-800 mb-2">Change password</h2>
        </div>

        <div className="space-y-4">
          {/* Nhập mật khẩu mới */}
          <div className="relative">
            <Key className="absolute left-2 top-3 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none"
            />
            <div className="absolute right-2 top-3 cursor-pointer" onClick={handlePasswordToggle}>
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>

          {/* Nhập lại mật khẩu */}
          <div className="relative">
            <Key className="absolute left-2 top-3 text-gray-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none"
            />
            <div className="absolute right-2 top-3 cursor-pointer" onClick={handlePasswordToggle}>
              {showPassword ? <EyeOff /> : <Eye />}
            </div>
          </div>
        </div>

        <div className='my-4 '>
        <PrimaryButton text="Xác Nhận" />
        </div>

        <p className="text-center mt-4">
          <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </form>

      <div className="hidden md:block absolute bottom-8 right-8">
        <img src="/image/Forgot-PW.svg" alt="Illustration" />
      </div>
    </div>
  );
}
