// Exam.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, Input, Modal } from 'antd';

const Exam = ({ classId }) => {
    const [exams, setExams] = useState([]);
    const [showAddExamModal, setShowAddExamModal] = useState(false);
    const [newExamName, setNewExamName] = useState('');
    const [newExamDate, setNewExamDate] = useState('');

    const fetchExams = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/exams/class/${classId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setExams(response.data.exams);
        } catch (error) {
            toast.error('Không thể tải danh sách bài thi!');
        }
    };

    const handleAddExam = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/exams`,
                { name: newExamName, date: newExamDate, classId },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.success('Thêm bài thi thành công!');
            setShowAddExamModal(false);
            fetchExams();
        } catch (error) {
            toast.error('Không thể thêm bài thi!');
        }
    };

    useEffect(() => {
        fetchExams();
    }, [classId]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Danh sách bài thi</h2>
            <Button onClick={() => setShowAddExamModal(true)}>Thêm bài thi</Button>
            {exams.length > 0 ? (
                <ul>
                    {exams.map((exam) => (
                        <li key={exam._id}>{exam.name} - {exam.date}</li>
                    ))}
                </ul>
            ) : (
                <p>Chưa có bài thi nào.</p>
            )}

            <Modal
                title="Thêm Bài Thi"
                visible={showAddExamModal}
                onOk={handleAddExam}
                onCancel={() => setShowAddExamModal(false)}
            >
                <Input
                    placeholder="Tên bài thi"
                    value={newExamName}
                    onChange={(e) => setNewExamName(e.target.value)}
                />
                <Input
                    placeholder="Ngày thi"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                />
            </Modal>
        </div>
    );
};

export default Exam;
