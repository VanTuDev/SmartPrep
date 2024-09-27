import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';

const Header = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const navigate = useNavigate(); // Di chuyển useNavigate ra ngoài hàm

   const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
   };

   const menu = (
      <Menu>
         <Menu.Item>
            <Link to="/policy/termprivacy" className='whitespace-nowrap'>Điều khoản bảo mật</Link>
         </Menu.Item>
         <Menu.Item>
            <Link to="/policy/termofuse" className='whitespace-nowrap'>Điều khoản sử dụng</Link>
         </Menu.Item>
      </Menu>
   );

   return (
      <header className="bg-white fixed top-0 left-0 right-0 z-10 shadow-lg h-20 flex items-center z-50">
         <div className="container mx-auto px-6 lg:px-8">
            <nav className="flex items-center justify-between">
               {/* Logo */}
               <div>
                  <Link to="/home">
                     <img
                        src="/image/logo.svg"
                        alt="Logo"
                        className="h-24"
                     />
                  </Link>
               </div>
               <ul className="hidden md:flex space-x-6 items-center">
                  <li>
                     <Link to="/feature" className="nav-link hover:text-blue-500 transition">
                        Tính năng
                     </Link>
                  </li>
                  <li>
                     <Dropdown overlay={menu} trigger={['click']}>
                        <Button className="hover:text-blue-500 focus:outline-none"
                           style={{
                              border: 'none',
                              background: 'none',
                              boxShadow: 'none',
                              fontSize: '16px',
                              fontWeight: 'normal',
                              padding: '0'
                           }}>
                           Chính sách
                        </Button>
                     </Dropdown>
                  </li>
                  <li>
                     <Link to="/document" className="nav-link hover:text-blue-500 transition">
                        Hướng dẫn sử dụng
                     </Link>
                  </li>
                  <li>
                     <Link to="/blog" className="nav-link hover:text-blue-500 transition">
                        Tin tức
                     </Link>
                  </li>
                  <li>
                     <Link to="/contact" className="nav-link hover:text-blue-500 transition">
                        Liên hệ
                     </Link>
                  </li>
               </ul>

               {/* Action Buttons (Desktop) */}
               <div className="hidden md:flex space-x-4">
                  <Button
                     type="primary"
                     className="text-white bg-blue-600 hover:bg-blue-700"
                     onClick={() => navigate('/register')}
                  >
                     Đăng ký
                  </Button>
                  <Button
                     className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
                     onClick={() => navigate('/login')}
                  >
                     Đăng nhập
                  </Button>
               </div>

               {/* Mobile Menu Toggle */}
               <div className="md:hidden">
                  <button
                     className="text-gray-600 focus:outline-none"
                     onClick={toggleMobileMenu}
                  >
                     <span className="block w-6 h-1 bg-gray-600 mb-1"></span>
                     <span className="block w-6 h-1 bg-gray-600 mb-1"></span>
                     <span className="block w-6 h-1 bg-gray-600"></span>
                  </button>
               </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
               <ul className="md:hidden bg-white shadow-lg rounded-lg p-4 space-y-4">
                  <li>
                     <Link to="/feature" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Tính năng
                     </Link>
                  </li>
                  <li>
                     <Link to="/policy/termprivacy" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Điều khoản bảo mật
                     </Link>
                  </li>
                  <li>
                     <Link to="/policy/termofuse" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Điều khoản sử dụng
                     </Link>
                  </li>
                  <li>
                     <Link to="/document" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Hướng dẫn sử dụng
                     </Link>
                  </li>
                  <li>
                     <Link to="/blog" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Tin tức
                     </Link>
                  </li>
                  <li>
                     <Link to="/contact" className="block py-2 text-gray-700 hover:text-blue-500 transition">
                        Liên hệ
                     </Link>
                  </li>
                  <div className="flex justify-between px-4 py-4">
                     <Button
                        type="primary"
                        className="w-full mr-2 hover:bg-blue-700 transition"
                        onClick={() => navigate('/register')}
                     >
                        Đăng ký
                     </Button>
                     <Button
                        className="w-full ml-2 text-blue-600 border-blue-600 hover:border-blue-700 hover:text-blue-700 transition"
                        onClick={() => navigate('/login')}
                     >
                        Đăng nhập
                     </Button>
                  </div>
               </ul>
            )}
         </div>
      </header>
   );
};

export default Header;
