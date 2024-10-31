// Get user with role
export const fetchUsersByRole = async (role) => {
    try {
        // Gọi API với vai trò role
        const response = await fetch(`http://localhost:5000/api/users/admin/get_user/${role}`, {
            method: 'GET', // Phương thức HTTP
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        // Kiểm tra nếu response không thành công
        if (!response.ok) {
            throw new Error(`Error fetching ${role} data: ${response.statusText}`);
        }

        // Chuyển đổi kết quả về dạng JSON
        const data = await response.json();

        return data;  // Trả về dữ liệu người dùng

    } catch (error) {
        // Bắt lỗi trong quá trình fetch
        console.error('Fetch error:', error);
    }
};

export const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:5000/api/users/deleteuser/${id}`, { method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete learner.');
    }
    return await response.json();
};


// Dashboard api
export const fetchAllUsers = async () => {
    try {
        // Gọi API để lấy toàn bộ người dùng
        const response = await fetch('http://localhost:5000/api/users/all', {
            method: 'GET', // Phương thức HTTP
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        // Kiểm tra nếu response không thành công
        if (!response.ok) {
            throw new Error(`Error fetching users data: ${response.statusText}`);
        }

        // Chuyển đổi kết quả về dạng JSON
        const data = await response.json();

        return data; // Trả về danh sách người dùng

    } catch (error) {
        // Bắt lỗi trong quá trình fetch
        console.error('Fetch error:', error);
    }
};

export const fetchAllClasses = async () => {
    try {
        // Gọi API để lấy toàn bộ người dùng
        const response = await fetch('http://localhost:5000/api/classrooms/get_all_class', {
            method: 'GET', // Phương thức HTTP
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });

        // Kiểm tra nếu response không thành công
        if (!response.ok) {
            throw new Error(`Error fetching classes data: ${response.statusText}`);
        }

        // Chuyển đổi kết quả về dạng JSON
        const data = await response.json();

        return data;

    } catch (error) {
        // Bắt lỗi trong quá trình fetch
        console.error('Fetch error:', error);
    }
};
  
  export const fetchAllExams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructor/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Error fetching exams: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  
  export const fetchAllQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/instructor/questions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Error fetching questions: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };