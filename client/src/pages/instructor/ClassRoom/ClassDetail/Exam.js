import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MiniExamCard from 'components/Card/MiniExamCard/MiniExamCard';

const Exam = () => {
    const { classId } = useParams();  // Lấy classId từ URL
    const [classExams, setClassExams] = useState([]);
    const [grades, setGrades] = useState({});
    const [subjects, setSubjects] = useState({});

    useEffect(() => {
        fetchClassExamsForLearner();
    }, [classId]);

    const fetchClassExamsForLearner = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/learner/test/classroom/${classId}/tests`,  // Route mới dành cho học sinh
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setClassExams(response.data);

            // Lấy các id lớp duy nhất để tìm tên các khối và môn học
            const uniqueGradeIds = [...new Set(response.data.map((exam) => exam.grade_id))];
            await fetchGradesByIds(uniqueGradeIds);
            await fetchSubjectsByGrades(uniqueGradeIds);
        } catch (error) {
            console.error('Error fetching exams for the class:', error);
        }
    };

    const fetchGradesByIds = async (gradeIds) => {
        try {
            const gradesData = {};
            for (const gradeId of gradeIds) {
                const response = await axios.get(
                    `http://localhost:5000/api/instructor/grades/get/${gradeId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );
                gradesData[gradeId] = response.data.name;
            }
            setGrades(gradesData);
        } catch (error) {
            console.error('Error fetching grades:', error);
        }
    };

    const fetchSubjectsByGrades = async (gradeIds) => {
        try {
            const subjectsData = {};
            for (const gradeId of gradeIds) {
                const response = await axios.get(
                    `http://localhost:5000/api/instructor/category/getCategoryByGrade?grade_id=${gradeId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );

                response.data.forEach((subject) => {
                    subjectsData[subject._id] = subject.name;
                });
            }
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
                                <MiniExamCard
                                    key={exam._id}
                                    exam={exam}
                                    grades={grades}
                                    subjects={subjects}
                                    onUpdate={null}  // Không cần chức năng chỉnh sửa cho học sinh
                                    onDelete={null}  // Không cần chức năng xóa cho học sinh
                                />
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
