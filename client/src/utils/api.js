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


// Định nghĩa hàm getUser để lấy dữ liệu người dùng từ server theo token
export const getUserById = async (id, token) => {
   try {
     const response = await fetch(`http://localhost:8080/api/user/${id}`, {
       method: "GET",
       headers: {
         "Authorization": `Bearer ${token}`, // Thêm token vào header để xác thực
         "Content-Type": "application/json",
       },
     });
 
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
 
     const data = await response.json();
     return data; // Trả về dữ liệu người dùng nếu yêu cầu thành công
   } catch (error) {
     console.error("Error fetching user info:", error);
     return null;
   }
 };
 
