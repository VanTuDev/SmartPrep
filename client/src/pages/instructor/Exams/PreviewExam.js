import React from 'react';
import { Drawer, Space, Radio, Empty, Typography } from "antd";
import { AlarmClock } from 'lucide-react';

const { Title, Text } = Typography;

function PreviewExam({ visible, onClose, exam }) {
   return (
      <Drawer
         title={
            <div className="drawer-header flex items-center justify-between">
               <AlarmClock size={36} />
               <p className="text-xl font-semibold">{exam?.duration || 0} phút</p>
            </div>
         }
         placement="right"
         onClose={onClose}
         open={visible}
         width="80vw"
      >
         <div className="w-3/5 mx-auto mt-5">
            {exam?.questions?.length > 0 ? (
               exam.questions.map((question, index) => (
                  <div key={question.id} className="p-4 mb-6 bg-white shadow-sm">
                     <p className="font-bold">{`Câu hỏi ${index + 1}: ${question.question_text}`}</p>
                     <Space direction="vertical">
                        {question.options.map((option, optIndex) => (
                           <div key={optIndex} className="flex items-center space-x-2">
                              <Radio disabled>{option}</Radio>
                           </div>
                        ))}
                     </Space>
                  </div>
               ))
            ) : (
               <Empty description="Không có câu hỏi nào" />
            )}
         </div>
      </Drawer>
   );
}

export default PreviewExam;
