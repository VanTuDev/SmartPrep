import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
   return (
      <nav className="bg-gray-200 px-8 py-5 shadow-md">
         <div className="flex ml-64 gap-8 justify-start">
            <NavLink
               to="/exam"
               className={({ isActive }) =>
                  isActive
                     ? 'text-purple-700 font-medium border-b-2 border-purple-700'
                     : 'text-gray-600 hover:text-purple-700 transition-all duration-200'
               }
            >
               Bài kiểm tra
            </NavLink>

         </div>
      </nav>
   );
};

export default NavBar;
