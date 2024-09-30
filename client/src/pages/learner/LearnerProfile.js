import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import PhoneModal from "../../components/LearnerProfileModal/PhoneModal";
import PasswordModal from "../../components/LearnerProfileModal/PasswordModal";
import FullNameModal from "../../components/LearnerProfileModal/FullNameModal";
import BirthdayModal from "../../components/LearnerProfileModal/BirthdayModal";
import LanguageModal from "../../components/LearnerProfileModal/LanguageModal";
import AddressModal from "../../components/LearnerProfileModal/AddressModal";
import { getUserById, updateUser } from "utils/api";

function LearnerProfile() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    fullname: "",
    is_locked: false,
    phone: "",
    password: "",
    birthday: "",
    language: "",
    address: "",
    username: "",
    _v: "",
  });

  const [activeModal, setActiveModal] = useState(null);
  const [dialogPosition, setDialogPosition] = useState({ top: 0, left: 0 });

  const openModal = (e, modalName) => {
    setDialogPosition({ top: e.clientY, left: e.clientX + 80 });
    setActiveModal(modalName);
  };

  const closeModal = () => setActiveModal(null);

  const handleSave = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      setUserInfo((prev) => ({ ...prev, [field]: value }));

      const updates = { [field]: value };
      const userData = await updateUser( token, updates);

      if (userData) {
        setUserInfo(userData);
        console.log("User information updated successfully:", userData);
      } else {
        console.log("Failed to update user information");
      }
      closeModal();
    } catch (error) {
      console.error("Error updating user information:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const id = decoded.userId;

        if (id) {
          const userData = await getUserById(id, token);
          if (userData) {
            setUserInfo(userData);
          }
        }
      } catch (error) {
        console.error("Invalid token or error decoding token:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto p-10 px-40">
        {/* Profile Header */}
        <div className="flex items-center mb-8">
          <div className="w-28 h-28 bg-blue-500 text-white flex items-center justify-center text-5xl rounded-xl">
            {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : ""}
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold">{userInfo.username || "User Name"}</h2>
            <p className="text-sm text-gray-500">ID: {userInfo._id || "No ID"}</p>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-3">
          <h3 className="text-lg font-semibold mb-4">Account</h3>
          <div className="col-span-2 grid grid-cols-6 gap-5">
            <label className="text-sm text-gray-500">Email</label>
            <input
              type="text"
              value={userInfo.email}
              readOnly
              className="border-0 cursor-not-allowed focus:ring-0 focus:outline-none underline col-span-5"
            />

            <label className="text-sm text-gray-500">Telephone</label>
            <input
              type="text"
              value={userInfo.phone || "-----------"}
              readOnly
              onClick={(e) => openModal(e, "phone")}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Password</label>
            <input
              type="password"
              value={userInfo.password}
              readOnly
              onClick={(e) => openModal(e, "password")}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-3">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="col-span-2 grid grid-cols-6 gap-5">
            <label className="text-sm text-gray-500">Full Name</label>
            <input
              type="text"
              value={userInfo.fullname}
              readOnly
              onClick={(e) => openModal(e, "fullname")}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Birthday</label>
            <input
              type="text"
              value={userInfo.birthday}
              readOnly
              onClick={(e) => openModal(e, "birthday")}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />

            <label className="text-sm text-gray-500">Address</label>
            <input
              type="text"
              value={userInfo.address}
              readOnly
              onClick={(e) => openModal(e, "address")}
              className="border-0 cursor-pointer focus:ring-0 focus:outline-none col-span-5"
            />
          </div>
        </div>

        {/* Setting Section */}
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-3">
          <h3 className="text-lg font-semibold col-span-3 mb-4">Settings</h3>
          <div className="col-span-2 items-center gap-5 grid grid-cols-6">
            <label className="text-sm text-gray-500">Language</label>
            <input
              type="text"
              value={userInfo.language}
              readOnly
              onClick={(e) => openModal(e, "language")}
              className="bg-transparent border-0 cursor-pointer focus:ring-0 focus:outline-none flex-grow"
            />
          </div>
        </div>

        {/* Render Modal Tương Ứng */}
        {activeModal === "phone" && (
          <PhoneModal value={userInfo.phone} onSave={(value) => handleSave("phone", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
        {activeModal === "password" && (
          <PasswordModal onSave={(value) => handleSave("password", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
        {activeModal === "fullname" && (
          <FullNameModal value={userInfo.fullname} onSave={(value) => handleSave("fullname", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
        {activeModal === "birthday" && (
          <BirthdayModal value={userInfo.birthday} onSave={(value) => handleSave("birthday", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
        {activeModal === "address" && (
          <AddressModal value={userInfo.address} onSave={(value) => handleSave("address", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
        {activeModal === "language" && (
          <LanguageModal value={userInfo.language} onSave={(value) => handleSave("language", value)} onClose={closeModal} dialogPosition={dialogPosition} />
        )}
      </div>
    </div>
  );
}

export default LearnerProfile;
