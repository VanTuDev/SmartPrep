import { useEffect, useState } from 'react';
import { fetchSortedStudentSubmit } from 'utils/adminAPI';
  const StudentTopTable = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
      const fetchStudents = async () => {
        try {
          const response = await fetchSortedStudentSubmit();
          setStudents(response);
        } catch (error) {
          console.error('Error fetching student data:', error);
        }
      };
  
      fetchStudents();
    }, []);
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Học sinh
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Tên
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Bài làm
              </h5>
            </div>
          </div>
  
          {students.map((student, key) => (
          <div
            className={`grid grid-cols-2 ${
              key === students.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{student.studentName}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{student.completedExams}</p>
            </div>
          </div>
        ))}
        </div>
      </div>
    );
  };
  
  export default StudentTopTable;
  