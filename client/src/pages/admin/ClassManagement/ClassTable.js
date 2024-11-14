import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash, Edit } from "lucide-react";
import { fetchAllClasses } from "utils/adminAPI"; // Assumes there's an API utility for fetching classes

const ClassTable = () => {
    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const classesPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchAllClasses(); // Replace with actual API call
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No classes found.');
                }
                setClassData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredClasses = classData.filter((cls) => 
        cls.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
    const indexOfLastClass = currentPage * classesPerPage;
    const indexOfFirstClass = indexOfLastClass - classesPerPage;
    const currentClasses = filteredClasses.slice(indexOfFirstClass, indexOfLastClass);

    return (
        <>
            <Breadcrumb pageName="Classes" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search by class name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-gray-300 rounded-md p-2 w-full dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Class Name</th>
                                        <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white">Teacher Name</th>
                                        <th className="min-w-[300px] py-4 px-4 font-medium text-black dark:text-white">Description</th>
                                        <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">Code</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Number Of Students</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentClasses.map((cls) => (
                                        <tr key={cls._id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{cls.name}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{cls?.instructor?.fullname}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{cls.description}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{cls.code}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{cls?.learners?.length}</p>
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

export default ClassTable;
