import { Menu, HelpCircle, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className=" flex justify-between items-center shadow-lg p-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="../../assets/logo.svg" alt="Quiz Logo" className="w-10 h-10" />
          <span className="text-lg text-gray-700">FPT school</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-purple-700">
            Bài kiểm tra
          </a>
          <a href="#" className="text-gray-600 hover:text-purple-700">
            Học online
          </a> 
          <a href="#" className="text-purple-700 font-semibold">
            Thư viện câu hỏi
          </a>
          <a href="#" className="text-gray-600 hover:text-purple-700">
            Lớp
          </a>
        </nav>

        {/* Right Side Icons and Profile */}
        <div className="flex items-center space-x-6">
          {/* Menu Icon */}
          <button className="text-gray-600 hover:text-purple-700">
            <Menu size={24} />
            <span className="sr-only">Menu</span>
          </button>

          {/* Support Icon */}
          <button className="text-gray-600 hover:text-purple-700">
            <HelpCircle size={24} />
            <span className="sr-only">Hỗ trợ</span>
          </button>

          {/* Notification Bell */}
          <button className="relative text-gray-600 hover:text-purple-700">
            <Bell size={24} />
            {/* Notification badge */}
            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
            <span className="sr-only">Thông báo</span>
          </button>

          {/* Profile Icon */}
          <div className="flex items-center space-x-2">
            <img
              src="/path/to/profile-image.jpg"
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-gray-700">Hiếu</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
