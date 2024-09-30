import React, { useState } from "react";

function PhoneModal({ value, onSave, onClose, dialogPosition }) {
  const [newPhone, setNewPhone] = useState(value);

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96"
      style={{ top: dialogPosition.top, left: dialogPosition.left }} // Đặt vị trí modal dựa trên tọa độ của `dialogPosition`
    >
      <h3 className="text-lg font-bold">Change Phone Number</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Phone Number</label>
        <input
          type="text"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={onClose}>
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => onSave(newPhone)}>
          Save
        </button>
      </div>
    </div>
  );
}

export default PhoneModal;
