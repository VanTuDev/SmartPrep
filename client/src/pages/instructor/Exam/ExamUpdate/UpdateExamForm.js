import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
   Input, Typography, Row, Col, DatePicker, TimePicker, InputNumber,
   Button, message, Divider,
   List,
   Avatar,
   Card,
   Popover
} from 'antd';
import { CloseCircleOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Captions, Pencil } from 'lucide-react';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import QuestionAdding from '../ExamCreate/QuestionAdding';
import QuestionCard from '../../../../components/Card/QuestionCard/index';
import ExamHeader from '../ExamCreate/ExamHeader';
const { TextArea } = Input;
const { Title } = Typography;

const UpdateExamForm = () => {
   const { examId } = useParams();
   const navigate = useNavigate();
   const [title, setTitle] = useState('');
   const [description, setDescription] = useState('');
   const [isPublic, setIsPublic] = useState(false);
   const [duration, setDuration] = useState(60);
   const [startDate, setStartDate] = useState(null);
   const [startTime, setStartTime] = useState(null);
   const [endDate, setEndDate] = useState(null);
   const [endTime, setEndTime] = useState(null);
   const [questions, setQuestions] = useState([]);
   const [loading, setLoading] = useState(false);
   const [userProfile, setUserProfile] = useState(null);
   const [comments, setComments] = useState([]);
   const [newComment, setNewComment] = useState('');
   const [editCommentId, setEditCommentId] = useState(null);
   const [editContent, setEditContent] = useState('');
   const [replyContent, setReplyContent] = useState('');
   const [replyToCommentId, setReplyToCommentId] = useState(null);

   const PROFILE_URL = 'http://localhost:5000/api/users/profile';
   const COMMENTS_URL = `http://localhost:5000/api/comments`;

   useEffect(() => {
      const fetchExamData = async () => {
         try {
            const response = await axios.get(`http://localhost:5000/api/instructor/test/${examId}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const examData = response.data;

            setTitle(examData.title);
            setDescription(examData.description);
            setIsPublic(examData.access_type === 'public');
            setDuration(examData.duration);
            setStartDate(dayjs(examData.start_date));
            setStartTime(dayjs(examData.start_date));
            setEndDate(dayjs(examData.end_date));
            setEndTime(dayjs(examData.end_date));
            setQuestions(examData.questions_id || []);
         } catch (error) {
            console.error('Failed to fetch exam data:', error);
         }
      };
      fetchExamData();
   }, [examId]);

   // Fetch user profile data
   useEffect(() => {
      const fetchUserProfile = async () => {
         try {
            const response = await fetch(PROFILE_URL, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });

            if (response.ok) {
               const profileData = await response.json();
               setUserProfile(profileData);
            } else {
               const error = await response.json();
               message.error(error.message || 'Lỗi khi lấy dữ liệu người dùng!');
            }
         } catch (error) {
            console.error('Lỗi khi lấy dữ liệu người dùng:', error);
            message.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu người dùng!');
         }
      };

      fetchUserProfile();
   }, []);

   const fetchComments = async () => {
      try {
         const response = await axios.get(`${COMMENTS_URL}?test_id=${examId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
         });
         setComments(response.data);
      } catch (error) {
         console.error('Error fetching comments:', error);
         message.error('Failed to load comments.');
      }
   };

   useEffect(() => {
      fetchComments();
   }, []);

   const validateExam = () => {
      if (!title.trim() || !description.trim() || questions.length === 0) {
         message.error('Please fill out all required fields (title, description, and questions).');
         return false;
      }
      if (startDate && endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
         message.error('End date must be after the start date.');
         return false;
      }
      if (startDate && startTime && endDate && endTime) {
         const start = dayjs(startDate).set('hour', startTime.hour()).set('minute', startTime.minute());
         const end = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute());
         if (end.isBefore(start)) {
            message.error('End time must be after the start time.');
            return false;
         }
      }
      return true;
   };

   const handleUpdateExam = async () => {
      if (!validateExam()) return;
      try {
         setLoading(true);
         const start = dayjs(startDate).set('hour', startTime.hour()).set('minute', startTime.minute());
         const end = dayjs(endDate).set('hour', endTime.hour()).set('minute', endTime.minute());

         const updatedExamData = {
            title: title.trim(),
            description: description.trim(),
            access_type: isPublic ? 'public' : 'private',
            duration: Number(duration),
            start_date: start.toISOString(),
            end_date: end.toISOString(),
            questions: questions,
         };

         await axios.put(`http://localhost:5000/api/instructor/test/update/${examId}`, updatedExamData, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         });
         message.success('Exam updated successfully!');
         navigate("/instructor/dashboard");
      } catch (error) {
         console.error('Failed to update exam:', error);
         message.error('Failed to update exam');
      } finally {
         setLoading(false);
      }
   };

   const addRandomQuestions = (newQuestions) => {
      setQuestions((prevQuestions) => [...new Set([...prevQuestions, ...newQuestions])]);
      message.success('Random questions added successfully!');
   };

   const addSelectedQuestions = (selectedQuestions) => {
      setQuestions((prevQuestions) => [...new Set([...prevQuestions, ...selectedQuestions])]);
      message.success('Selected questions added successfully!');
   };

   const handleUpdateQuestion = (updatedQuestion) => {
      setQuestions(prevQuestions =>
         prevQuestions.map(q => (q._id === updatedQuestion._id ? updatedQuestion : q))
      );
   };

   const handleRemoveQuestion = (questionId) => {
      setQuestions(prevQuestions => prevQuestions.filter(q => q._id !== questionId));
   };

   const disabledDate = (current) => current && current.isBefore(dayjs(), 'day');

   const addComment = async () => {
      if (!newComment) {
         message.error('Comment content cannot be empty.');
         return;
      }

      if (!userProfile || !userProfile._id) {
         message.error('User profile data is missing.');
         return;
      }

      try {
         const response = await axios.post(COMMENTS_URL, {
            test_id: examId,          // Exam ID related to the comment
            user_id: userProfile._id,  // Ensure user ID is sent
            content: newComment
         }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
         });

         if (response.status === 201 || response.status === 200) {
            setNewComment('');
            fetchComments();
            message.success('Comment added successfully');
         } else {
            message.error('Failed to add comment');
         }
      } catch (error) {
         console.error('Error adding comment:', error.response?.data || error.message);
         message.error(error.response?.data?.message || 'Failed to add comment');
      }
   };

   const editComment = async (commentId) => {
      try {
         const response = await fetch(`${COMMENTS_URL}/${commentId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ content: editContent, user_id: userProfile._id }),
         });
         if (response.ok) {
            setEditCommentId(null);
            setEditContent('');
            fetchComments();
            message.success('Bình luận đã được cập nhật');
         } else {
            message.error('Lỗi khi cập nhật bình luận');
         }
      } catch (error) {
         message.error('Đã xảy ra lỗi khi cập nhật bình luận!');
      }
   };

   const deleteComment = async (commentId) => {
      try {
         const response = await fetch(`${COMMENTS_URL}/${commentId}`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ user_id: userProfile._id, role: userProfile.role }),
         });
         if (response.ok) {
            fetchComments();
            message.success('Bình luận đã được xóa');
         } else {
            message.error('Lỗi khi xóa bình luận');
         }
      } catch (error) {
         message.error('Đã xảy ra lỗi khi xóa bình luận!');
      }
   };

   // Reply to a comment
   const replyToComment = async (commentId) => {
      if (!replyContent) return;
      try {
         const response = await fetch(`${COMMENTS_URL}/${commentId}/reply`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ user_id: userProfile._id, content: replyContent }),
         });
         if (response.ok) {
            setReplyContent('');
            setReplyToCommentId(null); // Reset after reply
            fetchComments();
            message.success('Đã trả lời bình luận');
         } else {
            message.error('Lỗi khi trả lời bình luận');
         }
      } catch (error) {
         console.error('Lỗi khi trả lời bình luận:', error);
         message.error('Đã xảy ra lỗi khi trả lời bình luận!');
      }
   };

   // Hàm xóa reply của chính mình từ frontend
   const deleteReply = async (commentId, replyId) => {
      if (!replyId) {
         console.error('replyId is undefined'); // Thêm dòng này để kiểm tra
         return; // Dừng nếu replyId chưa được truyền
      }

      try {
         const response = await fetch(`${COMMENTS_URL}/${commentId}/reply/${replyId}`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ user_id: userProfile._id, role: userProfile.role })
         });

         if (response.ok) {
            fetchComments(); // Tải lại danh sách bình luận
            message.success('Reply đã được xóa');
         } else {
            const errorData = await response.json();
            message.error(errorData.error || 'Lỗi khi xóa reply');
         }
      } catch (error) {
         console.error('Lỗi khi xóa reply:', error);
         message.error('Đã xảy ra lỗi khi xóa reply');
      }
   };

   const commentActions = (comment) => (
      <div className="flex space-x-2">
         {comment.user_id && comment.user_id._id === userProfile?._id && (
            <Button icon={<EditOutlined />} onClick={() => {
               setEditCommentId(comment._id);
               setEditContent(comment.content);
            }} type="text">Sửa</Button>
         )}
         <Button icon={<DeleteOutlined />} onClick={() => deleteComment(comment._id)} type="text" danger>Xóa</Button>
         <Button
            onClick={() => setReplyToCommentId(comment._id)}
            type="text"
         >
            Trả lời
         </Button>
      </div>
   );

   const replyActions = (commentId, reply) => (
      <div className="flex space-x-2">
         {reply?.user_id && reply.user_id._id === userProfile?._id && (
            <Button
               icon={<EditOutlined />}
               onClick={() => {
                  setEditCommentId(reply._id);
                  setEditContent(reply.content);
               }}
               type="text"
            >
               Sửa
            </Button>
         )}
         <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteReply(commentId, reply._id)}
            type="text"
            danger
         >
            Xóa
         </Button>

      </div>
   );

   return (
      <>
         <ExamHeader
            items={[
               { key: 'general', label: 'General' },
               { key: 'submission', label: 'Submissions' },
            ]}
            onChangeTab={(key) =>
               navigate(
                  key === 'general'
                     ? `/instructor/exam/${examId}/update`
                     : `/instructor/exam/submissions/${examId}`
               )
            }
            currentTab="general"
         />

         <div className="exam-update-layout pt-30  " style={{ display: 'flex', height: '100vh' }}>

            {/* Question Management Section (Scrollable on the left, occupying 2/5 of the width) */}
            <div className='pt-45' style={{
               width: '40%',
               height: '100vh',
               overflowY: 'auto',
               padding: '1rem',
               borderRight: '1px solid #f0f0f0',
            }}>
               <Divider orientation="left">Manage Questions</Divider>
               {questions.map((question, index) => (
                  <QuestionCard
                     key={question._id || index}
                     question={question}
                     index={index}
                     onUpdate={handleUpdateQuestion}
                     onRemove={handleRemoveQuestion}
                  />
               ))}
               <QuestionAdding onAddRandomQuestions={addRandomQuestions} onAddSelectedQuestions={addSelectedQuestions} />
            </div>

            {/* Exam Info Section (Fixed width on the right, occupying 3/5 of the width) */}
            <div style={{
               width: '60%',
               padding: '2rem'
            }}>
               <Title level={4}>Update Exam Information</Title>
               <div className="flex items-start w-full rounded-lg p-2">
                  <Captions className="primary-color" />
                  <Input
                     className="mx-4 input-custom"
                     size="large"
                     placeholder="Test title"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                  />
               </div>
               <div className="flex items-start w-full rounded-lg p-2">
                  <Pencil className="primary-color" />
                  <TextArea
                     className="mx-4 input-custom"
                     value={description}
                     onChange={(e) => setDescription(e.target.value)}
                     placeholder="Brief description"
                     autoSize={{ minRows: 3, maxRows: 5 }}
                  />
               </div>
               <Divider orientation="left">Time Setup</Divider>
               <Row gutter={16}>
                  <Col span={12}>
                     <Title level={5}>Start Date & Time</Title>
                     <DatePicker
                        placeholder="Select Start Date"
                        value={startDate}
                        onChange={setStartDate}
                        className="w-full mb-2"
                        disabledDate={disabledDate}
                     />
                     <TimePicker
                        placeholder="Select Start Time"
                        value={startTime}
                        onChange={setStartTime}
                        className="w-full"
                     />
                  </Col>
                  <Col span={12}>
                     <Title level={5}>End Date & Time</Title>
                     <DatePicker
                        placeholder="Select End Date"
                        value={endDate}
                        onChange={setEndDate}
                        className="w-full mb-2"
                        disabledDate={disabledDate}
                     />
                     <TimePicker
                        placeholder="Select End Time"
                        value={endTime}
                        onChange={setEndTime}
                        className="w-full"
                     />
                  </Col>
               </Row>
               <Row className="mt-4">
                  <Col span={12}>
                     <Title level={5}>Duration (minutes)</Title>
                     <InputNumber
                        value={duration}
                        onChange={setDuration}
                        className="w-full"
                        placeholder="Enter duration in minutes"
                     />
                  </Col>
               </Row>
               <div className="mt-4">
                  <Button type="primary" onClick={handleUpdateExam} loading={loading} style={{ width: '100%' }}>
                     Update Exam
                  </Button>
               </div>
               {/* Comment Section */}
               <Divider orientation="left">Comments</Divider>
               <List
                  dataSource={comments}
                  renderItem={(comment) => (
                     <div key={comment._id} className="flex flex-col space-y-3">
                        <List.Item className="flex items-start space-x-3">
                           <Avatar
                              src={
                                 comment.user_id?.profile
                                    ? comment.user_id.profile.startsWith('http')
                                       ? comment.user_id.profile
                                       : `http://localhost:5000/uploads/${comment.user_id.profile}`
                                    : 'https://via.placeholder.com/150'
                              }
                              alt="User Avatar"
                              size={50}
                           />
                           <Card className="flex-1 bg-gray-50" bordered={false}>
                              <div className="flex justify-between">
                                 <div>
                                    <p className="font-semibold">{comment.user_id?.username || 'Người dùng'}</p>
                                    {editCommentId === comment._id ? (
                                       <>
                                          <TextArea
                                             rows={2}
                                             value={editContent}
                                             onChange={(e) => setEditContent(e.target.value)}
                                             className="mt-2 mb-2"
                                          />
                                          <Button onClick={() => editComment(comment._id)} type="primary" size="small" className="mr-2">
                                             Lưu
                                          </Button>
                                          <Button onClick={() => setEditCommentId(null)} size="small">
                                             Hủy
                                          </Button>
                                       </>
                                    ) : (
                                       <p>{comment.content}</p>
                                    )}
                                 </div>
                                 <Popover content={commentActions(comment)} trigger="click">
                                    <Button icon={<MoreOutlined />} type="text" />
                                 </Popover>
                              </div>
                           </Card>
                        </List.Item>

                        {comment.replies && comment.replies.length > 0 && (
                           <List
                              className="ml-12"
                              dataSource={comment.replies}
                              renderItem={(reply, idx) => (
                                 <List.Item key={idx} className="flex items-start space-x-3">
                                    <Avatar
                                       src={
                                          reply.user_id?.profile
                                             ? reply.user_id.profile.startsWith('http')
                                                ? reply.user_id.profile
                                                : `http://localhost:5000/uploads/${reply.user_id.profile}`
                                             : 'https://via.placeholder.com/150'
                                       }
                                       size={40}
                                    />
                                    <Card className="flex-1 bg-gray-100 p-2 rounded-md" bordered={false}>
                                       <div className="flex justify-between">
                                          <div>
                                             <p className="font-semibold">{reply.user_id?.username || 'Người dùng'}</p>
                                             {editCommentId === reply._id ? (
                                                <>
                                                   <TextArea
                                                      rows={2}
                                                      value={editContent}
                                                      onChange={(e) => setEditContent(e.target.value)}
                                                      className="mt-2 mb-2"
                                                   />
                                                   <Button onClick={() => editComment(reply._id)} type="primary" size="small" className="mr-2">
                                                      Lưu
                                                   </Button>
                                                   <Button onClick={() => setEditCommentId(null)} size="small">
                                                      Hủy
                                                   </Button>
                                                </>
                                             ) : (
                                                <p>{reply.content}</p>
                                             )}
                                          </div>
                                          <Popover content={replyActions(comment._id, reply)} trigger="click">
                                             <Button icon={<MoreOutlined />} type="text" />
                                          </Popover>
                                       </div>
                                    </Card>
                                 </List.Item>
                              )}
                           />
                        )}

                        {replyToCommentId === comment._id && (
                           <div className="ml-12 mt-2">
                              <TextArea
                                 rows={2}
                                 value={replyContent}
                                 onChange={(e) => setReplyContent(e.target.value)}
                                 placeholder="Nhập câu trả lời của bạn..."
                              />
                              <Button onClick={() => replyToComment(comment._id)} type="primary" className="mt-2">
                                 Gửi trả lời
                              </Button>
                              <Button onClick={() => setReplyToCommentId(null)} danger className="mt-2 ml-4">
                                 Hủy
                              </Button>
                           </div>
                        )}
                     </div>
                  )}
               />
               <TextArea rows={4} value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." className="mt-4" />
               <Button onClick={addComment} type="primary" className="mt-2">Gửi bình luận</Button>
            </div>
         </div>
      </>
   );
};


export default UpdateExamForm;
