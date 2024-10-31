import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, message, List, Typography, Checkbox, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;

const LibrarySingleModal = ({ isOpen, onClose, onSubmit }) => {
   const [grades, setGrades] = useState([]);
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);
   const [questions, setQuestions] = useState([]);
   const [loading, setLoading] = useState(false);
   const [selectedQuestions, setSelectedQuestions] = useState([]);
   const [selectedGrade, setSelectedGrade] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('');
   const [selectedGroup, setSelectedGroup] = useState('');

   // Fetch Grades when modal opens
   useEffect(() => {
      if (isOpen) {
         fetchGrades();
         resetForm();
      }
   }, [isOpen]);

   // Fetch Categories when Grade changes
   useEffect(() => {
      if (selectedGrade) {
         fetchCategoriesByGrade(selectedGrade);
         setSelectedCategory('');
      }
   }, [selectedGrade]);

   // Fetch Groups when Category changes
   useEffect(() => {
      if (selectedCategory) {
         fetchGroupsByCategory(selectedCategory);
         setSelectedGroup('');
      }
   }, [selectedCategory]);

   // Fetch Questions when Group changes
   useEffect(() => {
      if (selectedGroup) {
         fetchQuestionsByGroup(selectedGroup);
      }
   }, [selectedGroup]);

   const fetchGrades = async () => {
      try {
         const response = await axios.get('http://localhost:5000/api/instructor/grades/getAll', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setGrades(response.data);
      } catch (error) {
         message.error('Lỗi khi lấy danh sách khối!');
      }
   };

   const fetchCategoriesByGrade = async (gradeId) => {
      try {
         const response = await axios.get(
            'http://localhost:5000/api/instructor/category/getCategoryByGrade',
            {
               params: { grade_id: gradeId },
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
         );
         setCategories(response.data);
      } catch (error) {
         message.error('Lỗi khi lấy danh sách môn!');
      }
   };

   const fetchGroupsByCategory = async (categoryId) => {
      try {
         const response = await axios.get(
            'http://localhost:5000/api/instructor/groups/byCategory',
            {
               params: { category_id: categoryId },
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
         );
         setGroups(response.data);
      } catch (error) {
         message.error('Lỗi khi lấy danh sách chương!');
      }
   };

   const fetchQuestionsByGroup = async (groupId) => {
      setLoading(true);
      try {
         const response = await axios.get(
            `http://localhost:5000/api/instructor/questions/group/${groupId}`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
         );

         console.log('Fetched Questions:', response.data);
         setQuestions(response.data); // Set questions directly if response is an array
         setSelectedQuestions([]); // Reset selected questions
      } catch (error) {
         console.error('Error fetching questions by group:', error);
         message.error('Lỗi khi lấy danh sách câu hỏi!');
      } finally {
         setLoading(false);
      }
   };

   const resetForm = () => {
      setSelectedGrade('');
      setSelectedCategory('');
      setSelectedGroup('');
      setQuestions([]);
      setSelectedQuestions([]);
   };

   const handleSelectAll = (e) => {
      if (e.target.checked) {
         setSelectedQuestions(questions.map((q) => q._id));
      } else {
         setSelectedQuestions([]);
      }
   };

   const handleQuestionSelect = (questionId) => {
      setSelectedQuestions((prevSelected) =>
         prevSelected.includes(questionId)
            ? prevSelected.filter((id) => id !== questionId)
            : [...prevSelected, questionId]
      );
   };

   const handleLibrarySubmit = () => {
      if (selectedQuestions.length === 0) {
         message.error('Vui lòng chọn ít nhất một câu hỏi!');
         return;
      }
      const selectedQuestionObjects = questions.filter((q) =>
         selectedQuestions.includes(q._id)
      );
      onSubmit(selectedQuestionObjects); // Send selected questions to parent
      onClose();
   };

   return (
      <Modal
         title="Chọn Câu Hỏi Từ Thư Viện"
         open={isOpen}
         onCancel={onClose}
         footer={[
            <Button key="submit" type="primary" onClick={handleLibrarySubmit}>
               Thêm Câu Hỏi ({selectedQuestions.length})
            </Button>,
            <Button key="cancel" onClick={onClose}>
               Hủy
            </Button>,
         ]}
         width={800}
         centered
      >
         <div className="mb-4">
            <Title level={5}>Chọn Khối</Title>
            <Select
               placeholder="Chọn khối"
               className="w-full"
               value={selectedGrade}
               onChange={setSelectedGrade}
            >
               {grades.map((grade) => (
                  <Option key={grade._id} value={grade._id}>
                     {grade.name}
                  </Option>
               ))}
            </Select>
         </div>

         <div className="mb-4">
            <Title level={5}>Chọn Môn</Title>
            <Select
               placeholder="Chọn môn học"
               className="w-full"
               value={selectedCategory}
               onChange={setSelectedCategory}
               disabled={!categories.length}
            >
               {categories.map((category) => (
                  <Option key={category._id} value={category._id}>
                     {category.name}
                  </Option>
               ))}
            </Select>
         </div>

         <div className="mb-4">
            <Title level={5}>Chọn Chương</Title>
            <Select
               placeholder="Chọn chương"
               className="w-full"
               value={selectedGroup}
               onChange={setSelectedGroup}
               disabled={!groups.length}
            >
               {groups.map((group) => (
                  <Option key={group._id} value={group._id}>
                     {group.name}
                  </Option>
               ))}
            </Select>
         </div>

         <div className="mb-4">
            <Title level={5}>Danh Sách Câu Hỏi</Title>
            <Checkbox onChange={handleSelectAll}>Chọn tất cả</Checkbox>
            {loading ? (
               <Spin className="w-full text-center" />
            ) : (
               <List
                  bordered
                  dataSource={questions}
                  locale={{ emptyText: 'Không có câu hỏi nào.' }}
                  renderItem={(question) => (
                     <List.Item key={question._id}>
                        <Checkbox
                           checked={selectedQuestions.includes(question._id)}
                           onChange={() => handleQuestionSelect(question._id)}
                        >
                           {question.question_text}
                        </Checkbox>
                     </List.Item>
                  )}
               />
            )}
         </div>
      </Modal>
   );
};

export default LibrarySingleModal;