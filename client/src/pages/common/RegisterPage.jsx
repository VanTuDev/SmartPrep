import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleUserRound, Mail, PhoneCall, Key, Eye, EyeOff, UserRoundSearch } from 'lucide-react';

const RegisterPage = () => {
   const [username, setUserName] = useState('');
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [agreeTerms, setAgreeTerms] = useState(false);

   const [errors, setErrors] = useState({}); // State để lưu các lỗi cho từng ô input

   const navigate = useNavigate();

   const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   };

   const validatePhoneNumber = (phone) => {
      const phoneRegex = /^0\d{9}$/;
      return phoneRegex.test(phone);
   };

   const validateUsername = (username) => {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      return usernameRegex.test(username);
   };

   const handleRegister = async (e) => {
      e.preventDefault();

      let validationErrors = {};

      // Kiểm tra nếu bất kỳ trường nào bị bỏ trống
      if (!username) validationErrors.username = 'Tài khoản không được để trống';
      if (!fullName) validationErrors.fullname = 'Họ và tên không được để trống';
      if (!email) validationErrors.email = 'Email không được để trống';
      if (!phoneNumber) validationErrors.phoneNumber = 'Số điện thoại không được để trống';
      if (!password) validationErrors.password = 'Mật khẩu không được để trống';

      // Kiểm tra định dạng email
      if (email && !validateEmail(email)) {
         validationErrors.email = 'Email không hợp lệ';
      }

      // Kiểm tra số điện thoại
      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
         validationErrors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng số "0"';
      }

      // Kiểm tra mật khẩu
      if (password.length < 8 || password.length > 32) {
         validationErrors.password = 'Mật khẩu phải từ 8 đến 32 ký tự';
      }

      // Kiểm tra username có ký tự đặc biệt hay không
      if (username && !validateUsername(username)) {
         validationErrors.username = 'Username không được chứa ký tự đặc biệt';
      }

      // Kiểm tra điều khoản sử dụng
      if (!agreeTerms) {
         validationErrors.agreeTerms = 'Bạn phải đồng ý với các điều khoản sử dụng và bảo mật';
      }

      // Nếu có lỗi, cập nhật state và không gửi form
      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return;
      }

      try {
         const response = await fetch('http://localhost:8080/api/register', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username,
               fullname: fullName,
               email,
               phone: phoneNumber,
               password,
               profile: ''
            }),
         });

         const result = await response.json();

         if (response.ok) {
            navigate('/login');
         } else {
            setErrors({ server: result.error || 'Đăng ký thất bại' });
         }
      } catch (error) {
         setErrors({ server: 'Có lỗi xảy ra, vui lòng thử lại' });
      }
   };

   const toggleShowPassword = () => {
      setShowPassword(!showPassword);
   };

   return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
         <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-xl text-center mb-6">Đăng ký thành viên</h2>

            <form onSubmit={handleRegister}>
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
                  {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

                  <div className="flex gap-4 items-center w-full">
                     <div className="py-1">
                        <CircleUserRound size={28} color="#707070" strokeWidth={1.5} />
                     </div>
                     <input
                        className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                     />
                  </div>
                  {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname}</p>}

                  <div className="flex py-2 gap-4 items-center w-full">
                     <div className="py-1">
                        <Mail color="#707070" strokeWidth={2} />
                     </div>
                     <input
                        className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
                        type="email"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                  <div className="flex py-2 gap-4 items-center w-full">
                     <div className="py-1">
                        <PhoneCall color="#707070" strokeWidth={2} />
                     </div>
                     <input
                        className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
                        type="text"
                        placeholder="Nhập số điện thoại"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                     />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}

                  <div className="flex py-2 gap-4 items-center w-full relative">
                     <div className="py-1">
                        <Key color="#707070" strokeWidth={1.5} />
                     </div>
                     <input
                        className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                     />
                     <div className="absolute right-2 cursor-pointer" onClick={toggleShowPassword}>
                        {showPassword ? <EyeOff size={20} color="#707070" /> : <Eye size={20} color="#707070" />}
                     </div>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                  <div className="flex items-center my-4">
                     <input
                        type="checkbox"
                        id="terms"
                        className="mr-2"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                     />
                     <label htmlFor="terms" className="text-gray-600 text-sm">
                        Tôi đồng ý với các <a href="#" className="text-indigo-600">điều khoản sử dụng</a> và <a href="#" className="text-indigo-600">điều khoản bảo mật</a>
                     </label>
                  </div>
                  {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

                  {errors.server && <p className="text-red-500 text-sm">{errors.server}</p>}

                  <button
                     type="submit"
                     className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200"
                  >
                     Đăng Ký
                  </button>
               </div>
            </form>

            <p className="text-center mt-4">
               Đã có tài khoản? <a href="/login" className="text-indigo-600">Đăng nhập</a>
            </p>
         </div>
      </div>
   );
};

export default RegisterPage;
