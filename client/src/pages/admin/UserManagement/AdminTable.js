import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash, Edit } from "lucide-react";
// import AdminDetails from "./Details/AdminDetails"; 
import { fetchUsersByRole } from "utils/adminAPI";

const AdminTable = () => {
    const [openAdminDetail, setOpenAdminDetail] = useState(false);
    const [selectedAdminId, setSelectedAdminId] = useState(null);
    const [adminsData, setAdminsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("All");
    const adminsPerPage = 5;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchUsersByRole('admin');
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No admins found.');
                }
                setAdminsData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRowClick = (_id) => {
        console.log("Clicked admin with ID:", _id);
    };

    const handleOpenAdminDetail = (adminId) => {
        setSelectedAdminId(adminId);
        setOpenAdminDetail(true);
    };

    const handleCloseAdminDetail = () => {
        setOpenAdminDetail(false);
        setSelectedAdminId(null);
    };

    const filteredAdmins = adminsData.filter((admin) => {
        const status = admin.is_locked ? "Inactive" : "Active";
        const matchesSearch = admin.fullname.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === "All" || status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredAdmins.length / adminsPerPage);

    const indexOfLastAdmin = currentPage * adminsPerPage;
    const indexOfFirstAdmin = indexOfLastAdmin - adminsPerPage;
    const currentAdmins = filteredAdmins.slice(indexOfFirstAdmin, indexOfLastAdmin);

    return (
        <>
            <Breadcrumb pageName="Quản trị viên" />

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
                                        <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Admin Name</th>
                                        <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">Email</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Phone</th>
                                        <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                        <th className="py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentAdmins.map((admin) => (
                                        <tr key={admin._id} onClick={() => handleRowClick(admin._id)} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                                                <h5 className="font-medium text-black dark:text-white">{admin.fullname}</h5>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{admin.email}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className="text-black dark:text-white">{admin.phone}</p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <p className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${admin.is_locked ? "bg-danger text-danger" : "bg-success text-success"}`}>
                                                    {admin.is_locked ? "Inactive" : "Active"}
                                                </p>
                                            </td>
                                            <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                                <div className="flex items-center space-x-3.5">
                                                    <button className="hover:text-primary" onClick={() => handleOpenAdminDetail(admin._id)}>
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
            {/* <AdminDetails
                visible={openAdminDetail}
                onClose={handleCloseAdminDetail}
                admin_id={selectedAdminId}
            /> */}
        </>
    );
};

export default AdminTable;
