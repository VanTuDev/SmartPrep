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

export const addAdmin = async (newAdmin) => {
  const response = await fetch('http://localhost:5000/api/admin/add_admin_account', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newAdmin), // Send the new admin data in the request body
  });

  if (!response.ok) {
      throw new Error('Failed to add admin.');
  }

  return await response.json();
};

export const updateInstructorState = async (id) => {
  const response = await fetch(`http://localhost:5000/api/admin/deactive_account/${id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
  });

  if (!response.ok) {
      throw new Error('Failed to update instructor state.');
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
        const classes = data.classes;
        return classes;

    } catch (error) {
        // Bắt lỗi trong quá trình fetch
        console.error('Fetch error:', error);
    }
};
  
  export const fetchAllExams = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/get_all_exam_admin', {
        method: 'GET',
        headers: {
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
      const response = await fetch('http://localhost:5000/api/admin/get_all_question_admin', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Error fetching questions: ${response.statusText}`);
      // Chuyển đổi kết quả về dạng JSON

      const data = await response.json();
      const questions = data.questions;
      return questions;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  export const fetchSortedClasses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/get_sorted_classes', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Error fetching classes: ${response.statusText}`);
      // Chuyển đổi kết quả về dạng JSON

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  export const fetchSortedStudentSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/get_sorted_student_submit', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error(`Error fetching classes: ${response.statusText}`);
      // Chuyển đổi kết quả về dạng JSON

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };