import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import { CircleUserRound, Mail, PhoneCall, Key, Eye, EyeOff, UserRoundSearch } from 'lucide-react';

const RegisterPage = () => {
   const [username, setUserName] = useState('');
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [password, setPassword] = useState('');
   const [showPassword, setShowPassword] = useState(false);
   const [agreeTerms, setAgreeTerms] = useState(false);
   const [role, setRole] = useState('learner'); 
   const [cv, setCv] = useState(null); 
   const [errors, setErrors] = useState({}); 
   const navigate = useNavigate();

   // Kiểm tra định dạng email hợp lệ
   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

   // Kiểm tra số điện thoại hợp lệ
   const validatePhoneNumber = (phone) => /^0\d{9}$/.test(phone);

   // Kiểm tra username không chứa ký tự đặc biệt
   const validateUsername = (username) => /^[a-zA-Z0-9_]+$/.test(username);

   // Xử lý khi chọn file PDF
   const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
         setCv(file);
      } else {
         toast.error('Chỉ chấp nhận file PDF');
         setCv(null);
      }
   };

   // Mở/đóng mật khẩu
   const toggleShowPassword = () => setShowPassword(!showPassword);

   // Xử lý form đăng ký
   const handleRegister = async (e) => {
      e.preventDefault();
      let validationErrors = {};

      if (!username) validationErrors.username = 'Tài khoản không được để trống';
      if (!fullName) validationErrors.fullname = 'Họ và tên không được để trống';
      if (!email) validationErrors.email = 'Email không được để trống';
      if (!phoneNumber) validationErrors.phoneNumber = 'Số điện thoại không được để trống';
      if (!password) validationErrors.password = 'Mật khẩu không được để trống';
      if (email && !validateEmail(email)) validationErrors.email = 'Email không hợp lệ';
      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
         validationErrors.phoneNumber = 'Số điện thoại phải có 10 số và bắt đầu bằng "0"';
      }
      if (password.length < 8 || password.length > 32) {
         validationErrors.password = 'Mật khẩu phải từ 8 đến 32 ký tự';
      }
      if (username && !validateUsername(username)) {
         validationErrors.username = 'Username không được chứa ký tự đặc biệt';
      }
      if (!agreeTerms) {
         validationErrors.agreeTerms = 'Bạn phải đồng ý với các điều khoản sử dụng và bảo mật';
      }
      if (role === 'instructor' && !cv) {
         validationErrors.pdfFile = 'Vui lòng tải lên file PDF';
      }

      if (Object.keys(validationErrors).length > 0) {
         setErrors(validationErrors);
         return;
      }

      try {
         const formData = new FormData();
         formData.append('username', username);
         formData.append('fullname', fullName);
         formData.append('email', email);
         formData.append('phone', phoneNumber);
         formData.append('password', password);
         formData.append('role', role);
         if (cv) {
            formData.append('cv', cv);
         }

         const response = await fetch('http://localhost:5000/api/users/register', {
            method: 'POST',
            body: formData,
         });

         const result = await response.json();

         if (response.ok) {
            toast.success('Đăng ký thành công! Check hòm thư của bạn để hoàn tất đăng kí');
            navigate('/login');
         } else {
            toast.error(result.error || 'Đăng ký thất bại');
         }
      } catch (error) {
         toast.error('Có lỗi xảy ra, vui lòng thử lại');
      }
   };
   

   return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
         <div className="bg-white p-9 rounded-lg shadow-md w-full max-w-md">
            <div className="flex justify-center mb-6">
               <img
                  src="/image/logo.svg"
                  alt="Logo"
                  className="h-24"
               />
            </div>
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
                        className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
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
                        className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
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
                        className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
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
                  <div className="flex items-center my-2 w-full">
                     <label className="mr-2 text-gray-700">Chọn vai trò:</label>
                     <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg shadow-sm"
                     >
                        <option value="learner">Learner</option>
                        <option value="instructor">Instructor</option>
                     </select>
                  </div>
                   {/* Phần upload file PDF nếu role là instructor */}
                  {role === 'instructor' && (
                  <div className="my-4">
                     <label className="block text-gray-700 mb-2">Tải lên chứng chỉ (PDF):</label>
                     <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full border border-gray-300 p-2 rounded"
                     />
                     {errors.pdfFile && <p className="text-red-500 text-sm">{errors.pdfFile}</p>}
                  </div>
               )}

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
                     className="w-full bg-gray-300 text-white py-3 rounded hover:bg-indigo-700 transition duration-200"
                  >
                     Đăng Ký
                  </button>
               </div>
               <div className="flex justify-center items-center my-4">
                  <span className="text-gray-500">Hoặc</span>
               </div>

               
            </form>

            <p className="text-center mt-4">
               Đã có tài khoản? <a href="/login" className="text-indigo-900 text-xl font-bold">Đăng nhập</a>
            </p>
         </div>
      </div>
   );
};

export default RegisterPage;
