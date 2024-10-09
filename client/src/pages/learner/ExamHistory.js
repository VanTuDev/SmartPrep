import React, { useState } from 'react';
import CardComponent from '../../components/learner/ExamCard';
import HeaderComponent from '../../components/learner/LearnerHeader';
import { Search, Filter, EllipsisVertical, ChevronDown } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { toast } from 'react-toastify';

const ExamHistory = ({ onCancel, onFilter }) => {
   const [selectedClass, setSelectedClass] = useState('Lớp');
   // Dữ liệu giả lập cho các thẻ bài kiểm tra
   const tests = [
      {
         title: 'Bài mở đầu',
         startTime: '21:42 - 05/10/24',
         endTime: '21:42 - 05/10/24',
         duration: '0 phút',
         questionCount: 2,
         organization: 'FPT school',
      },
      {
         title: 'Bài mở đầu',
         startTime: '21:41 - 05/10/24',
         endTime: '21:41 - 05/10/24',
         duration: '0 phút',
         questionCount: 2,
         organization: 'FPT school',
      },
   ];

   return (
      <div className=" bg-white-50">
         {/* Header */}
         <HeaderComponent />
         <div className="min-h-screen bg-gray px-16 py-12">
            {/* Thanh tìm kiếm */}
            <div className="flex items-center justify-between mb-6">
               {/* Ô tìm kiếm */}
               <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-1/3">
                  <input
                     type="text"
                     placeholder="Nhập từ khóa"
                     className="px-4 py-2 w-full focus:outline-none"
                  />
                  <Search className="w-5 h-5 mx-3 text-gray-500" />
               </div>

               {/* Nút lọc */}

               <Menu as="div" className="w-1/24 relative inline-block text-left">
                  <div>
                     <MenuButton className="inline-flex w-1/7 justify-center gap-x-1.5 rounded-md bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200">
                           <Filter className="w-5 h-5 mr-2 text-gray-500" />
                           Lọc
                        </button>
                     </MenuButton>
                  </div>

                  <MenuItems
                     transition
                     className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                     <div className="">
                        <MenuItem>
                           <div className="p-6 w-64 bg-white rounded-lg shadow-lg">
                              {/* Dropdown chọn lớp */}
                              <div className="mb-4">
                                 <div className="flex items-center space-x-2">
                                    <Filter className="w-5 h-5 text-indigo-600" />
                                    <span className="text-gray-700 font-semibold">Lớp</span>
                                 </div>
                                 <Menu as="div" className="relative mt-2">
                                    <Menu.Button className="flex justify-between items-center w-full px-3 py-2 border-b-2 border-indigo-600 focus:outline-none">
                                       <span>{selectedClass}</span>
                                       <ChevronDown className="h-5 w-5 text-gray-600" />
                                    </Menu.Button>

                                    {/* Menu Items */}
                                    <Menu.Items className="absolute mt-1 w-full bg-white rounded-md border border-gray-300">
                                       {['Lớp A', 'Lớp B', 'Lớp C'].map((item) => (
                                          <Menu.Item key={item}>
                                             {({ active }) => (
                                                <button
                                                   className={`${active ? 'bg-indigo-100' : ''
                                                      } w-full text-left px-4 py-2 text-sm text-gray-700`}
                                                   onClick={() => setSelectedClass(item)}
                                                >
                                                   {item}
                                                </button>
                                             )}
                                          </Menu.Item>
                                       ))}
                                    </Menu.Items>
                                 </Menu>
                              </div>
                           </div>
                        </MenuItem>
                     </div>
                  </MenuItems>
               </Menu>
            </div>

            {/* Danh sách các bài kiểm tra */}
            <div className="flex flex-wrap gap-8">
               {tests.map((test, index) => (
                  <CardComponent
                     key={index}
                     title={test.title}
                     startTime={test.startTime}
                     endTime={test.endTime}
                     duration={test.duration}
                     questionCount={test.questionCount}
                     organization={test.organization}
                  />
               ))}
            </div>
         </div>
      </div>
   );
};

export default ExamHistory;
