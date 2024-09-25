// api.js

// Đăng ký người dùng mới
export const register = async (username, fullname, email, phone, password) => {
   const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({
         username,
         fullname,
         email,
         phone,
         password
      }),
   });
   return response.json();
};

// Đăng nhập người dùng
// 'identifier' có thể là 'username' hoặc 'email'
export const login = async (identifier, password) => {
   const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }), // 'identifier' dùng để nhận cả username hoặc email
   });
   return response.json();
};

// Lấy thông tin người dùng dựa trên username
export const getUser = async (username, token) => {
   const response = await fetch(`http://localhost:8080/api/user/${username}`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`, // Sử dụng token để xác thực
      },
   });
   return response.json();
};
