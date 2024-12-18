import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/Form/InputField";
import PrimaryButton from "../../components/Button/PrimaryButton";
import { Mail, Key } from "lucide-react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [identifier, setIdentifier] = useState(""); // Email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Store userId to resend verification email
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user._id);

        if (result.user.role === "instructor") {
          if(result.user.is_locked === false)
            navigate('/instructor/dashboard');
          else
            navigate('/instructor/registration')
        } else if (result.user.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/learner/dashboard");
        }
      } else {
        if (result.error === "Email chưa được xác thực.") {
          setUserId(result.userId); // Save userId for resending email
        }
        toast.error(result.error || "Đăng nhập thất bại.");
        setError(result.error || "Đăng nhập thất bại.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  const handleResendEmail = async () => {
    if (!identifier) {
      toast.error("Vui lòng nhập email hoặc tên đăng nhập để gửi lại email.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Email xác thực đã được gửi lại!");
      } else {
        toast.error(result.error || "Không thể gửi lại email.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Có lỗi xảy ra khi gửi lại email.");
    }
  };

  const handleGGLogin = async (credentialResponse) => {
    try {
      if (
        !credentialResponse ||
        typeof credentialResponse.credential !== "string"
      ) {
        throw new Error("Invalid credential response or missing JWT token.");
      }

      const data = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google JWT:", data);

      const formData = {
        username: data.name,
        fullname: data.name,
        email: data.email,
        google_id: data.sub, // Use the Google ID from the JWT payload
        profile: data.picture,
        role: "learner",
      };

      const response = await fetch("http://localhost:5000/api/users/ggLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Đăng nhập thành công!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.user._id);

        switch (result.user.role) {
          case "instructor":
            navigate("/instructor/dashboard");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/learner/dashboard");
        }
      } else {
        toast.error(result.error || "Đăng nhập thất bại.");
      }
    } catch (error) {
      console.error("Error during Google login:", error.message);
      toast.error("Đã xảy ra lỗi khi xử lý đăng nhập.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-9 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/image/logo.svg" alt="Logo" className="h-24" />
        </div>
        <h2 className="text-2xl font-medium text-center mb-6">Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <div className="flex my-6 h-3/5 items-center w-full gap-0">
            <Mail color="#737373" strokeWidth={1.5} className="mr-2" />
            <InputField
              label=""
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email hoặc Tên đăng nhập"
              className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
            />
          </div>

          <div className="flex my-6 h-3/5 items-center w-full">
            <Key color="#737373" strokeWidth={1.5} className="mr-2" />
            <InputField
              label=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Mật khẩu"
            />
          </div>
          <div className="flex justify-end my-5 text-center">
            <a className="text-indigo-600" href="/forgot-password">
              Quên mật khẩu ?
            </a>
          </div>
          <div className="flex justify-center items-center h-full">
            <PrimaryButton text="Đăng Nhập" />
          </div>

          {/* Google Login Button (dummy for UI) */}
          <div className="flex justify-center text-gray-600 font-bold mt-6">
            <GoogleLogin
              onSuccess={handleGGLogin}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </div>

          <p className="text-center mt-4">
            Chưa có tài khoản?{" "}
            <a href="/register" className="text-indigo-600">
              Đăng ký
            </a>
          </p>
        </form>
        {error && (
          <p className="text-red-500 mt-4 text-center">
            {error}{" "}
            {error && (
              <button
                onClick={handleResendEmail}
                type="button" // Ensure it's not treated as a submit button
                className="text-indigo-600 underline ml-2"
              >
                Gửi lại email
              </button>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
