// File: QuestionAdding.js

import React, { useState } from 'react';
import { Folder, Shuffle, Plus } from 'lucide-react';
import { Button, Tooltip } from 'antd';
import LibraryModal from '../../../../components/instructor/LibraryModal';
import LibrarySingleModal from '../../../../components/instructor/LibrarySingleModal';

const QuestionAdding = ({ onAddRandomQuestions, onAddSelectedQuestions, addManualQuestion }) => {
   const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
   const [isSingleLibraryModalOpen, setIsSingleLibraryModalOpen] = useState(false);

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
