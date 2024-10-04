// questionsApi.js

// Lấy danh sách câu hỏi
export const getQuestions = async () => {
    const response = await fetch('http://localhost:5000/api/questions', { // Địa chỉ API của server
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Lưu danh sách câu hỏi
export const saveQuestions = async (questions) => {
    const response = await fetch('http://localhost:5000/api/questions', { // Địa chỉ API của server
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(questions),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
};
