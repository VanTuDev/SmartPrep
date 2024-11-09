// Exam.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import CardExamInClass from './CardExcamInClass';

const Exam = ({ classId }) => {
    const [classExams, setClassExams] = useState([]);
    const [grades, setGrades] = useState({});
    const [subjects, setSubjects] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (classId) {
            fetchClassExams();
            fetchGrades();
            fetchSubjects();
        }
    }, [classId]);

    const fetchClassExams = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/instructor/test/classroom/${classId}/tests`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log('Fetched Exams:', response.data); // Kiểm tra dữ liệu trả về từ API
            setClassExams(response.data);
        } catch (error) {
            console.error('Error fetching exams for the class:', error);
        }
    };

    const fetchGrades = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/instructor/grades`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const gradesData = response.data.reduce((acc, grade) => {
                acc[grade._id] = grade.name;
                return acc;
            }, {});
            console.log('Fetched Grades:', gradesData); // Kiểm tra dữ liệu trả về của grades
            setGrades(gradesData);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/instructor/categories`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const subjectsData = response.data.reduce((acc, subject) => {
                acc[subject._id] = subject.name;
                return acc;
            }, {});
            console.log('Fetched Subjects:', subjectsData); // Kiểm tra dữ liệu trả về của subjects
            setSubjects(subjectsData);
        } catch (error) {
            console.error('Error fetching subjects:', error);
        }
    };

    return (
        <div className="w-full flex justify-center items-start mt-0">
            <div className="w-10/12">
                <div className="mt-6">
                    <h1 className="text-xl font-semibold text-gray-700">Danh sách bài kiểm tra</h1>
                    <div className="border-b border-gray-300 my-4"></div>
                    {classExams.length > 0 ? (
                        <div className="grid grid-cols-4 gap-6">
                            {classExams.map((exam) => (
                                <CardExamInClass key={exam._id} exam={exam} grades={grades} subjects={subjects} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center mt-12">
                            <img src="/image/noExam.png" alt="No Exams" className="h-40 mb-6" />
                            <p className="text-gray-300 text-lg">Hiện tại không có bài kiểm tra nào</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Exam;
