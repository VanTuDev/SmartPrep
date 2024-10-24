import React, { useState, useEffect } from "react";
import { AlarmClock } from "lucide-react"; // Optional custom icon
import { Spin, Alert } from "antd"; // Using Ant Design's Spin and Alert for simplicity, can be customized later

function LearnerDetails({ visible, onClose, learner_id }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [learnerData, setLearnerData] = useState(null);

    // Fetch learner details based on learner_id
    useEffect(() => {
        if (learner_id) {
            setLoading(true); // Start loading
            setError(null); // Reset error state

            // Simulate an API call to fetch learner data by learner_id
            fetch(`/api/learners/${learner_id}`) // Update this with your actual API endpoint
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch data");
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data) {
                        setLearnerData(data);
                    } else {
                        throw new Error("No data found");
                    }
                })
                .catch((err) => {
                    setError(err.message);
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        }
    }, [learner_id]);

    return (
        <div
            className={`fixed inset-0 z-9999 transition-transform transform bg-white dark:bg-boxdark ${
                visible ? "translate-x-0" : "translate-x-full"
            }`}
            style={{ width: "100vw" }} // Adjust as needed
        >
            {/* Drawer header */}
            <div className="flex justify-between items-center bg-white dark:bg-boxdark px-6 py-4 border-b border-gray-200 dark:border-strokedark">
                <h2 className="text-xl font-bold text-black dark:text-white">Learner Details</h2>
                <button
                    onClick={onClose}
                    className="text-black dark:text-white hover:text-primary transition-colors"
                >
                    Close
                </button>
            </div>

            {/* Drawer content */}
            <div className="p-6 overflow-y-auto h-[80vh]">
                {loading ? (
                    <div className="flex justify-center items-center min-h-[300px]">
                        <Spin size="large" /> {/* Loading spinner */}
                    </div>
                ) : error ? (
                    <div className="my-5">
                        <Alert
                            message="Error"
                            description={error}
                            type="error"
                            showIcon
                        />
                    </div>
                ) : learnerData ? (
                    <div className="shadow-lg border-gray-200 dark:border-strokedark bg-white dark:bg-boxdark p-6 rounded-lg">
                        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">{learnerData.name}</h2>
                        {learnerData?.exam?.questions?.length > 0 ? (
                            learnerData.exam.questions.map((question, index) => (
                                <div key={index} className="w-full p-4 mb-4">
                                    <p>
                                        <strong>{`Question ${index + 1}: `}</strong>
                                        {question.question_text}
                                    </p>
                                    <div className="space-y-2">
                                        {question.options.map((option, idx) => (
                                            <div key={idx} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    checked={question.correct_answers.includes(option)}
                                                    disabled
                                                />
                                                <span>{option}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No questions available</p>
                        )}
                    </div>
                ) : (
                    <p>No data found</p>
                )}
            </div>
        </div>
    );
}

export default LearnerDetails;
