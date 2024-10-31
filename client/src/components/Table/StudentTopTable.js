// Sample Data Array for Students
const studentData = [
    {
      studentName: 'Alice',
      completedExams: 3,
    },
    {
      studentName: 'Bob',
      completedExams: 5,
    },
    {
      studentName: 'Charlie',
      completedExams: 2,
    },
    {
      studentName: 'David',
      completedExams: 4,
    },
    {
      studentName: 'Emma',
      completedExams: 6,
    },
  ];
  
  const StudentTopTable = () => {
    return (
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          Top Active Student
        </h4>
  
        <div className="flex flex-col">
          <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
            <div className="p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Student
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Done
              </h5>
            </div>
          </div>
  
          {studentData.map((student, key) => (
            <div
              className={`grid grid-cols-2 ${
                key === studentData.length - 1
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
  