import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Typography, Button, message, Spin } from 'antd';
import axios from 'axios';
import ExamHeader from '../ExamCreate/ExamHeader';
import * as XLSX from 'xlsx';

const { Search } = Input;
const { Text } = Typography;

function Submission() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!examId) {
        setError('Exam ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://localhost:5000/api/instructor/test/${examId}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        if (err.response) {
          setError(`Failed to load submissions: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else {
          setError('Failed to load submissions');
        }
        message.error('Failed to load submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [examId]);

  const handleRowClick = (submissionId) => {
    navigate(`/instructor/exam/submission-detail/${submissionId}`);
  };

  const exportToExcel = () => {
    const formattedData = submissions.map((submission, index) => ({
      "STT": index + 1,
      "Học sinh": submission.learner.fullname,
      "Email": submission.learner.email,
      "Lớp": submission.class_name || 'Không có',
      "Nộp ngày": submission.finished_at ? new Date(submission.finished_at).toLocaleDateString() : 'N/A',
      "Nộp lúc": submission.finished_at ? new Date(submission.finished_at).toLocaleTimeString() : 'N/A',
      "Điểm": submission.score !== undefined ? submission.score : 'N/A',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bảng điểm");

    XLSX.writeFile(workbook, `Bang_Diem_${examId}.xlsx`);
  };

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
        currentTab="submission"
      />
      <div className="w-5/6 mx-auto mt-5 pt-20">
        <div className="flex justify-between items-center mb-4">
          <Search
            size="large"
            placeholder="Type search keywords"
            style={{
              width: 300,
            }}
          />
          <Button type="primary" onClick={exportToExcel}>
            Xuất bảng điểm
          </Button>
        </div>

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
                  <th scope="col" className="px-3 py-3 text-center">#</th>
                  <th scope="col" className="px-2 py-3">Học sinh</th>
                  <th scope="col" className="px-6 py-3 text-center">Lớp</th>
                  <th scope="col" className="px-6 py-3 text-center">Nộp ngày</th>
                  <th scope="col" className="px-6 py-3 text-center">Nộp lúc</th>
                  <th scope="col" className="px-6 py-3 text-center">Điểm</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr
                    key={submission._id}
                    className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => handleRowClick(submission._id)}
                  >
                    <td className="px-3 py-4 text-center">{index + 1}</td>
                    <td scope="row" className="px-2 py-4">
                      <div className='flex flex-col justify-start whitespace-nowrap'>
                        <Text>{submission.learner.fullname}</Text>
                        <Text className='text-gray-500 font-thin' underline>{submission.learner.email}</Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{submission.class_name || 'Không có'}</td>
                    <td className="px-6 py-4 text-center">
                      {submission.finished_at ? new Date(submission.finished_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {submission.finished_at ? new Date(submission.finished_at).toLocaleTimeString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">{submission.score !== undefined ? submission.score : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Submission;
