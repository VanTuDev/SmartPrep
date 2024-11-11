import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash, Edit } from "lucide-react";
import LearnerDetails from "./Details/LearnerDetails";
import { fetchUsersByRole, deleteUser } from "utils/adminAPI";

const LearnerTable = () => {
    const [openLearnerDetail, setOpenLearnerDetail] = useState(false);
    const [selectedLearnerId, setSelectedLearnerId] = useState(null);
    const [studentsData, setStudentsData] = useState([]);
    const [loading, setLoading] = useState(true);  // State cho trạng thái loading
    const [error, setError] = useState(null);        // State cho thông báo lỗi


    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");
    const studentsPerPage = 5; // Số lượng học sinh hiển thị trên mỗi trang

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);  // Đặt loading là true khi bắt đầu fetch
            setError(null);    // Reset lỗi trước khi gọi API
            try {
                const data = await fetchUsersByRole('learner');  // Gọi API để lấy learners
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No learners found.');  // Ném lỗi nếu không có dữ liệu
                }
                setStudentsData(data);  // Cập nhật state với dữ liệu nhận được
            } catch (err) {
                setError(err.message);  // Cập nhật state lỗi nếu có
            } finally {
                setLoading(false);  // Đặt loading là false sau khi hoàn thành
            }
        };
        fetchData();
    }, []);
    
    // Hàm xóa người dùng
    const handleDeleteLearner = async (learnerId) => {
        if (window.confirm("Are you sure you want to delete this learner?")) {
            try {
                await deleteUser(learnerId); // Gọi API xóa người dùng
                setStudentsData((prevData) => prevData.filter((student) => student._id !== learnerId)); // Cập nhật danh sách
            } catch (error) {
                console.error("Failed to delete learner:", error);
                alert("Failed to delete learner.");
            }
        }
    };

    const handleRowClick = (_id) => {
        console.log("Clicked student with ID:", _id);
        // Handle the row click logic here (e.g., fetch details, navigate, etc.)
    };

    const handleOpenLearnerDetail = (learnerId) => {
        setSelectedLearnerId(learnerId);
        setOpenLearnerDetail(true);
    };

    const handleCloseLearnerDetail = () => {
        setOpenLearnerDetail(false);
        setSelectedLearnerId(null); // Reset the selected learner when closing
    };

    const filteredStudents = studentsData.filter((student) => {
        const status = student.is_locked ? "Inactive" : "Active";
        const matchesSearch = student.fullname.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Tính toán số trang
    const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

    // Lấy học sinh cho trang hiện tại
    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    return (
        <>
            <Breadcrumb pageName="Học sinh" />
    
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading && <p className="text-center">Loading...</p>}  {/* Hiển thị loading */}
                {error && <p className="text-center text-red-500">{error}</p>}  {/* Hiển thị lỗi */}
    
                {!loading && !error && (
                    <>
                        <div className="mb-4 flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search by name"
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
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Student Name</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Username</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentStudents.map((student) => (
                                        <tr key={student._id} onClick={() => handleRowClick(student._id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{student.fullname}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{student.username}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{student.email}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{student.phone}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <button className="hover:text-primary" onClick={() => handleDeleteLearner(student._id)}>
                                                        <Trash className="w-5 h-5" />
                                                    </button>
                                                </div>
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
            <LearnerDetails
                visible={openLearnerDetail}
                onClose={handleCloseLearnerDetail}
                learner_id={selectedLearnerId}
            />
        </>
    );
    
};

export default LearnerTable;
