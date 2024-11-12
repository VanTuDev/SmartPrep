// AllTestsTab.js
import React from 'react';
import CardExamInClass from './CardExamInClass';

const AllTestsTab = ({ exams, grades, subjects }) => {
    return (
        <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-700">Danh sách bài kiểm tra</h1>
            <div className="border-b border-gray-300 my-4"></div>
            {exams.length > 0 ? (
                <div className="grid grid-cols-4 gap-6">
                    {exams.map((exam) => (
                        <CardExamInClass
                            key={exam._id}
                            exam={exam}
                            grades={grades}
                            subjects={subjects}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center mt-12">
                    <img src="/image/noExam.png" alt="No Exams" className="h-40 mb-6" />
                    <p className="text-gray-300 text-lg">Hiện tại không có bài kiểm tra nào</p>
                </div>
            )}
        </div>
    );
};

export default AllTestsTab;
