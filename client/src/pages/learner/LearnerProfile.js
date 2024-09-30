import React, { useState, useEffect } from "react";
import PhoneModal from "./PhoneModal";
import PasswordModal from "../../components/LearnerProfileModal/PasswordModal";
import FullNameModal from "../../components/LearnerProfileModal/FullNameModal";
import BirthdayModal from "../../components/LearnerProfileModal/BirthdayModal";
import LanguageModal from "../../components/LearnerProfileModal/LanguageModal";

function LearnerProfile() {
  const [email] = useState("wapvip0922@gmail.com");
  const [telephone, setTelephone] = useState("-----------");
  const [password] = useState("*************");
  const [fullName, setFullName] = useState("Vip Wap");
  const [birthday, setBirthday] = useState("11 / 09 / 2024");
  const [language, setLanguage] = useState("English");

  // Dialog state for different sections
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false);
  const [isFullNameDialogOpen, setIsFullNameDialogOpen] = useState(false);
  const [isBirthdayDialogOpen, setIsBirthdayDialogOpen] = useState(false);
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);

  const [newTelephone, setNewTelephone] = useState("");
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });

  // Password dialog state (ensure that oldPassword is declared)
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Open dialogs for each field
  const openPhoneDialog = (e) => {
    setNewTelephone(telephone);
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setIsPhoneDialogOpen(true);
    setIsPasswordDialogOpen(false);
    setIsFullNameDialogOpen(false);
    setIsBirthdayDialogOpen(false);
    setIsLanguageDialogOpen(false);
  };

  const openPasswordDialog = (e) => {
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setIsPasswordDialogOpen(true);
    setIsPhoneDialogOpen(false);
    setIsFullNameDialogOpen(false);
    setIsBirthdayDialogOpen(false);
    setIsLanguageDialogOpen(false);
  };

  const openFullNameDialog = (e) => {
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setIsFullNameDialogOpen(true);
    setIsPhoneDialogOpen(false);
    setIsPasswordDialogOpen(false);
    setIsBirthdayDialogOpen(false);
    setIsLanguageDialogOpen(false);
  };

  const openBirthdayDialog = (e) => {
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setIsBirthdayDialogOpen(true);
    setIsPhoneDialogOpen(false);
    setIsPasswordDialogOpen(false);
    setIsFullNameDialogOpen(false);
    setIsLanguageDialogOpen(false);
  };

  const openLanguageDialog = (e) => {
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setIsLanguageDialogOpen(true);
    setIsPhoneDialogOpen(false);
    setIsPasswordDialogOpen(false);
    setIsFullNameDialogOpen(false);
    setIsBirthdayDialogOpen(false);
  };

  // Close dialogs
  const closePhoneDialog = () => setIsPhoneDialogOpen(false);
  const closePasswordDialog = () => setIsPasswordDialogOpen(false);
  const closeFullNameDialog = () => setIsFullNameDialogOpen(false);
  const closeBirthdayDialog = () => setIsBirthdayDialogOpen(false);
  const closeLanguageDialog = () => setIsLanguageDialogOpen(false);

  // Backdrop click handler
  const handleBackdropClick = () => {
    closePhoneDialog();
    closePasswordDialog();
    closeFullNameDialog();
    closeBirthdayDialog();
    closeLanguageDialog();
  };

  // Save handlers
  const handleSavePhone = () => {
    setTelephone(newTelephone);
    closePhoneDialog();
  };

  const handleSavePassword = () => {
    if (newPassword === confirmNewPassword) {
      alert("Password changed successfully!");
      closePasswordDialog();
    } else {
      alert("New password and confirmation do not match!");
    }
  };

  const handleSaveFullName = (newName) => {
    setFullName(newName);
    closeFullNameDialog();
  };

  const handleSaveBirthday = (newDate) => {
    setBirthday(newDate);
    closeBirthdayDialog();
  };

  const handleSaveLanguage = (newLang) => {
    setLanguage(newLang);
    closeLanguageDialog();
  };

  return (
    <div className="bg-gray-50">
      <div className="p-10 min-h-screen container mx-auto px-40">
        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <div className="w-28 h-28 bg-blue-500 text-white flex items-center justify-center text-5xl rounded-xl">
            V
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">WapVip0922</h2>
            <p className="text-sm text-gray-500">ID: CKGWMEER</p>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-3">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          <div className="col-span-2 grid grid-cols-6 gap-5">
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="text"
              value={email}
              readOnly
              className="border-0 cursor-not-allowed focus:ring-0 focus:outline-none underline col-span-5"
            />

            <label className="text-sm text-gray-500">Telephone</label>
            <input
              type="text"
              value={telephone}
              readOnly
              onClick={openPhoneDialog}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Password</label>
            <input
              type="password"
              value={password}
              readOnly
              onClick={openPasswordDialog}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-3">
          <h3 className="text-lg font-semibold mb-4">Contact information</h3>
          <div className="col-span-2 grid grid-cols-6 gap-5">
            <label className="text-sm text-gray-500">Full name</label>
            <input
              type="text"
              value={fullName}
              readOnly
              onClick={openFullNameDialog}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Birthday</label>
            <input
              type="text"
              value={birthday}
              readOnly
              onClick={openBirthdayDialog}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Address</label>
            <input
              type="text"
              value="--- ,--- ,---"
              readOnly
              className=" border-0 cursor-not-allowed focus:ring-0 focus:outline-none col-span-5"
            />
          </div>
        </div>

        {/* Setting Section */}
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-3">
          <h3 className="text-lg font-semibold">Setting</h3>
          <div className="col-span-2 items-center gap-5 grid grid-cols-6">
            <label className="text-sm text-gray-500">Language</label>
            <input
              type="text"
              value={language}
              readOnly
              onClick={openLanguageDialog}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none flex-grow"
            />
          </div>
        </div>

        {/* Invisible Backdrop */}
        {(isPhoneDialogOpen ||
          isPasswordDialogOpen ||
          isFullNameDialogOpen ||
          isBirthdayDialogOpen ||
          isLanguageDialogOpen) && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30"
            onClick={handleBackdropClick}
          ></div>
        )}

        {/* Phone Modal */}
        {isPhoneDialogOpen && (
          <PhoneModal
            newTelephone={newTelephone}
            setNewTelephone={setNewTelephone}
            handleSavePhone={handleSavePhone}
            closePhoneDialog={closePhoneDialog}
            dialogPosition={dialogPosition}
          />
        )}

        {/* Password Modal */}
        {isPasswordDialogOpen && (
          <PasswordModal
            oldPassword={oldPassword}
            setOldPassword={setOldPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmNewPassword={confirmNewPassword}
            setConfirmNewPassword={setConfirmNewPassword}
            handleSavePassword={handleSavePassword}
            closePasswordDialog={closePasswordDialog}
            dialogPosition={dialogPosition}
          />
        )}

        {/* Full Name Modal */}
        {isFullNameDialogOpen && (
          <FullNameModal
            fullName={fullName}
            setFullName={setFullName}
            handleSaveFullName={handleSaveFullName}
            closeFullNameDialog={closeFullNameDialog}
            dialogPosition={dialogPosition}
          />
        )}

        {/* Birthday Modal */}
        {isBirthdayDialogOpen && (
          <BirthdayModal
            birthday={birthday}
            setBirthday={setBirthday}
            handleSaveBirthday={handleSaveBirthday}
            closeBirthdayDialog={closeBirthdayDialog}
            dialogPosition={dialogPosition}
          />
        )}

        {/* Language Modal */}
        {isLanguageDialogOpen && (
          <LanguageModal
            language={language}
            setLanguage={setLanguage}
            handleSaveLanguage={handleSaveLanguage}
            closeLanguageDialog={closeLanguageDialog}
            dialogPosition={dialogPosition}
          />
        )}
      </div>
    </div>
  );
}

export default LearnerProfile;
