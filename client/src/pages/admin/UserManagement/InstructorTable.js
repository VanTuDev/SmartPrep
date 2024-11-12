import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, PenOff, Trash,  } from "lucide-react";
import { fetchUsersByRole, deleteUser, updateInstructorState } from "utils/adminAPI";

// Danh sách giáo viên với _id, username, fullname, email, phone, và is_locked
const InstructorTable = () => {
    const [openTeacherDetail, setOpenTeacherDetail] = useState(false);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [teachersData, setTeachersData] = useState([]);
    const [loading, setLoading] = useState(true); // State cho trạng thái loading
    const [error, setError] = useState(null); // State cho thông báo lỗi

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");
    const teachersPerPage = 5; // Số lượng giáo viên hiển thị trên mỗi trang

    const fetchData = async () => {
        setLoading(true); // Đặt loading là true khi bắt đầu fetch
        setError(null); // Reset lỗi trước khi gọi API
        try {
            const data = await fetchUsersByRole('instructor'); // Gọi API để lấy teachers
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No teachers found.'); // Ném lỗi nếu không có dữ liệu
            }
            setTeachersData(data); // Cập nhật state với dữ liệu nhận được
        } catch (err) {
            setError(err.message); // Cập nhật state lỗi nếu có
        } finally {
            setLoading(false); // Đặt loading là false sau khi hoàn thành
        }
    };

    useEffect(() => {
        
        fetchData();
    }, []);

    // Hàm xóa người dùng
    const handleDeleteInstructor = async (id) => {
        if (window.confirm("Are you sure you want to deactive this instructor?")) {
            try {
                await updateInstructorState(id); // Gọi API xóa người dùng
                // setTeachersData((prevData) => prevData.filter((instructor) => instructor._id !== id)); // Cập nhật danh sách
                fetchData();
            } catch (error) {
                console.error("Failed to delete instructor:", error);
                alert("Failed to delete instructor.");
            }
        }
    };

    const handleRowClick = (_id) => {
        console.log("Clicked teacher with ID:", _id);
        // Handle the row click logic here (e.g., fetch details, navigate, etc.)
    };

    const handleOpenTeacherDetail = (teacherId) => {
        setSelectedTeacherId(teacherId);
        setOpenTeacherDetail(true);
    };

    const handleCloseTeacherDetail = () => {
        setOpenTeacherDetail(false);
        setSelectedTeacherId(null); // Reset the selected teacher when closing
    };

    const filteredTeachers = teachersData.filter((teacher) => {
        const status = teacher.is_locked ? "Inactive" : "Active";
        const matchesSearch = teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    // Tính toán số trang
    const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

    // Lấy giáo viên cho trang hiện tại
    const indexOfLastTeacher = currentPage * teachersPerPage;
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
    const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

    return (
        <>
            <Breadcrumb pageName="Giáo viên" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading && <p className="text-center">Loading...</p>} {/* Hiển thị loading */}
                {error && <p className="text-center text-red-500">{error}</p>} {/* Hiển thị lỗi */}

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
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Teacher Name</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentTeachers.map((teacher) => (
                                        <tr key={teacher._id} onClick={() => handleRowClick(teacher._id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{teacher.fullname}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{teacher.email}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{teacher.phone}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${teacher.is_locked ? "bg-danger text-danger" : "bg-success text-success"}`}>
                                                    {teacher.is_locked ? "Inactive" : "Active"}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <button className="hover:text-primary" onClick={() => handleDeleteInstructor(teacher._id)}>
                                        
                                                        <PenOff className="w-5 h-5" />
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
            {/* <TeacherDetails
                visible={openTeacherDetail}
                onClose={handleCloseTeacherDetail}
                teacher_id={selectedTeacherId}
            /> */}
        </>
    );
};

export default InstructorTable;
