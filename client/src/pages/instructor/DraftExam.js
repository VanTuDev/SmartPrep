import React, { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const DraftExam = () => {
   const [draftExams, setDraftExams] = useState([]);

   // Fetch dữ liệu từ tệp JSON
   useEffect(() => {
      fetch('/instructor.data/draftExams.json')
         .then((response) => response.json())
         .then((data) => {
            setDraftExams(data);
         });
   }, []);

   return (
      <div className="mt-12">
         <h2 className="text-xl font-semibold text-gray-800 mb-4">Đang soạn</h2>

         {/* Container hiển thị các thẻ bài kiểm tra, chia làm 4 cột */}
         <div className="grid grid-cols-4 gap-6">
            {draftExams.map((exam) => (
               <div
                  key={exam.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 w-full"
               >
                  {/* Tiêu đề bài kiểm tra */}
                  <div className="font-semibold text-gray-800 mb-4 text-lg">
                     {exam.title}
                  </div>

                  {/* Thông tin chi tiết bài kiểm tra */}
                  <div className="text-sm text-gray-600 space-y-2">
                     <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
                           🕒
                        </span>
                        {exam.startTime}
                     </div>
                     <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
                           ⏰
                        </span>
                        {exam.endTime}
                     </div>
                     <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
                           ⏳
                        </span>
                        Thời gian làm bài: {exam.duration}
                     </div>
                     <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
                           📋
                        </span>
                        Số câu hỏi: {exam.questions}
                     </div>
                     <div className="flex items-center">
                        <span className="inline-flex items-center justify-center w-4 h-4 mr-2">
                           🌍
                        </span>
                        {exam.status}
                     </div>
                  </div>

                  {/* Trạng thái và biểu tượng thêm hành động */}
                  <div className="mt-6 flex justify-between items-center">
                     <span className="text-green-600 text-sm font-semibold">
                        {exam.state}
                     </span>
                     <button>
                        <MoreVertical className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default DraftExam;