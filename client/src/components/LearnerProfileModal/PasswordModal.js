import React from "react";

const PasswordModal = ({
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmNewPassword,
  setConfirmNewPassword,
  handleSavePassword,
  closePasswordDialog,
  dialogPosition,
}) => {
  return (
    <div
      className="fixed z-50 bg-white p-6 rounded-lg shadow-lg w-96 animate-scaleIn"
      style={{ top: dialogPosition.top, left: dialogPosition.left }}
      onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it
    >
      <h3 className="text-lg font-bold">Change password</h3>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Old password</label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-500">New password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="mt-4">
        <label className="text-sm text-gray-500">Confirm new password</label>
        <input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      </div>
      <div className="flex justify-end mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded mr-2"
          onClick={closePasswordDialog}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleSavePassword}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PasswordModal;
