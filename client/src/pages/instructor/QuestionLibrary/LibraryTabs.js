// QuestionLibraryTabs.js
import React from 'react';

const QuestionLibraryTabs = ({ activeTab, onChangeTab }) => {
  return (
    <div className="bg-secondary shadow-sm">
      <nav className="flex justify-between items-center px-12 pt-5">
        <div className="flex space-x-6">
          <button
            className={`text-gray-600 hover:text-purple-700 pb-2 tag-menu ${activeTab === '1' ? 'border-b-2 border-purple-700' : ''}`}
            onClick={() => onChangeTab('1')}
          >
            Tạo ngân hàng câu hỏi
          </button>
          <button
            className={`text-gray-600 hover:text-purple-700 pb-2 tag-menu ${activeTab === '2' ? 'border-b-2 border-purple-700' : ''}`}
            onClick={() => onChangeTab('2')}
          >
            Môn học
          </button>
          <button
            className={`text-gray-600 hover:text-purple-700 pb-2 tag-menu ${activeTab === '3' ? 'border-b-2 border-purple-700' : ''}`}
            onClick={() => onChangeTab('3')}
          >
            Chương học
          </button>
          <button
            className={`text-gray-600 hover:text-purple-700 pb-2 tag-menu ${activeTab === '4' ? 'border-b-2 border-purple-700' : ''}`}
            onClick={() => onChangeTab('4')}
          >
            Khối học
          </button>
        </div>
      </nav>
    </div>
  );
};

export default QuestionLibraryTabs;
