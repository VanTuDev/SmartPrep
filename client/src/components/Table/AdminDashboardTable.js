import { useEffect, useState } from 'react';
import { fetchSortedClasses } from 'utils/adminAPI';

const AdminDashboardTable = () => {
  const [classData, setClassData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const data = await fetchSortedClasses();
        setClassData(data);
      } catch (error) {
        console.error('Failed to fetch class data:', error);
      }
    };

    fetchData();
  }, []);

  // Ensure there are always 5 rows by adding placeholders if needed
  const displayData = [...classData];
  while (displayData.length < 5) {
    displayData.push({
      className: '-',
      teacher: '-',
      learners: '-',
      exams: '-',
    });
  }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Lớp học
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              tên lớp
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Giáo viên
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Số học sinh
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-3">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Số bài kiểm tra
            </h5>
          </div>
        </div>

        {displayData.slice(0, 5).map((item, key) => (
          <div
            className={`grid grid-cols-4 ${
              key === displayData.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{item.className}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{item.teacher}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{item.learners}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{item.exams}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardTable;
