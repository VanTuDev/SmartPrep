import { useState, useEffect } from 'react';
import { Input, Typography, Avatar, Drawer, message } from 'antd';
import SubmissionDetail from './SubmissionDetail/SubmissionDetail';

const { Search } = Input;
const { Text } = Typography;

function Submission({ examId }) {
  const [data, setData] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Lấy dữ liệu submission dựa trên examId
  useEffect(() => {
    if (examId) {
      fetch(`http://localhost:5000/api/test/submissions/test/${examId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching submissions: ${response.statusText}`);
          }
          return response.json();
        })
        .then(submissions => {
          // Map dữ liệu để phù hợp với định dạng hiển thị
          const formattedData = submissions.map((submission) => ({
            ...submission,
            id: submission._id,
            imgSrc: submission._id_user?.profile ? `http://localhost:5000/uploads/${submission._id_user.profile}` : "https://animecorner.me/wp-content/uploads/2022/05/blue-lock-pv.png",
            studentName: submission._id_user?.fullname || "Unknown",
            email: submission._id_user?.email || "No Email",
            class: "DE170068", // Giả sử tất cả học sinh thuộc cùng một lớp; bạn có thể điều chỉnh nếu cần.
            deadline: new Date(submission.finished_at).toLocaleString(),
            chosenSentence: submission.questions.length,
            rightSentence: submission.score / 10 * submission.questions.length,
            grade: submission.status === 'submitted' ? submission.score : 'waiting for mark',
          }));
          setData(formattedData);
        })
        .catch(error => {
          message.error(`Error fetching submissions: ${error.message}`);
        });
    }
  }, [examId]);

  // Hiển thị Drawer với chi tiết của từng dòng
  const handleRowClick = (row) => {
    setSelectedRow(row);
    setIsDrawerVisible(true);
  };

  // Đóng Drawer
  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setSelectedRow(null);
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <>
      <div className="w-5/6 mx-auto mt-5">
        <div className='mb-4'>
          <Search
            size='large'
            placeholder="Type search keywords"
            onSearch={onSearch}
            style={{
              width: 300,
            }}
          />
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase border-b">
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-2 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Class</th>
                <th scope="col" className="px-6 py-3">Submission deadline</th>
                <th scope="col" className="px-6 py-3 text-center">Chosen sentence</th>
                <th scope="col" className="px-6 py-3 text-center">Right sentence</th>
                <th scope="col" className="px-6 py-3 text-center">Grade</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50 hover:cursor-pointer"
                    onClick={() => handleRowClick(row)}
                  >
                    <th className="px-2 text-center">
                      <div className='flex justify-center items-center'>
                        <Avatar size="large" src={<img src={row.imgSrc} alt="avatar" />} />
                      </div>
                    </th>
                    <th scope="row" className="px-2 py-4 text-gray-900">
                      <div className='flex flex-col justify-start whitespace-nowrap'>
                        {row.studentName}
                        <Text className='text-gray-500 font-thin' underline>{row.email}</Text>
                      </div>
                    </th>
                    <td className="px-6 py-4">
                      {row.class}
                    </td>
                    <td className="px-6 py-4">
                      {row.deadline}
                    </td>
                    <td className="text-center">
                      {row.chosenSentence}
                    </td>
                    <td className="text-center">
                      {row.rightSentence}
                    </td>
                    <td className="text-center">
                      {row.grade}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">No submissions found for this test</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Drawer for row details */}
        <SubmissionDetail 
          visible={isDrawerVisible}
          onClose={handleCloseDrawer}
          student={selectedRow}
        />
      </div>
    </>
  );
}

export default Submission;
