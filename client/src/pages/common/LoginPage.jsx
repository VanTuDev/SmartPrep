import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/Form/InputField';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { login } from '../../utils/api';
import { Mail} from 'lucide-react';
const LoginPage = () => {
  const [identifier, setIdentifier] = useState(''); // Dùng cho cả email hoặc username
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    try {
      const result = await login(identifier, password);
      if (result.token) {
        localStorage.setItem('token', result.token);
        navigate('/learner/dashboard');
      } else {
        setError(result.error || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl text-center mb-6">Đăng Nhập</h2>
              <form onSubmit={handleLogin}>
                   <div className="flex py-2 gap-4 items-center w-full">
                      <div>
                   <Mail color="#737373" strokeWidth={1.5} />
                      </div>
                       <InputField
            label=""
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Email"
    
                  />

                  </div>
                  <div className="flex py-2 gap-4 items-center w-full">
                    <Mail color="#737373" strokeWidth={1.5} />
 <InputField
            label=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Mật khẩu"
          />
          </div>
                 
         
          <PrimaryButton text="Đăng Nhập" />
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        <p className="text-center mt-4">
          Chưa có tài khoản? <a href="/register" className="text-indigo-600">Đăng ký</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
