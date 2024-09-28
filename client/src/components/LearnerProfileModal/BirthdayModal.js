import React, { useState, useEffect } from "react";

// Hàm chuyển đổi định dạng `yyyy-mm-dd` sang `dd/mm/yyyy`
const formatDateToDDMMYYYY = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Hàm chuyển đổi định dạng `dd/mm/yyyy` sang `yyyy-mm-dd` (dành cho input type="date")
const formatDateToYYYYMMDD = (dateString) => {
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  return `${year}-${month}-${day}`;
};

function BirthdayModal({ value, onSave, onClose, dialogPosition }) {
  // Sử dụng `formatDateToYYYYMMDD` để chuyển đổi định dạng đầu vào `dd/mm/yyyy` thành `yyyy-mm-dd`
  const [birthday, setBirthday] = useState(formatDateToYYYYMMDD(value));

  // Xử lý khi nhấn nút lưu
  const handleSave = () => {
    const formattedBirthday = formatDateToDDMMYYYY(birthday); // Định dạng `dd/mm/yyyy`
    onSave(formattedBirthday);
  };

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96"
      style={{ top: dialogPosition.top, left: dialogPosition.left }} // Đặt vị trí modal dựa trên tọa độ của `dialogPosition`
    >
      <h3 className="text-lg font-bold">Change Birthday</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={onClose}>
          Cancel
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
}

export default BirthdayModal;
