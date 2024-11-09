import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, HelpCircle, Bell } from 'lucide-react';
import { Dropdown, Menu as AntdMenu, Popover } from 'antd';
import VideoModal from '../../components/SupportGuide/SupportGuideModal';
import { toast } from 'react-toastify';
const LearnerHeader = () => {
   const [modalIsOpen, setModalIsOpen] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [isPopoverVisible, setIsPopoverVisible] = useState(false);
   const navigate = useNavigate();
   const [userInfo, setUserInfo] = useState(null);
   const [error, setError] = useState('');


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
      const fetchUserData = async () => {
         const token = localStorage.getItem('token');
         if (!token) {
            navigate('/login');
            return;
         }

         try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
               method: 'GET',
               headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
               const errorResponse = await response.json();
               toast.error(`Lỗi khi lấy thông tin người dùng: ${errorResponse.error || 'Không xác định'}`);
               return;
            }

            const data = await response.json();
            setUserInfo(data);

            const notificationsResponse = await fetch('http://localhost:5000/api/users/notifications', {
               method: 'GET',
               headers: { Authorization: `Bearer ${token}` },
            });

            if (notificationsResponse.ok) {
               const notificationsData = await notificationsResponse.json();
               setNotifications(notificationsData);
            }

         } catch (err) {
            setError('Có lỗi xảy ra trong quá trình lấy thông tin.');
         }
      };

      fetchUserData();
   }, [navigate]);

   const notificationContent = (
      <div className="max-h-60 overflow-y-auto">
         {notifications.length > 0 ? (
            <ul>
               {notifications.map((notification, index) => (
                  <li key={index} className="border-b py-2">
                     {notification.message}
                  </li>
               ))}
            </ul>
         ) : (
            <p>Không có thông báo.</p>
         )}
      </div>
   );

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

               {/* Notification Popover */}
            <Popover
               content={notificationContent}
               title="Thông báo"
               trigger="click"
               visible={isPopoverVisible}
               onVisibleChange={setIsPopoverVisible}
               placement="bottomRight"
            >
               <div className="flex flex-col items-center cursor-pointer">
                  <Bell className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
                  <span className="text-sm text-gray-600">Thông báo</span>
               </div>
            </Popover>

               {/* User Dropdown Menu */}
               <Dropdown overlay={userMenu} trigger={['click']}>
                  <div className="flex items-center space-x-2 cursor-pointer">
                  <img
                     src={
                        userInfo?.profile?.startsWith('http')
                           ? userInfo.profile
                           : userInfo?.profile
                           ? `http://localhost:5000/uploads/${userInfo.profile}`
                           : 'https://via.placeholder.com/150'
                     }
                     alt="Profile"
                     className="w-10 h-10 object-cover rounded-full shadow-md"
                  />
                     <span className="text-gray-700 font-medium">{userInfo?.username || 'Người dùng'}</span>
                  </div>
               </Dropdown>
            </div>
         </div>
      </header>
   );
};

export default LearnerHeader;
