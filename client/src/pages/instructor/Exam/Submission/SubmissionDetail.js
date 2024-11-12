import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, List, Button, Divider, Tag, Avatar, message } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import "tailwindcss/tailwind.css";

const SubmissionDetail = () => {
  const { submissionId } = useParams();
  const [submissionData, setSubmissionData] = useState(null);
  const [learnerProfile, setLearnerProfile] = useState(null);
  const navigate = useNavigate();

  const SUBMISSION_URL = `http://localhost:5000/api/submissions/${submissionId}`;
  const USER_PROFILE_URL = `http://localhost:5000/api/users/user/profile/`;

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

          // Fetch learner profile by user ID from the submission data
          if (data.learner && data.learner._id) {
            fetchLearnerProfile(data.learner._id);
          }
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

  // Fetch learner profile by ID
  const fetchLearnerProfile = async (learnerId) => {
    try {
      const response = await fetch(`${USER_PROFILE_URL}${learnerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setLearnerProfile(profileData);
      } else {
        const error = await response.json();
        message.error(error.message || 'Lỗi khi lấy thông tin học viên!');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin học viên:', error);
      message.error('Đã xảy ra lỗi trong quá trình lấy thông tin học viên!');
    }
  };

  if (!submissionData || !learnerProfile) {
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
          {/* Thông tin chi tiết bài thi và học viên */}
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
              <Avatar
                className="h-16 w-16 rounded-full object-cover border-2"
                src={
                  learnerProfile?.profile && learnerProfile.profile.startsWith('http')
                    ? learnerProfile.profile
                    : learnerProfile?.profile
                      ? `http://localhost:5000/uploads/${learnerProfile.profile}`
                      : 'https://via.placeholder.com/150' // Fallback image if profile is missing
                }
                alt="Learner Avatar"
              />
              <div className="flex flex-col">
                <p className="text-lg font-semibold text-gray-800">{learnerProfile.fullname || 'Người dùng'}</p>
                <p className="text-sm text-gray-500">{learnerProfile._id}</p>
              </div>
            </div>

            <div className="h-16">
              <div className="flex justify-between">
                <p>Số câu đúng: {correctAnswersCount}</p>
                <p className="text-xl">Điểm: <span className="text-green-600">{score}/10</span></p>
              </div>
            </div>
          </div>

          {/* Chi tiết câu hỏi */}
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
                        {question.options.map((option, idx) => (
                          <div key={idx} className="mb-1">
                            <span className="font-medium">
                              {String.fromCharCode(65 + idx)}. {option}
                            </span>
                            {questionWrapper.user_answer.includes(option) && (
                              <Tag icon={<CloseCircleOutlined />} color="error" className="ml-2">
                                Đã chọn
                              </Tag>
                            )}
                          </div>
                        ))}
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
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
