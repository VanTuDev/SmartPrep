// V2

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip, Tabs, Popover, DatePicker, TimePicker } from 'antd';
import { X, Eye, Download, CalendarDays } from 'lucide-react';
import PreviewExam from './PreviewExam.js';
import ExportPdfPage from './ExportPdfPage.js';

const ExamHeader = ({ items, activeTab, onChangeTab, onPost, loading, examId }) => {
   const navigate = useNavigate();
   const [openPreview, setOpenPreview] = useState(false);
   const [openExportPage, setOpenExportPage] = useState(false);

   return (
      <header className="bg-white shadow-md fixed top-0 left-0 right-0 h-20 z-50 flex items-center px-8">
         {/* Nút Cancel */}
         <div className="flex items-center justify-start">
            <Tooltip title="Cancel">
               <button
                  onClick={() => navigate('/instructor/dashboard')}
                  className="text-gray-500 hover:text-red-500"
               >
                  <X size={24} />
               </button>
            </Tooltip>
         </div>

         {/* Tabs điều hướng trung tâm */}
         <div className="flex-1 flex justify-center">
            <Tabs
               activeKey={activeTab}
               onChange={onChangeTab}
               items={items.map((item) => ({
                  key: item.key,
                  label: item.label,
               }))}
               className="w-full"
            />
         </div>

         {/* Hành động ở bên phải */}
         <div className="flex items-center space-x-4">
            {/* Nút Preview */}
            <Tooltip title="Preview">
               <Button
                  icon={<Eye />}
                  onClick={() => setOpenPreview(true)}
               />
            </Tooltip>

            {/* Nút Export PDF */}
            <Tooltip title="Export">
               <Button
                  icon={<Download />}
                  onClick={() => setOpenExportPage(true)}
               />
            </Tooltip>

            {/* Nút Post */}
            <Button
               type="primary"
               loading={loading}
               onClick={onPost}
            >
               Post
            </Button>

            {/* Popover Lịch */}
            <Popover
               placement="bottomRight"
               content={
                  <div className="p-4">
                     <div className="text-center font-semibold mb-2">
                        Schedule and Post Content
                     </div>
                     <div className="flex space-x-2">
                        <DatePicker className="w-1/2" />
                        <TimePicker className="w-1/2" />
                     </div>
                     <div className="mt-4 flex justify-end">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                           Save
                        </button>
                     </div>
                  </div>
               }
               trigger="click"
            >
               <button className="bg-red-300 p-2 rounded-md">
                  <CalendarDays size={20} />
               </button>
            </Popover>
         </div>

         {/* Preview Exam Modal */}
         <PreviewExam
            visible={openPreview}
            onClose={() => setOpenPreview(false)}
         />

         {/* Export PDF Modal */}
         <ExportPdfPage
            visible={openExportPage}
            onClose={() => setOpenExportPage(false)}
         />
      </header>
   );
};

export default ExamHeader;
