import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './header';

const VerifyUser = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(''); // Initialize status as an empty string
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      const token = searchParams.get('token');
      console.log(token);
      
      if (!token) {
        setStatus('Không tìm thấy token xác thực.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token }), // Send token in the body
          });
          
        const result = await response.json();

        if (response.ok) {
          setStatus('Tài khoản của bạn đã được xác thực thành công!');
          toast.success('Xác thực thành công! Bạn sẽ được chuyển hướng trong giây lát...');
          setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3s
        } else {
          // Handle case where result contains an error object
          const errorMessage = typeof result === 'object' && result.message 
            ? result.message 
            : 'Liên kết xác thực không hợp lệ hoặc đã hết hạn!';
          setStatus(errorMessage);
          toast.error('Xác thực thất bại.');
        }
      } catch (error) {
        setStatus('Có lỗi xảy ra trong quá trình xác thực.');
        console.error(error);
        toast.error('Có lỗi xảy ra trong quá trình xác thực.');
      } finally {
        setLoading(false);
      }
    };

    verifyAccount();
  }, [searchParams, navigate]);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md w-full">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Xác Thực Tài Khoản
          </h2>
          {loading ? (
            <p className="text-center text-gray-600">
              Đang xử lý xác thực, vui lòng chờ...
            </p>
          ) : (
            <p
              className={`text-center ${
                typeof status === 'string' && status.includes('thành công')
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {status || 'Đã xảy ra lỗi không xác định.'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyUser;