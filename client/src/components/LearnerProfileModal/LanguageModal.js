import React, { useState } from "react";

const LanguageModal = ({ language, handleSaveLanguage, closeLanguageDialog, dialogPosition }) => {
  const [newLanguage, setNewLanguage] = useState(language);

  const handleSave = () => {
    handleSaveLanguage(newLanguage);
  };

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96 animate-scaleIn"
      style={{ top: dialogPosition.top, left: dialogPosition.left }}
      onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
    >
      <h3 className="text-lg font-bold">Edit Language</h3>
      <div className="mt-4">
        <input
          type="text"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded mr-2"
          onClick={closeLanguageDialog}
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

export default LanguageModal;
