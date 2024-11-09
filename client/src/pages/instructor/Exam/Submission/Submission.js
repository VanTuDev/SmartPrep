import { useState, useEffect } from 'react';
import { Input, Typography, Avatar, message, Spin } from 'antd';
import SubmissionDetail from './SubmissionDetail';
import axios from 'axios';

const { Search } = Input;
const { Text } = Typography;

function Submission({ examId }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch submissions when component mounts
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/instructor/test/${examId}/submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Replace with your auth token method
          },
        });
        setSubmissions(response.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
        setError('Failed to load submissions');
        message.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [examId]);

  return (
    <>
      <div className="w-5/6 mx-auto mt-5">
        {/* Search bar */}
        <div className='mb-4'>
          <Search
            size='large'
            placeholder="Type search keywords"
            style={{
              width: 300,
            }}
          />
        </div>

        {/* Submissions table */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Spin size="large" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-4">{error}</p>
          ) : submissions.length === 0 ? (
            <p className="text-center py-4">No submissions found for this test</p>
          ) : (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-xs text-gray-700 uppercase border-b">
                <tr>
                  <th scope="col" className="px-3 py-3"></th>
                  <th scope="col" className="px-2 py-3">Student</th>
                  <th scope="col" className="px-6 py-3">Class</th>
                  <th scope="col" className="px-6 py-3">Submission deadline</th>
                  <th scope="col" className="px-6 py-3 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr
                    key={submission._id}
                    className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"
                  >
                    <th className="px-2 text-center">
                      <div className='flex justify-center items-center'>
                        <Avatar size="large" src={submission.learner.avatar || <img src="/image/profile.svg" alt="Logo" />} />
                      </div>
                    </th>
                    <th scope="row" className="px-2 py-4 text-gray-900">
                      <div className='flex flex-col justify-start whitespace-nowrap'>
                        <Text>{submission.learner.name}</Text>
                        <Text className='text-gray-500 font-thin' underline>{submission.learner.email}</Text>
                      </div>
                    </th>
                    <td className="px-6 py-4">{submission.class_name || 'N/A'}</td>
                    <td className="px-6 py-4">{new Date(submission.finished_at).toLocaleDateString() || 'N/A'}</td>
                    <td className="text-center">{submission.score || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Drawer for row details */}
        <SubmissionDetail />
      </div>
    </>
  );
}

export default Submission;
