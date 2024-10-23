import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import InputField from "../../components/Form/InputField";
import PrimaryButton from "../../components/Button/PrimaryButton";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier) {
      setError("Vui lòng nhập Email.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/forgotPW", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Submit thành công! Vui lòng kiểm tra hộp thư điện tử của bạn."
        );
        // Điều hướng về login
        navigate("/login");
      } else {
        setError(
          result.error || "Sai email, Tên đăng nhập hoặc không tồn tại!!"
        );
        toast.error(
          result.error ||
            "Sai email, Tên đăng nhập    hoặc email không tồn tại!!"
        );
      }
    } catch (error) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md z-10">
        <div className="text-center">
          <div className="flex justify-center">
            <img src="/image/logo.svg" alt="Logo" className="h-24" />
          </div>
          <h2 className="text-2xl font-bold text-indigo-800 mb-2">
            Password recovery
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your email to verify your Nine Quiz account
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleForgotPassword}>
          <div className="flex items-centerpy-2">
            <Mail color="#737373" strokeWidth={1.5} className="mr-4 mb-4" />
            <InputField
              label=""
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email hoặc Tên đăng nhập"
              className="w-full focus:outline-none text-sm text-gray-700 placeholder-gray-400"
            />
          </div>
          <div className="flex justify-center items-center h-full">
            <PrimaryButton text="Xác Nhận" />
          </div>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <p className="text-center mt-4">
            Trờ về đăng nhâp?{" "}
            <a href="/login" className="text-indigo-600">
              Đăng nhập
            </a>
          </p>
        </form>
      </div>

      <div className="hidden md:block absolute bottom-8 right-8">
        <img
          src="/image/Forgot-PW.svg " // Thay thế bằng ảnh minh họa của bạn
          alt="Illustration"
        />
      </div>
    </div>
  );
}
