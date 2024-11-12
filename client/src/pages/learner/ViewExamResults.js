import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Button, Input, Modal, message, Divider, Tag, Popover, Avatar } from 'antd';
import { CloseCircleOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import "tailwindcss/tailwind.css";
import HeaderComponent from '../../components/learner/LearnerHeader';

const { TextArea } = Input;

const ViewExamResults = () => {
   const { submissionId } = useParams();
   const [submissionData, setSubmissionData] = useState(null);
   const [userProfile, setUserProfile] = useState(null);
   const [comments, setComments] = useState([]);
   const [newComment, setNewComment] = useState('');
   const [editCommentId, setEditCommentId] = useState(null);
   const [editContent, setEditContent] = useState('');
   const [replyContent, setReplyContent] = useState('');
   const [replyToCommentId, setReplyToCommentId] = useState(null);
   const navigate = useNavigate();

   const SUBMISSION_URL = `http://localhost:5000/api/submissions/${submissionId}`;
   const PROFILE_URL = 'http://localhost:5000/api/users/profile';
   const COMMENTS_URL = `http://localhost:5000/api/comments`;

   // Fetch submission data
   useEffect(() => {
      const fetchSubmissionData = async () => {
         try {
            const response = await fetch(SUBMISSION_URL, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
               },
            });

            if (response.ok) {
               const data = await response.json();
               setSubmissionData(data);
            } else {
               const error = await response.json();
               message.error(error.message || 'Lỗi khi lấy dữ liệu kết quả bài thi!');
            }
         } catch (error) {
            console.error('Lỗi khi lấy dữ liệu bài thi:', error);
            message.error('Đã xảy ra lỗi trong quá trình lấy dữ liệu bài thi!');
         }
      };

      if (submissionId) {
         fetchSubmissionData();
      }
   }, [submissionId]);

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

   // Fetch comments
   const fetchComments = async () => {
      try {
         const response = await fetch(`${COMMENTS_URL}?test_id=${submissionData.test_id._id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
         });
         if (response.ok) {
            const data = await response.json();
            setComments(data);
         } else {
            message.error('Lỗi khi lấy danh sách bình luận');
         }
      } catch (error) {
         message.error('Đã xảy ra lỗi khi lấy danh sách bình luận!');
      }
   };

   useEffect(() => {
      if (submissionData) fetchComments();
   }, [submissionData]);

   const addComment = async () => {
      if (!newComment) return;
      try {
         const response = await fetch(COMMENTS_URL, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ test_id: submissionData.test_id._id, user_id: userProfile._id, content: newComment }),
         });
         if (response.ok) {
            setNewComment('');
            fetchComments();
            message.success('Bình luận đã được thêm');
         } else {
            message.error('Lỗi khi thêm bình luận');
         }
      } catch (error) {
         message.error('Đã xảy ra lỗi khi thêm bình luận!');
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
            <>
               <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                     setEditCommentId(comment._id);
                     setEditContent(comment.content);
                  }}
                  type="text"
               >
                  Sửa
               </Button>
               <Button
                  icon={<DeleteOutlined />}
                  onClick={() => deleteComment(comment._id)}
                  type="text"
                  danger
               >
                  Xóa
               </Button>
            </>
         )}
         <Button onClick={() => setReplyToCommentId(comment._id)} type="text">
            Trả lời
         </Button>
      </div>
   );

   const replyActions = (commentId, reply) => (
      <div className="flex space-x-2">
         {reply?.user_id && reply.user_id._id === userProfile?._id && (
            <>
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
               <Button
                  icon={<DeleteOutlined />}
                  onClick={() => deleteReply(commentId, reply._id)}
                  type="text"
                  danger
               >
                  Xóa
               </Button>
            </>
         )}
         <Button onClick={() => setReplyToCommentId(reply._id)} type="text">
            Trả lời
         </Button>
      </div>
   );

   if (!submissionData || !userProfile) {
      return (
         <div className="flex justify-center items-center min-h-screen">
            <div className="text-lg font-medium text-gray-600">Đang tải dữ liệu...</div>
         </div>
      );
   }

   const totalQuestions = submissionData.questions.length;
   const correctAnswersCount = submissionData.questions.filter(
      (q) => q.is_correct
   ).length;

   const score = ((correctAnswersCount / totalQuestions) * 10).toFixed(2);


   return (
      <div>
         <HeaderComponent />
         <div className='flex justify-around py-6 shadow-sm bg-slate-200'>
            <div />
            <div className="text-2xl">
               <p>Kết quả bài kiểm tra</p>
            </div>
            <div>
               <Button
                  type="primary"
                  onClick={() => navigate(-1)}
                  icon={<ArrowLeft size={16} />}
                  className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
               >
                  Quay lại
               </Button>
            </div>
         </div>

         <div className="min-h-screen bg-gray-100 flex justify-center">
            <div className="w-7/12 max-w-screen-lg mx-auto py-6">
               <div className="mb-6 bg-gray-200 p-4 border-collapse rounded-xl">
                  <div className="h-16 flex flex-col justify-between border-b-[1px] border-gray-500 py-2">
                     <p><strong>Tên bài thi:</strong> {submissionData.test_id.title}</p>
                     <p className="text-gray-600">ID: {submissionData._id}</p>
                  </div>

                  <div className="h-16 flex justify-between border-b-[1px] border-gray-500 py-2">
                     <p className="font-semibold">Tổng số câu hỏi: {totalQuestions}</p>
                     <p>Số câu trả lời đúng: {correctAnswersCount}</p>
                     <p><strong>Thời gian làm:</strong> {new Date(submissionData.started_at).toLocaleString()}</p>
                  </div>

                  <div className="flex items-center gap-4 border-b-[1px] border-gray-300 py-4">
                     <img
                        className="h-16 w-16 rounded-full object-cover border-2"
                        src={
                           userProfile?.profile && userProfile.profile.startsWith('http')
                              ? userProfile.profile
                              : userProfile?.profile
                                 ? `http://localhost:5000/uploads/${userProfile.profile}`
                                 : 'https://via.placeholder.com/150' // Fallback image if profile is missing
                        }
                        alt="User Avatar"
                     />
                     <div className="flex flex-col">
                        <p className="text-lg font-semibold text-gray-800">{userProfile.username || 'Người dùng'}</p>
                        <p className="text-sm text-gray-500">{userProfile._id}</p>
                     </div>
                  </div>

                  <div className="h-16">
                     <div className="flex justify-between">
                        <p>Số câu đúng: {correctAnswersCount}</p>
                        <p className="text-xl">Điểm: <span className="text-green-600">{score}/10</span></p>
                     </div>
                  </div>
               </div>

               <Card>
                  <List
                     header={<h3 className="text-lg font-semibold">Chi tiết câu hỏi</h3>}
                     bordered
                     dataSource={submissionData.questions}
                     renderItem={(questionWrapper, index) => {
                        const question = questionWrapper.question_id;
                        const correctAnswers = question.correct_answers || [];
                        return (
                           <List.Item>
                              <div className="w-full">
                                 <div className="mb-2">
                                    <strong>{index + 1}. {question.question_text}</strong>
                                 </div>
                                 <div className="mb-2">
                                    {question.options.map((option, idx) => {
                                       const isUserAnswer = questionWrapper.user_answer.includes(option);
                                       const isCorrectAnswer = correctAnswers.includes(option);

                                       return (
                                          <div key={idx} className="mb-1">
                                             <span className="font-medium">
                                                {String.fromCharCode(65 + idx)}. {option}
                                             </span>
                                             {isUserAnswer && (
                                                <Tag
                                                   icon={isCorrectAnswer ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                                   color={isCorrectAnswer ? "green" : "red"}
                                                   className="ml-2"
                                                >
                                                   {isCorrectAnswer ? "Bạn đã chọn đúng" : "Bạn đã chọn sai"}
                                                </Tag>
                                             )}
                                          </div>
                                       );
                                    })}
                                 </div>
                                 <Divider />
                                 <p><strong>Đáp án đúng:</strong> {correctAnswers.map((ans, idx) => (
                                    <span key={idx} className="ml-2">{ans}</span>
                                 ))}</p>
                              </div>
                           </List.Item>
                        );
                     }}
                  />
               </Card>

               {/* Bình luận */}
               <div className="mt-6">
                  <h3 className="text-lg font-semibold">Bình luận</h3>
                  <List
                     dataSource={comments}
                     renderItem={(comment) => (
                        <div key={comment._id} className="flex flex-col space-y-3">
                           {/* Khung hiển thị bình luận gốc */}
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

                           {/* Khung hiển thị các trả lời */}
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

                           {/* Ô nhập trả lời riêng biệt */}
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

                  <TextArea
                     rows={4}
                     value={newComment}
                     onChange={(e) => setNewComment(e.target.value)}
                     placeholder="Nhập bình luận của bạn..."
                     className="mt-4"
                  />
                  <Button onClick={addComment} type="primary" className="mt-2">Gửi bình luận</Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ViewExamResults;
