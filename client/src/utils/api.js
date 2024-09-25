// api.js
export const register = async (username, email, password) => {
   const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
   });
   return response.json();
};

export const login = async (username, password) => {
   const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
   });
   return response.json();
};

export const getUser = async (username) => {
   const response = await fetch(`http://localhost:8080/api/user/${username}`, {
      method: 'GET',
      headers: {
         'Content-Type': 'application/json'
      }
   });
   return response.json();
};
