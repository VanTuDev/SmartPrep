// Sample Data Array
const classData = [
    {
      className: 'Math 101',
      teacher: 'Mr. Smith',
      exams: 4,
    },
    {
      className: 'Science 202',
      teacher: 'Ms. Johnson',
      exams: 5,
    },
    {
      className: 'History 303',
      teacher: 'Mr. Brown',
      exams: 3,
    },
    {
      className: 'English 404',
      teacher: 'Mrs. White',
      exams: 6,
    },
    {
      className: 'Art 505',
      teacher: 'Ms. Green',
      exams: 2,
    },
  ];
  
  const AdminDashboardTable = () => {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Top Active Classes
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Class Name
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Teacher
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Exams
              </h5>
            </div>
          </div>
  
          {classData.map((item, key) => (
            <div
              className={`grid grid-cols-3 ${
                key === classData.length - 1
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
                <p className="text-meta-3">{item.exams}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default AdminDashboardTable;
  