import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, Bell, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Sửa lại import statement
import { Dropdown, Menu as AntdMenu } from 'antd';
import VideoModal from '../../components/SupportGuide/SupportGuideModal';
const LearnerHeader = () => {
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [username, setUsername] = useState('');
   const navigate = useNavigate();

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };
   const handleLogout = () => {
      localStorage.removeItem('token'); // Xóa token khỏi localStorage
      navigate('/login'); // Điều hướng về trang đăng nhập
   };
   // Dropdown menu cho biểu tượng User
   const userMenu = (
      <AntdMenu>
         <AntdMenu.Item key="profile" onClick={() => navigate('/learner/profile')}>
            Hồ sơ cá nhân
         </AntdMenu.Item>
         <AntdMenu.Item key="logout" onClick={handleLogout}>
            Đăng xuất
         </AntdMenu.Item>
      </AntdMenu>
   );
   // Load user's username from the token when the component mounts
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         try {
            const decodedToken = jwtDecode(token); // Decode the token
            setUsername(decodedToken.username || 'Người dùng');
         } catch (error) {
            console.error("Error decoding token: ", error);
            setUsername('Người dùng');
         }
      }
   }, []);

   // Điều hướng đến LearnerProfile khi nhấn vào biểu tượng người dùng
   const handleNavigateToProfile = () => {
      navigate('/learner/profile'); // Đảm bảo đúng đường dẫn đến trang LearnerProfile
   };

   return (
      <header className="bg-white shadow-md px-6 py-2 flex items-center justify-between">
         {/* Logo and system name */}
         <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/image/logo.svg" alt="Logo" className="h-20 mr-2" />
            <span className="text-lg font-semibold text-gray-800">Smart Dev</span>
         </div>

         {/* Navigation Menu */}
         <nav className="flex space-x-8">
            <NavLink to="/learner/dashboard" className="text-gray-600 hover:text-purple-700">
               Bản tin
            </NavLink>
            <NavLink to="/learner/exam/history" className="text-gray-600 hover:text-purple-700">
               Lịch sử làm bài
            </NavLink>
            <NavLink
               to="/learner/dashboard/class"
               className={({ isActive }) =>
                  isActive ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
               }
            >
               Lớp
            </NavLink>
         </nav>

         {/* User icons and information */}
         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
               <div className="flex flex-col items-center">
                  <NavLink to="/menu">
                     <Menu className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
                  </NavLink>
                  <span className="text-sm text-gray-600">Menu</span>
               </div>

               <div className="flex flex-col items-center" onClick={() => setModalIsOpen(true)}>
                  <HelpCircle className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
                  <span className="text-sm text-gray-600">Hỗ trợ</span>
               </div>
               <VideoModal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setModalIsOpen(false)}
               />

               <div className="flex flex-col items-center">
                  <NavLink to="/notifications">
                     <Bell className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
                  </NavLink>
                  <span className="text-sm text-gray-600">Thông báo</span>
               </div>

               {/* User Dropdown Menu */}
               <Dropdown overlay={userMenu} trigger={['click']}>
                  <div className="flex items-center space-x-2 cursor-pointer">
                     <User className="rounded-full h-10 w-10 bg-gray-200 text-gray-500 hover:text-gray-700 transition duration-200" />
                     <span className="text-gray-700 font-medium">{username || 'Người dùng'}</span>
                  </div>
               </Dropdown>
            </div>
         </div>
      </header>
   );
};

export default LearnerHeader;
