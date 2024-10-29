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
