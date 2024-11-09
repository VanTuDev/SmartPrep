import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = "http://localhost:5000/";

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

const ApplicationDetailDialog = ({ applicationId, isOpen, onClose, refreshApplicationsData  }) => {
    const [applicationDetails, setApplicationDetails] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate;

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${baseUrl}api/access_instructor/${applicationId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch application details");
                }

                const result = await response.json();
                setApplicationDetails(result);
            } catch (error) {
                console.error("Error fetching application details:", error);
            }
        };

        if (isOpen && applicationId) {
            fetchApplicationDetails();
        }
    }, [isOpen, applicationId]);

    const handleApprove = async () => {
        await handleReview("approved");
    };

    const handleReject = async () => {
        await handleReview("rejected");
    };

    const handleReview = async (status) => {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseUrl}api/access_instructor/applications/${applicationId}/review`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error("Failed to update application status");
            }

            const updatedApplication = await response.json();
            setApplicationDetails(updatedApplication.application);
            message.success(`Application ${status} successfully!`);

            // Gọi hàm refresh để cập nhật bảng
            refreshApplicationsData();
            onClose(); // Đóng dialog sau khi cập nhật thành công
        } catch (error) {
            console.error(`Error updating application status to ${status}:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg p-5 max-w-3xl w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                {applicationDetails && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="font-semibold">Teacher Name:</label>
                            <input
                                type="text"
                                value={applicationDetails.teacher.fullname}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Email:</label>
                            <input
                                type="text"
                                value={applicationDetails.teacher.email}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Specialization:</label>
                            <input
                                type="text"
                                value={applicationDetails.specialization}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Application Status:</label>
                            <input
                                type="text"
                                value={applicationDetails.applicationStatus}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">Application Date:</label>
                            <input
                                type="text"
                                value={new Date(applicationDetails.applicationDate).toLocaleDateString()}
                                readOnly
                                className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
                            />
                        </div>
                        <div>
                            <label className="font-semibold">CV:</label>
                            <a href={`${baseUrl}${applicationDetails.cv}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                View CV
                            </a>
                        </div>
                        <div className="col-span-2">
                            <label className="font-semibold">Citizen ID Photos:</label>
                            <ul className="flex flex-wrap gap-2">
                                {applicationDetails.citizenIdPhotos.map((photo, index) => (
                                    <li key={index} className="w-1/4">
                                        <img
                                            src={`${baseUrl}${photo}`}
                                            alt={`Citizen ID Photo ${index + 1}`}
                                            className="w-full h-auto rounded border border-gray-300 dark:border-gray-600"
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                <div className="flex justify-start space-x-5 mt-4">
                    {applicationDetails?.applicationStatus === "pending" && (
                        <>
                            <button
                                onClick={handleApprove}
                                className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Approving...' : 'Approve'}
                            </button>
                            <button
                                onClick={handleReject}
                                className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 transition-all duration-200"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Rejecting...' : 'Reject'}
                            </button>
                        </>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2 transition-all duration-200"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailDialog;
