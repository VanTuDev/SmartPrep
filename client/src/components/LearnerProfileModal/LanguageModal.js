import React, { useState } from "react";

function LanguageModal({ value, onSave, onClose, dialogPosition }) {
  // State để theo dõi giá trị ngôn ngữ được chọn
  const [language, setLanguage] = useState(value);

  // Danh sách các ngôn ngữ hỗ trợ
  const languages = [
    "English",
    "Vietnamese",
    "French",
    "German",
    "Spanish",
    "Chinese",
    "Japanese",
    "Korean",
    "Italian",
    "Russian",
  ];

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96"
      style={{ top: dialogPosition.top, left: dialogPosition.left }} // Đặt vị trí modal dựa trên tọa độ của `dialogPosition`
    >
      <h3 className="text-lg font-bold">Change Language</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Language</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        >
          {languages.map((lang, index) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={onClose}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => onSave(language)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default LanguageModal;
