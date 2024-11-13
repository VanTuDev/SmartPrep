// File: QuestionAdding.js

import React, { useState } from 'react';
import { Folder, Shuffle, Plus, ArrowUpFromLine } from 'lucide-react';
import { Button, message, Tooltip, Upload } from 'antd';
import * as XLSX from 'xlsx';
import LibraryModal from '../../../../components/instructor/LibraryModal';
import LibrarySingleModal from '../../../../components/instructor/LibrarySingleModal';


const QuestionAdding = ({ onAddRandomQuestions, onAddSelectedQuestions, addManualQuestion, onAddQuestionsFromExcel }) => {
   const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
   const [isSingleLibraryModalOpen, setIsSingleLibraryModalOpen] = useState(false);

   // Handle Excel file upload
   const handleExcelUpload = async (file) => {
      try {
         const data = await file.arrayBuffer();
         const workbook = XLSX.read(data, { type: 'array' });
         const worksheet = workbook.Sheets[workbook.SheetNames[0]];
         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

         // Parse JSON data to question objects
         const questions = jsonData.slice(1).map((row) => ({
            question_text: row[0], // First column for question text
            options: row.slice(1, -1).filter(option => option), // All columns between question and correct answer
            correct_answers: [row[row.length - 1]], // Last column is correct answer(s)
            question_type: 'multiple-choice'
         }));

         // Send parsed questions to ExamCreate
         if (typeof onAddQuestionsFromExcel === 'function') {
            onAddQuestionsFromExcel(questions);
            message.success('Questions added successfully!');
         } else {
            throw new Error('onAddQuestionsFromExcel function is not available');
         }
      } catch (error) {
         console.error('Failed to parse Excel file:', error);
         message.error('Failed to add questions from Excel file.');
      }

      return false; // Prevent default upload action
   };

   return (
      <>
         <div className="fixed bottom-8 right-8 flex flex-col items-center space-y-3 z-50">
            <Tooltip title="Add Random Questions" placement="left">
               <Button
                  type="primary"
                  shape="circle"
                  icon={<Shuffle />}
                  size="large"
                  onClick={() => setIsLibraryModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 shadow-lg transition-transform transform hover:scale-105"
               />
            </Tooltip>

            <Tooltip title="Add Selected Questions" placement="left">
               <Button
                  type="primary"
                  shape="circle"
                  icon={<Folder />}
                  size="large"
                  onClick={() => setIsSingleLibraryModalOpen(true)}
                  className="bg-green-500 hover:bg-green-600 shadow-lg transition-transform transform hover:scale-105"
               />
            </Tooltip>

            <Tooltip title="Add New Question" placement="left">
               <Button
                  type="primary"
                  shape="circle"
                  icon={<Plus />}
                  size="large"
                  onClick={addManualQuestion} // Directly call addManualQuestion
                  className="bg-purple-500 hover:bg-purple-600 shadow-lg transition-transform transform hover:scale-105"
               />
            </Tooltip>

            <Tooltip title="Upload Questions from Excel" placement="left">
               <Upload
                  beforeUpload={handleExcelUpload}
                  showUploadList={false}
               >
                  <Button
                     type="primary"
                     shape="circle"
                     icon={<ArrowUpFromLine />}
                     size="large"
                     className="bg-yellow-500 hover:bg-yellow-600 shadow-lg transition-transform transform hover:scale-105"
                  />
               </Upload>
            </Tooltip>
         </div>

         {/* Library Modals */}
         <LibraryModal
            isOpen={isLibraryModalOpen}
            onClose={() => setIsLibraryModalOpen(false)}
            onSubmit={onAddRandomQuestions}
         />

         <LibrarySingleModal
            isOpen={isSingleLibraryModalOpen}
            onClose={() => setIsSingleLibraryModalOpen(false)}
            onSubmit={onAddSelectedQuestions}
         />
      </>
   );
};

export default QuestionAdding;
