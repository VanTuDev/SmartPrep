import React, { useState } from "react";

const FullNameModal = ({ fullName, handleSaveFullName, closeFullNameDialog, dialogPosition }) => {
  const [newFullName, setNewFullName] = useState(fullName);

  const handleSave = () => {
    handleSaveFullName(newFullName);
  };

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96 animate-scaleIn"
      style={{ top: dialogPosition.top, left: dialogPosition.left }}
      onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
    >
      <h3 className="text-lg font-bold">Edit Full Name</h3>
      <div className="mt-4">
        <input
          type="text"
          value={newFullName}
          onChange={(e) => setNewFullName(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded mr-2"
          onClick={closeFullNameDialog}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default FullNameModal;
