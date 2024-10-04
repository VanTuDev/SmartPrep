// AddQuestionModal.js
import React from 'react';
import AddQuestionForm from './AddQuestion';

const AddQuestionModal = ({ onClose, onSave, existingQuestion }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <AddQuestionForm
        onClose={onClose}
        onSave={onSave}
        existingQuestion={existingQuestion}
      />
    </div>
  );
}; 

export default AddQuestionModal;
