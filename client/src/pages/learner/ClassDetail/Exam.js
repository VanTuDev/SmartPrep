// Exam.js
import { useState, useEffect } from 'react';
import axios from 'axios';
//import CardExamInClass from './CardExcamInClass';
import CardExamInClass from './CardExamInClass';
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import AllTestsTab from './AllTestsTab';
import CalendarTab from './CalendarTab';


const Exam = ({ classId }) => {
    const [classExams, setClassExams] = useState([]);
    const [grades, setGrades] = useState({});
    const [subjects, setSubjects] = useState({});


    useEffect(() => {
        fetchClassExams();
        fetchGrades();
        fetchSubjects();
    }, [classId]);

    const fetchClassExams = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/instructor/test/classroom/${classId}/tests`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
        <div className="w-full flex px-4 mt-0">
            <div className="w-full">
                <Tabs defaultActiveKey="allTests">
                    <TabPane tab="Danh sách bài kiểm tra" key="allTests">
                        <AllTestsTab exams={classExams} grades={grades} subjects={subjects} />
                    </TabPane>
                    <TabPane tab="Lịch" key="calendar">
                        <CalendarTab exams={classExams} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default Exam;