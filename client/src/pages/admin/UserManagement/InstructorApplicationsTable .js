import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash } from "lucide-react";

// Mock data cho danh sách giáo viên đăng ký duyệt
const mockInstructorApplications = [
    {
        _id: "1",
        teacher: { fullname: "Nguyễn Văn A", email: "nguyenvana@example.com" },
        applicationStatus: "pending",
        applicationDate: "2024-10-22",
        specialization: "Math",
        cv: "/cv/nguyenvana.pdf",
        citizenIdPhoto: "/photos/nguyenvana.jpg"
    },
    {
        _id: "2",
        teacher: { fullname: "Trần Thị B", email: "tranthib@example.com" },
        applicationStatus: "approved",
        applicationDate: "2024-10-21",
        specialization: "Physics",
        cv: "/cv/tranthib.pdf",
        citizenIdPhoto: "/photos/tranthib.jpg"
    },
    {
        _id: "3",
        teacher: { fullname: "Lê Văn C", email: "levanc@example.com" },
        applicationStatus: "rejected",
        applicationDate: "2024-10-20",
        specialization: "Chemistry",
        cv: "/cv/levanc.pdf",
        citizenIdPhoto: "/photos/levanc.jpg"
    }
];

const InstructorApplicationsTable = () => {
    const [applicationsData, setApplicationsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // Trạng thái bộ lọc
    const [sortField, setSortField] = useState(null); // Trường để sắp xếp
    const [sortOrder, setSortOrder] = useState("asc"); // Sắp xếp tăng dần ("asc") hoặc giảm dần ("desc")
    const [currentPage, setCurrentPage] = useState(1);
    const applicationsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                setApplicationsData(mockInstructorApplications);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRowClick = (_id) => {
        console.log("Clicked application with ID:", _id);
    };

    // Lọc ứng viên dựa trên search term và status filter
    const filteredApplications = applicationsData.filter((application) =>
        application.teacher.fullname.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "" || application.applicationStatus === statusFilter)
    );

    const sortData = (data) => {
        if (!sortField) return data;

        return data.sort((a, b) => {
            if (sortField === "applicationDate") {
                const dateA = new Date(a.applicationDate);
                const dateB = new Date(b.applicationDate);
                return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            }

            if (sortField === "applicationStatus") {
                const statusA = a.applicationStatus.toLowerCase();
                const statusB = b.applicationStatus.toLowerCase();
                if (statusA < statusB) return sortOrder === "asc" ? -1 : 1;
                if (statusA > statusB) return sortOrder === "asc" ? 1 : -1;
                return 0;
            }

            return 0;
        });
    };

    const sortedApplications = sortData(filteredApplications);

    const totalPages = Math.ceil(sortedApplications.length / applicationsPerPage);

    const indexOfLastApplication = currentPage * applicationsPerPage;
    const indexOfFirstApplication = indexOfLastApplication - applicationsPerPage;
    const currentApplications = sortedApplications.slice(indexOfFirstApplication, indexOfLastApplication);

    // Hàm để hiển thị tag trạng thái với màu phù hợp
    const getStatusTag = (status) => {
        let color = "";
        let textColor = "";
        switch (status) {
            case "pending":
                color = "bg-yellow-500";
                textColor = "text-yellow-500";
                break;
            case "approved":
                color = "bg-green-500";
                textColor = "text-green-500";
                break;
            case "rejected":
                color = "bg-red-500";
                textColor = "text-red-500";
                break;
            default:
                color = "bg-gray-500";
                textColor = "text-gray-500";
                break;
        }
        return (
            <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${color} ${textColor}`}>
                {status}
            </p>
        );
    };

    // Hàm để xử lý sắp xếp
    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    // Hàm để thay đổi trạng thái filter
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Reset lại trang về đầu khi lọc
    };

    return (
        <>
            <Breadcrumb pageName="Applications" />

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {loading && <p className="text-center">Loading...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

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
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                className="border border-gray-300 rounded-md p-2 dark:bg-gray-800 dark:text-white"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Teacher Name</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Specialization</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer" onClick={() => handleSort("applicationDate")}>
                                            Application Date {sortField === "applicationDate" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                        </th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white cursor-pointer" onClick={() => handleSort("applicationStatus")}>
                                            Status {sortField === "applicationStatus" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                                        </th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentApplications.map((application) => (
                                        <tr key={application._id} onClick={() => handleRowClick(application._id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{application.teacher.fullname}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{application.teacher.email}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{application.specialization}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{application.applicationDate}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                {getStatusTag(application.applicationStatus)}
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex space-x-2">
                                                    <button className="hover:text-primary">
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button className="hover:text-primary">
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
        </>
    );
};

export default InstructorApplicationsTable;