import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const baseUrl = "http://localhost:5000/";

const ApplicationDetailDialog = ({ applicationId, isOpen, onClose }) => {
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

            navigate("/admin/users/instructor-application")
        } catch (error) {
            console.error(`Error updating application status to ${status}:`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg p-5 max-w-lg w-full shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Application Details</h2>
                {applicationDetails && (
                    <div>
                        <p><strong>Teacher Name:</strong> {applicationDetails.teacher.fullname}</p>
                        <p><strong>Email:</strong> {applicationDetails.teacher.email}</p>
                        <p><strong>Specialization:</strong> {applicationDetails.specialization}</p>
                        <p><strong>CV:</strong> <a href={`${baseUrl}${applicationDetails.cv}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View CV</a></p>
                        <p><strong>Citizen ID Photos:</strong></p>
                        <ul>
                            {applicationDetails.citizenIdPhotos.map((photo, index) => (
                                <li key={index}>
                                    <a href={`${baseUrl}${photo}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View Photo {index + 1}</a>
                                </li>
                            ))}
                        </ul>
                        <p><strong>Application Status:</strong> {applicationDetails.applicationStatus}</p>
                        <p><strong>Application Date:</strong> {new Date(applicationDetails.applicationDate).toLocaleDateString()}</p>

                        {/* Only show buttons if the status is pending */}
                        {applicationDetails.applicationStatus === "pending" && (
                            <div className="flex justify-between mt-4">
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
                            </div>
                        )}
                    </div>
                )}
                <button
                    onClick={onClose}
                    className="mt-4 bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2 transition-all duration-200"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ApplicationDetailDialog;
