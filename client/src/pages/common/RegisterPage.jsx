import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUserRound, Mail, PhoneCall, Key, Eye, EyeOff, UserRoundSearch } from 'lucide-react';

const RegisterPage = () => {
   const [username, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State để điều khiển hiển thị mật khẩu
  const [error, setError] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false); // State để lưu trạng thái đồng ý điều khoản
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Bạn phải đồng ý với các điều khoản sử dụng và điều khoản bảo mật.');
      return;
    }
    try {
      // API call để đăng ký tài khoản
      const result = await fakeRegister(username,fullName, email, phoneNumber, password);
      if (result.success) {
        navigate('/login'); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
      } else {
        setError('Đăng ký thất bại.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // Hàm fake API để đăng ký (cần thay thế bằng API thật)
  const fakeRegister = (fullName, email, phoneNumber, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Thay đổi giữa hiện và ẩn mật khẩu
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl text-center mb-6">Đăng ký thành viên</h2>

        <div className="flex flex-col my-6 h-3/5 w-full">
           <div className="flex gap-4 items-center w-full">
            <div className="py-1">
             <UserRoundSearch color="#737373" strokeWidth={1.5} />
            </div>
            <input
              className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
              type="text"
              placeholder="Tạo tài khoản đăng nhập"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex gap-4 items-center w-full">
            <div className="py-1">
              <CircleUserRound size={28} color="#707070" strokeWidth={1.5} absoluteStrokeWidth />
            </div>
            <input
              className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
              type="text"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="flex py-2 gap-4 items-center w-full">
            <div className="py-1">
              <Mail color="#707070" strokeWidth={2} absoluteStrokeWidth />
            </div>
            <input
              className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex py-2 gap-4 items-center w-full">
            <div className="py-1">
              <PhoneCall color="#707070" strokeWidth={2} absoluteStrokeWidth />
            </div>
            <input
              className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
              type="text"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="flex py-2 gap-4 items-center w-full relative">
            <div className="py-1">
              <Key color="#707070" strokeWidth={1.5} absoluteStrokeWidth />
            </div>
            <input
              className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
              type={showPassword ? "text" : "password"} // Thay đổi type giữa text và password
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="absolute right-2 cursor-pointer" onClick={toggleShowPassword}>
              {showPassword ? <EyeOff size={20} color="#707070" /> : <Eye size={20} color="#707070" />}
            </div>
          </div>

          {/* Điều khoản sử dụng */}
          <div className="flex items-center my-4">
            <input
              type="checkbox"
              id="terms"
              className="mr-2"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms" className="text-gray-600 text-sm">
              Tôi đồng ý với các <a href="#" className="text-indigo-600">điều khoản sử dụng</a> và <a href="#" className="text-indigo-600">điều khoản bảo mật</a> của Ninequiz
            </label>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        

        <button
          type="submit"
          onClick={handleRegister}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
        >
          Đăng Ký
        </button>
<div className="flex justify-center items-center my-4">
          <span className="text-gray-500">Hoặc</span>
        </div>
        <button className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-100 flex justify-center items-center mt-4">
          <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google Icon" className="w-6 h-6 mr-2" />
          Đăng ký với Google
        </button>

        <p className="text-center mt-4">
          Đã có tài khoản? <a href="/login" className="text-indigo-600">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
