import React, { useState } from 'react';

const HeaderClassRoom = ({ onSearch }) => {
   const [selectedTab, setSelectedTab] = useState('Danh sách'); // Trạng thái theo dõi tab đã chọn

   const handleTabClick = (tabName) => {
      setSelectedTab(tabName);

   };

   return (
      <div className="px-6 pt-12 bg-gray-300">
         <div className="ml-80 flex space-x-6">
            <span
               className={`text-xl cursor-pointer pb-2 ${selectedTab === 'Danh sách'
                  ? 'border-b-[3px] border-blue-600 text-blue-600'
                  : 'text-gray-700'
                  }`}
               onClick={() => handleTabClick('Danh sách')}
            >
               Danh sách
            </span>

            <span
               className={`text-xl cursor-pointer pb-2 ${selectedTab === 'Lịch học'
                  ? 'border-b-[3px] border-blue-600 text-blue-600'
                  : 'text-gray-700'
                  }`}
               onClick={() => handleTabClick('Lịch học')}
            >
               Lịch học
            </span>

         </div>
      </div>
   );
};

export default HeaderClassRoom;
