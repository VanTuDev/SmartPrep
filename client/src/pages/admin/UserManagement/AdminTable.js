import { useState, useEffect } from "react";
import Breadcrumb from "components/Breadcrumbs/Breadcrumb";
import { Eye, Trash, Edit } from "lucide-react";
import { fetchUsersByRole, deleteUser, addAdmin } from "utils/adminAPI"; // Assuming addAdmin is the API for adding a new admin

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

  const [isAddAdminFormOpen, setIsAddAdminFormOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    password: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsersByRole('admin');

      const currentUserId = localStorage.getItem('userId');
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('No admins found.');
      }
      const filteredAdmins = data.filter(admin => admin._id !== currentUserId);
      setAdminsData(filteredAdmins);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
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

  const handleDeleteAdmin = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      try {
        await deleteUser(id); // Call API to delete the user
        setAdminsData((prevData) => prevData.filter((admin) => admin._id !== id)); // Update the list
      } catch (error) {
        console.error("Failed to delete admin:", error);
        alert("Failed to delete admin.");
      }
    }
  };

  const handleAddNewAdmin = async () => {
    try {
      await addAdmin(newAdmin); // Call API to add new admin
      setIsAddAdminFormOpen(false); // Close form after submission
      setNewAdmin({ username: '', fullname: '', email: '', phone: '', password: '' }); // Reset the form
      fetchData();
    } catch (error) {
      console.error("Failed to add admin:", error);
      alert("Failed to add admin.");
    }
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
      
      {/* Button to open Add Admin form */}
      <button
        onClick={() => setIsAddAdminFormOpen(true)}
        className="px-4 py-2 bg-primary text-white rounded-md mb-4"
      >
        Add New Admin
      </button>

      {/* Modal for adding new admin */}
      {isAddAdminFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl mb-4 text-black dark:text-white">Add New Admin</h3>
            <div>
              <label className="block mb-2 text-black dark:text-white">Username</label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-black dark:text-white">Full Name</label>
              <input
                type="text"
                value={newAdmin.fullname}
                onChange={(e) => setNewAdmin({ ...newAdmin, fullname: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-black dark:text-white">Email</label>
              <input
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-black dark:text-white">Phone</label>
              <input
                type="text"
                value={newAdmin.phone}
                onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block mb-2 text-black dark:text-white">Password</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                className="border border-gray-300 rounded-md p-2 w-full mb-4 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={handleAddNewAdmin}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Add Admin
            </button>
            <button
              onClick={() => setIsAddAdminFormOpen(false)}
              className="px-4 py-2 ml-2 bg-gray-300 text-black rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                    <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAdmins.map((admin) => (
                    <tr
                      key={admin._id}
                      className="border-t border-stroke dark:border-strokedark"
                      onClick={() => handleRowClick(admin._id)}
                    >
                      <td className="py-4 px-4 text-black dark:text-white">{admin.fullname}</td>
                      <td className="py-4 px-4 text-black dark:text-white">{admin.email}</td>
                      <td className="py-4 px-4 text-black dark:text-white">{admin.phone}</td>
                      <td className="py-4 px-4 text-black dark:text-white">
                        {admin.is_locked ? "Inactive" : "Active"}
                      </td>
                      <td className="py-4 px-4 text-black dark:text-white">
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="hover:text-primary"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Previous
              </button>
              <div>
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-300 rounded-md"
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

export default AdminTable;
