import React from 'react';
import { Checkbox, Space } from 'antd';

const QuestionCard = ({ question, index }) => (
   <div className="w-6/12  container mx-auto p-4 mb-4 rounded-lg border shadow-sm bg-white">
      <div className="mb-2 font-semibold">
         Câu {index + 1}: {question.question_text || "Câu hỏi chưa có nội dung"}
      </div>

      <Checkbox.Group className="w-full" value={question.correct_answers}>
         <Space direction="vertical" className="w-full">
            {question.options.map((option, i) => (
               <Checkbox key={i} value={option}>
                  {String.fromCharCode(65 + i)}. {option}
               </Checkbox>
            ))}
         </Space>
      </Checkbox.Group>
   </div>
);

export default QuestionCard;
