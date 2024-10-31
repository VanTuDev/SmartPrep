import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, InputNumber, message, List, Typography } from 'antd';
import axios from 'axios';

const { Option } = Select;
const { Title, Text } = Typography;

const LibraryModal = ({ isOpen, onClose, onSubmit }) => {
   const [grades, setGrades] = useState([]);
   const [categories, setCategories] = useState([]);
   const [groups, setGroups] = useState([]);
   const [groupData, setGroupData] = useState({});
   const [totalQuestions, setTotalQuestions] = useState(0);
   const [selectedGrade, setSelectedGrade] = useState('');
   const [selectedCategory, setSelectedCategory] = useState('');

   // Fetch Grades on modal open
   useEffect(() => {
      if (isOpen) {
         fetchGrades();
         resetForm();
      }
   }, [isOpen]);

   // Fetch Categories when Grade is selected
   useEffect(() => {
      if (selectedGrade) {
         fetchCategoriesByGrade(selectedGrade);
         resetCategoryAndGroups();
      }
   }, [selectedGrade]);

   // Fetch Groups when Category is selected
   useEffect(() => {
      if (selectedCategory) {
         fetchGroupsByCategory(selectedCategory);
         resetGroups();
      }
   }, [selectedCategory]);

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

         const groupInfo = response.data.reduce((acc, group) => {
            acc[group._id] = { ...group, quantity: 0 };
            return acc;
         }, {});
         setGroups(response.data);
         setGroupData(groupInfo);
      } catch (error) {
         message.error('Lỗi khi lấy danh sách chương!');
      }
   };

   const resetForm = () => {
      setSelectedGrade('');
      setSelectedCategory('');
      setGroups([]);
      setGroupData({});
      setTotalQuestions(0);
   };

   const resetCategoryAndGroups = () => {
      setSelectedCategory('');
      resetGroups();
   };

   const resetGroups = () => {
      setGroups([]);
      setGroupData({});
      setTotalQuestions(0);
   };

   const handleGroupQuantityChange = (groupId, quantity) => {
      setGroupData((prevState) => ({
         ...prevState,
         [groupId]: { ...prevState[groupId], quantity },
      }));

      const total = Object.values(groupData).reduce((sum, group) => sum + group.quantity, 0);
      setTotalQuestions(total);
   };

   const handleLibrarySubmit = async () => {
      try {
         const selectedGroups = Object.entries(groupData)
            .filter(([_, group]) => group.quantity > 0)
            .map(([groupId, group]) => ({
               id: groupId,
               quantity: group.quantity,
            }));

         if (!selectedGrade || !selectedCategory || selectedGroups.length === 0) {
            message.error('Vui lòng chọn đầy đủ khối, môn và ít nhất một chương!');
            return;
         }

         const questionPromises = selectedGroups.map((group) =>
            axios.get(
               `http://localhost:5000/api/instructor/questions/random/${group.id}?quantity=${group.quantity}`,
               { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
         );

         const responses = await Promise.all(questionPromises);
         const randomQuestions = responses.flatMap((res) => res.data.questions);
         onSubmit(randomQuestions); // Truyền câu hỏi về GeneralInformation
         onClose();
      } catch (error) {
         console.error('Error adding questions:', error);
         message.error('Failed to add questions from Library.');
      }
   };


   return (
      <Modal
         title="Thêm Câu Hỏi Ngẫu Nhiên"
         visible={isOpen}
         onCancel={onClose}
         footer={[
            <Button key="submit" type="primary" onClick={handleLibrarySubmit}>
               Thêm Câu Hỏi ({totalQuestions} câu)
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
            <Title level={5}>Chọn Chương và Số Lượng Câu Hỏi</Title>
            <List
               bordered
               dataSource={groups}
               renderItem={(group) => (
                  <List.Item>
                     <div className="flex justify-between items-center w-full">
                        <Text>
                           {group.name} ({group.totalQuestions} câu hỏi)
                        </Text>
                        <InputNumber
                           min={0}
                           value={groupData[group._id]?.quantity || 0}
                           onChange={(value) => handleGroupQuantityChange(group._id, value)}
                        />
                     </div>
                  </List.Item>
               )}
            />
         </div>

         <div className="flex justify-end">
            <Text strong>Tổng số câu hỏi: {totalQuestions}</Text>
         </div>
      </Modal>
   );
};

export default LibraryModal;
