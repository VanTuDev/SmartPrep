import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, Bell, User } from 'lucide-react';
import { Dropdown, Menu as AntdMenu } from 'antd';
import { jwtDecode } from 'jwt-decode';
import VideoModal from '../../components/SupportGuide/SupportGuideModal';

const InstructorHeader = () => {
   const [username, setUsername] = useState('');
   const navigate = useNavigate();
   const [modalIsOpen, setModalIsOpen] = useState(false);
   // Load user's username from the token when the component mounts
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         try {
            const decodedToken = jwtDecode(token);
            setUsername(decodedToken.username || 'Người dùng');
         } catch (error) {
            console.error("Error decoding token: ", error);
            setUsername('Người dùng');
         }
      }
   }, []);

   // Xử lý khi nhấn "Đăng xuất"
   const handleLogout = () => {
      localStorage.removeItem('token'); // Xóa token khỏi localStorage
      navigate('/login'); // Điều hướng về trang đăng nhập
   };

   // Dropdown menu cho biểu tượng User
   const userMenu = (
      <AntdMenu>
         <AntdMenu.Item key="profile" onClick={() => navigate('/instructor/profile')}>
            Hồ sơ cá nhân
         </AntdMenu.Item>
         <AntdMenu.Item key="logout" onClick={handleLogout}>
            Đăng xuất
         </AntdMenu.Item>
      </AntdMenu>
   );

   return (
      <header className="bg-white shadow-md px-6 py-2 flex items-center justify-between">
         {/* Logo and system name */}
         <div className="flex items-center space-x-2">
            <NavLink to="/" className="flex items-center text-xl font-bold text-purple-700">
               <img src="/image/logo.svg" alt="Logo" className="h-20 mr-2" />
            </NavLink>
            <span className="text-lg font-semibold text-gray-800">Smart Dev</span>
         </div>

         {/* Navigation Menu */}
         <nav className="flex space-x-8">
            <div className="py-4 relative">
               <NavLink
                  to="/instructor/dashboard"
                  className={({ isActive }) =>
                     isActive ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
                  }
               >
                  Bài kiểm tra
               </NavLink>
               <div
                  className={({ isActive }) =>
                     isActive
                        ? 'absolute left-0 bottom-0 w-full h-1 bg-purple-700 transition-all duration-300 ease-in-out'
                        : 'absolute left-0 bottom-0 w-full h-1 bg-transparent hover:bg-purple-700 transition-all duration-300 ease-in-out'
                  }
               ></div>
            </div>
            <div className="py-4 relative">
               <NavLink
                  to="/online-learning"
                  className={({ isActive }) =>
                     isActive ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
                  }
               >
                  Học online
               </NavLink>
               <div
                  className={({ isActive }) =>
                     isActive
                        ? 'absolute left-0 bottom-0 w-full h-1 bg-purple-700 transition-all duration-300 ease-in-out'
                        : 'absolute left-0 bottom-0 w-full h-1 bg-transparent hover:bg-purple-700 transition-all duration-300 ease-in-out'
                  }
               ></div>
            </div>
            <div className="py-4 relative">
               <NavLink
                  to="/instructor/questions/library"
                  className={({ isActive }) =>
                     isActive ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
                  }
               >
                  Thư viện câu hỏi
               </NavLink>
               <div
                  className={({ isActive }) =>
                     isActive
                        ? 'absolute left-0 bottom-0 w-full h-1 bg-purple-700 transition-all duration-300 ease-in-out'
                        : 'absolute left-0 bottom-0 w-full h-1 bg-transparent hover:bg-purple-700 transition-all duration-300 ease-in-out'
                  }
               ></div>
            </div>
            <div className="py-4 relative">
               <NavLink
                  to="/instructor/dashboard/class"
                  className={({ isActive }) =>
                     isActive ? 'text-purple-700 font-medium' : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
                  }
               >
                  Lớp
               </NavLink>
               <div
                  className={({ isActive }) =>
                     isActive
                        ? 'absolute left-0 bottom-0 w-full h-1 bg-purple-700 transition-all duration-300 ease-in-out'
                        : 'absolute left-0 bottom-0 w-full h-1 bg-transparent hover:bg-purple-700 transition-all duration-300 ease-in-out'
                  }
               ></div>
            </div>
         </nav>

         {/* User icons and information */}
         <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
               <NavLink to="/menu">
                  <Menu className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
               </NavLink>
               <span className="text-sm text-gray-600">Menu</span>
            </div>

            <div onClick={() => setModalIsOpen(true)} className="flex flex-col items-center">

               <HelpCircle className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />

               <span className="text-sm text-gray-600">Hỗ trợ</span>
               <VideoModal
                  isOpen={modalIsOpen}
                  onRequestClose={() => setModalIsOpen(false)}
               />
            </div>

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
      </header>
   );
};

export default InstructorHeader;
