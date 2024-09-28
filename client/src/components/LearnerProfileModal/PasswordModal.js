import React, { useState } from "react";

function PasswordModal({ value, onSave, onClose, dialogPosition }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Hàm xử lý khi nhấn "Save"
  const handleSave = () => {
    // Kiểm tra nếu mật khẩu cũ nhập vào khớp với mật khẩu cũ hiện tại
    if (oldPassword !== value) {
      alert("Old password is incorrect!");
      return;
    }
    // Kiểm tra nếu mật khẩu mới và xác nhận mật khẩu khớp nhau
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }
    // Lưu mật khẩu mới
    onSave(newPassword);
  };

  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96"
      style={{ top: dialogPosition.top, left: dialogPosition.left }}
    >
      <h3 className="text-lg font-bold">Change Password</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Old Password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-500">New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

export default PasswordModal;
