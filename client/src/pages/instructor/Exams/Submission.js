import { useState, useEffect } from 'react';
import { Input, Typography, Avatar, Drawer, message } from 'antd';
import SubmissionDetail from './SubmissionDetail'; // Drawer hiển thị chi tiết bài nộp

const { Search } = Input;
const { Text } = Typography;

function Submission({ examId }) {
   const [submissions, setSubmissions] = useState([]); // Lưu danh sách bài nộp
   const [drawerVisible, setDrawerVisible] = useState(false); // Điều khiển Drawer
   const [selectedSubmission, setSelectedSubmission] = useState(null); // Bài nộp được chọn

   // Fetch data khi component mount
   useEffect(() => {
      fetchSubmissions();
   }, [examId]);

   const fetchSubmissions = async () => {
      try {
         // Giả sử gọi API để lấy danh sách bài nộp
         const response = []; // Thay bằng API call thực tế
         setSubmissions(response);
      } catch (error) {
         message.error('Failed to load submissions');
      }
   };

   const handleRowClick = (submission) => {
      setSelectedSubmission(submission);
      setDrawerVisible(true);
   };

   const closeDrawer = () => {
      setDrawerVisible(false);
      setSelectedSubmission(null);
   };

   return (
      <div className="w-5/6 mx-auto mt-5">
         <div className="mb-4">
            <Search
               size="large"
               placeholder="Type search keywords"
               style={{ width: 300 }}
            />
         </div>
         <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
               <thead className="text-xs text-gray-700 uppercase border-b">
                  <tr>
                     <th scope="col" className="px-3 py-3"></th>
                     <th scope="col" className="px-2 py-3">Student</th>
                     <th scope="col" className="px-6 py-3">Class</th>
                     <th scope="col" className="px-6 py-3">Submission Deadline</th>
                     <th scope="col" className="px-6 py-3 text-center">Chosen Answer</th>
                     <th scope="col" className="px-6 py-3 text-center">Correct Answer</th>
                     <th scope="col" className="px-6 py-3 text-center">Grade</th>
                  </tr>
               </thead>
               <tbody>
                  {submissions.length > 0 ? (
                     submissions.map((submission) => (
                        <tr
                           key={submission.id}
                           className="bg-white border-b hover:bg-gray-50 cursor-pointer"
                           onClick={() => handleRowClick(submission)}
                        >
                           <td className="px-2 text-center">
                              <Avatar size="large" src={<img alt="avatar" />} />
                           </td>
                           <td className="px-2 py-4">
                              <div className="flex flex-col">
                                 <Text className="font-medium text-gray-900">{submission.studentName}</Text>
                                 <Text className="text-gray-500">{submission.studentEmail}</Text>
                              </div>
                           </td>
                           <td className="px-6 py-4">{submission.className}</td>
                           <td className="px-6 py-4">{submission.deadline}</td>
                           <td className="text-center">{submission.chosenAnswer}</td>
                           <td className="text-center">{submission.correctAnswer}</td>
                           <td className="text-center">{submission.grade}</td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="7" className="text-center py-4">
                           No submissions found for this test
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* Drawer hiển thị chi tiết bài nộp */}
         <Drawer
            title="Submission Details"
            visible={drawerVisible}
            onClose={closeDrawer}
            width={640}
         >
            <SubmissionDetail submission={selectedSubmission} />
         </Drawer>
      </div>
   );
}

export default Submission;
