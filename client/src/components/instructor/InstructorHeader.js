import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, HelpCircle, Bell } from "lucide-react";
import { Dropdown, Menu as AntdMenu, Popover } from "antd";
import VideoModal from "../../components/SupportGuide/SupportGuideModal";
import { toast } from "react-toastify";
import axios from "axios";

const InstructorHeader = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState("");
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(
          `Lỗi khi lấy thông tin người dùng: ${
            errorResponse.error || "Không xác định"
          }`
        );
        return;
      }

      const data = await response.json();
      setUserInfo(data);

      // Fetch classroom details with pending requests and notifications
      const classResponse = await fetch(
        `http://localhost:5000/api/classrooms/details`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (classResponse.ok) {
        const classData = await classResponse.json();
        setPendingRequests(
          classData.classrooms.flatMap((classroom) =>
            classroom.pending_requests.map((request) => ({
              ...request,
              classroomName: classroom.name,
              classId: classroom._id,
              description: classroom.description,
            }))
          )
        );
      }
    } catch (err) {
      setError("Có lỗi xảy ra trong quá trình lấy thông tin.");
      toast.error(error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [navigate, error]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userMenu = (
    <AntdMenu>
      <AntdMenu.Item
        key="profile"
        onClick={() => navigate("/instructor/profile")}
      >
        Hồ sơ cá nhân
      </AntdMenu.Item>
      <AntdMenu.Item key="logout" onClick={handleLogout}>
        Đăng xuất
      </AntdMenu.Item>
    </AntdMenu>
  );

  const notificationContent = (
    <div className="max-h-60 overflow-y-auto">
      <h4 className="font-semibold mb-2">Yêu cầu chờ phê duyệt</h4>
      {pendingRequests.length > 0 ? (
        pendingRequests.map((request) => (
          <div
            key={request._id}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <h3 className="font-semibold">{request.fullname}</h3>
              <p className="text-gray-500">{request.email}</p>
              <p className="text-sm text-gray-400">
                Lớp: {request.classroomName}
              </p>
              <p className="text-sm text-gray-400">
                Mô tả: {request.description}
              </p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                onClick={() =>
                  handleRequestApproval(request.classId, request._id)
                }
              >
                Phê duyệt
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() =>
                  handleRequestRejection(request.classId, request._id)
                }
              >
                Từ chối
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">
          Không có yêu cầu nào đang chờ.
        </p>
      )}
    </div>
  );

  const handleRequestApproval = async (classId, learnerId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/classrooms/instructor/${classId}/approve/${learnerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Yêu cầu tham gia đã được phê duyệt!");
      fetchUserData(); // Refresh user data and pending requests
    } catch (error) {
      console.error("Lỗi khi phê duyệt yêu cầu:", error);
      toast.error("Không thể phê duyệt yêu cầu!");
    }
  };

  const handleRequestRejection = async (classId, learnerId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/classrooms/instructor/${classId}/reject/${learnerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Yêu cầu tham gia đã bị từ chối.");
      fetchUserData(); // Refresh user data and pending requests
    } catch (error) {
      console.error("Lỗi khi từ chối yêu cầu:", error);
      toast.error("Không thể từ chối yêu cầu!");
    }
  };

  return (
    <header className="bg-white shadow-md px-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <NavLink
          to="/"
          className="flex items-center text-xl font-bold text-purple-700"
        >
          <img src="/image/logo.svg" alt="Logo" className="h-20 mr-2" />
        </NavLink>
        <span className="text-lg font-semibold text-gray-800">Smart Dev</span>
      </div>

      <nav className="flex space-x-8">
        {[
          "dashboard",
          "online-learning",
          "questions/library",
          "dashboard/class",
        ].map((path, index) => (
          <div key={index} className="py-4 relative">
            <NavLink
              to={`/instructor/${path}`}
              className={({ isActive }) =>
                isActive
                  ? "text-purple-700 font-medium"
                  : "text-gray-600 hover:text-purple-700 transition-all duration-200"
              }
            >
              {path === "dashboard"
                ? "Bài kiểm tra"
                : path === "online-learning"
                ? "Học online"
                : path === "questions/library"
                ? "Thư viện câu hỏi"
                : "Lớp"}
            </NavLink>
            <div
              className={({ isActive }) =>
                isActive
                  ? "absolute left-0 bottom-0 w-full h-1 bg-purple-700 transition-all duration-300 ease-in-out"
                  : "absolute left-0 bottom-0 w-full h-1 bg-transparent hover:bg-purple-700 transition-all duration-300 ease-in-out"
              }
            ></div>
          </div>
        ))}
      </nav>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center">
            <NavLink to="/menu">
              <Menu className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
            </NavLink>
            <span className="text-sm text-gray-600">Menu</span>
          </div>

          <div
            onClick={() => setModalIsOpen(true)}
            className="flex flex-col items-center"
          >
            <HelpCircle className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
            <span className="text-sm text-gray-600">Hỗ trợ</span>
            <VideoModal
              isOpen={modalIsOpen}
              onRequestClose={() => setModalIsOpen(false)}
            />
          </div>

          <Popover
            content={notificationContent}
            trigger="click"
            visible={isPopoverVisible}
            onVisibleChange={setIsPopoverVisible}
            placement="bottomRight"
          >
            <div className="flex flex-col items-center cursor-pointer relative">
              {pendingRequests.length > 0 && (
                <div className="absolute -top-2 right-2 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  {pendingRequests.length}
                </div>
              )}
              <Bell className="h-8 w-8 text-gray-500 hover:text-gray-700 transition duration-200" />
              <span className="text-sm text-gray-600">Thông báo</span>
            </div>
          </Popover>
        </div>

        <Dropdown overlay={userMenu} trigger={["click"]}>
          <div className="flex items-center space-x-2 cursor-pointer">
            <img
              src={
                userInfo?.profile?.startsWith("http")
                  ? userInfo.profile
                  : userInfo?.profile
                  ? `http://localhost:5000/uploads/${userInfo.profile}`
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="w-10 h-10 object-cover rounded-full shadow-md"
            />
            <span className="text-gray-700 font-medium">
              {userInfo?.username || "Người dùng"}
            </span>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default InstructorHeader;
