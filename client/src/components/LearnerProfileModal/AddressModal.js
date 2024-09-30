import React, { useState } from "react";

function AddressModal({ value, onSave, onClose, dialogPosition }) {
  // State để theo dõi giá trị mới của địa chỉ
  const [address, setAddress] = useState(value);

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96"
      style={{ top: dialogPosition.top, left: dialogPosition.left }}
    >
      <h3 className="text-lg font-bold">Change Address</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
          placeholder="Enter your new address"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded mr-2"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => onSave(address)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default AddressModal;
