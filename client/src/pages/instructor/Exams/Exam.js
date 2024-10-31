import React, { useState, useEffect } from 'react';
import { message, Button, List } from 'antd';
import { FolderAddOutlined } from '@ant-design/icons';
import axios from 'axios';

function Exams() {
   const [exams, setExams] = useState([]);
   const [loading, setLoading] = useState(false);

   // Fetch danh sách các bài kiểm tra
   const fetchExams = async () => {
      setLoading(true);
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/exams');
         setExams(response.data);
         message.success('Fetched exams successfully!');
      } catch (error) {
         console.error('Error fetching exams:', error);
         message.error('Failed to fetch exams.');
      } finally {
         setLoading(false);
      }
   };

   // Gọi API khi component mount
   useEffect(() => {
      fetchExams();
   }, []);

   // Tạo một bài kiểm tra mới
   const handleCreateExam = async () => {
      try {
         const response = await axios.post(
            'http://localhost:5000/api/instructor/exams/create',
            { title: 'New Exam', description: 'New exam description' },
            { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } }
         );
         setExams([...exams, response.data]);
         message.success('Exam created successfully!');
      } catch (error) {
         console.error('Error creating exam:', error);
         message.error('Failed to create exam.');
      }
   };

   return (
      <div className="w-6/12 container mx-auto p-6">
         <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">Exams</h1>
            <Button
               type="primary"
               icon={<FolderAddOutlined />}
               onClick={handleCreateExam}
            >
               Create Exam
            </Button>
         </div>

         <List
            loading={loading}
            bordered
            dataSource={exams}
            renderItem={(exam) => (
               <List.Item>
                  <div>
                     <strong>{exam.title}</strong> - {exam.description}
                  </div>
               </List.Item>
            )}
         />
      </div>
   );
}

export default Exams;
