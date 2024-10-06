import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, Bell, User } from 'lucide-react';
import { jwtDecode } from 'jwt-decode'; // Corrected import statement
import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const InstructorHeader = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [username, setUsername] = useState(''); // State to store the user's username
   const navigate = useNavigate();

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   // Load user's username from the token when the component mounts
   useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) {
         try {
            const decodedToken = jwtDecode(token); // Decode the token
            console.log("Decoded Token: ", decodedToken); // Log to check decoded information
            setUsername(decodedToken.username || 'Người dùng'); // Use 'username' from the token
         } catch (error) {
            console.error("Error decoding token: ", error);
            setUsername('Người dùng');
         }
      }
   }, []);

   // Dropdown menu for "Policies"
   const policyMenu = (
      <div className="bg-white shadow-lg rounded-md border border-gray-200">
         <NavLink
            to="/policy/termprivacy"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition"
         >
            Điều khoản bảo mật
         </NavLink>
         <NavLink
            to="/policy/termofuse"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-500 transition"
         >
            Điều khoản sử dụng
         </NavLink>
      </div>
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
                  to="/class"
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

            <div className="flex flex-col items-center">
               <NavLink to="/support">
                  <HelpCircle className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
               </NavLink>
               <span className="text-sm text-gray-600">Hỗ trợ</span>
            </div>

            <div className="flex flex-col items-center">
               <NavLink to="/notifications">
                  <Bell className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
               </NavLink>
               <span className="text-sm text-gray-600">Thông báo</span>
            </div>

            <div className="flex items-center space-x-2">
               <NavLink to="/profile">
                  <User className="rounded-full h-10 w-10 bg-gray-200 text-gray-500 hover:text-gray-700 transition duration-200" />
               </NavLink>
               <span className="text-gray-700 font-medium">{username || 'Người dùng'}</span>
            </div>
         </div>
      </header>
   );
};

export default InstructorHeader;
