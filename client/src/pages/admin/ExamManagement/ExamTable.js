import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash, Edit } from "lucide-react";
import { fetchAllExams } from "utils/adminAPI"; // Assumes there's an API utility for fetching exams

const ExamTable = () => {
    const [examsData, setExamsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");
    const examsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAllExams(); // Replace with actual API call
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No exams found.');
                }
                setExamsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredExams = examsData.filter((exam) => {
        const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || exam.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredExams.length / examsPerPage);
    const indexOfLastExam = currentPage * examsPerPage;
    const indexOfFirstExam = indexOfLastExam - examsPerPage;
    const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);

    return (
        <>
            <Breadcrumb pageName="Exams" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search by title"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="ml-4 border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="All">All</option>
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Exam Title</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Instructor</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Duration</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Number Of Questions</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentExams.map((exam) => (
                                        <tr key={exam._id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{exam.title}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{exam?.instructor?.fullname}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{exam.duration} mins</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{exam?.questions_id.length}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${exam.status === "draft" ? "bg-warning text-warning" : "bg-success text-success"}`}>
                                                    {exam.status}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between mt-4">
                            <button
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-300 text-black rounded-md disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ExamTable;
