import React, { useState } from 'react';
import QuestionLibraryTabs from './LibraryTabs';
import QuestionList from './QuestionList';
import Header from '../../../components/instructor/InstructorHeader';
import CategoryList from './CategoryList';
import GroupList from './GroupList';
import GradeList from './GradeList';
const QuestionLibrary = () => {
  const [activeTab, setActiveTab] = useState('1');

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return <QuestionList />;
      case '2':
        return <CategoryList />;
      case '3':
        return <GroupList />;
      case '4':
        return <GradeList />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header className="w-full" />
      <QuestionLibraryTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      <div className="bg-white p-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default QuestionLibrary;
