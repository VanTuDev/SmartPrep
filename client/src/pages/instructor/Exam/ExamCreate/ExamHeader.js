// ExamHeader.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip, Tabs, Popover, DatePicker, TimePicker } from 'antd';
import { X, Eye, Download } from 'lucide-react';
import PreviewExam from './PreviewExam';
import ExportPdfPage from './ExportPdfPage';

const ExamHeader = ({ items, onChangeTab, onPost, onSaveDraft, loading, examData, currentTab }) => {
    const navigate = useNavigate();
    const [openPreview, setOpenPreview] = useState(false);
    const [openExportPage, setOpenExportPage] = useState(false);

    return (
        <header className="bg-white fixed top-0 left-0 right-0 shadow-lg h-20 z-50">
            <div className="w-full h-full px-8">
                <nav className="w-full h-full grid grid-cols-3 items-center">
                    <div className="flex justify-start">
                        <Tooltip title="Cancel">
                            <button onClick={() => navigate('/instructor/dashboard')}>
                                <X />
                            </button>
                        </Tooltip>
                    </div>

                    <div className="flex justify-center h-full">
                        <Tabs
                            activeKey={currentTab}  // Set active key to highlight the current tab
                            onChange={onChangeTab}
                            className="h-full"
                            items={items.map(item => ({
                                key: item.key,
                                label: (
                                    <span
                                        style={{
                                            color: currentTab === item.key ? '#1890ff' : 'inherit',  // Highlight color
                                            fontWeight: currentTab === item.key ? 'bold' : 'normal', // Bold font for active tab
                                        }}
                                    >
                                        {item.label}
                                    </span>
                                ),
                            }))}
                        />
                    </div>

                    <div className="flex justify-end space-x-1">
                        <Tooltip title="Preview">
                            <Button onClick={() => setOpenPreview(true)}>
                                <Eye />
                            </Button>
                        </Tooltip>

                        <Tooltip title="Export">
                            <Button onClick={() => setOpenExportPage(true)}>
                                <Download />
                            </Button>
                        </Tooltip>

                        {/* Save Draft Button */}
                        <Button onClick={onSaveDraft} type="default" loading={loading}>
                            Save Draft
                        </Button>

                        <Button onClick={onPost} type="primary" loading={loading}>
                            Post
                        </Button>

                        <Popover
                            placement="bottomRight"
                            content={
                                <div className="p-3">
                                    <div className="flex justify-center text-base font-bold">
                                        Schedule and post content
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <DatePicker />
                                        <TimePicker />
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button className="button-normal-custom px-2 py-2">
                                            Save
                                        </button>
                                    </div>
                                </div>
                            }
                            trigger="click"
                        >
                        </Popover>
                    </div>
                </nav>
            </div>

            <PreviewExam visible={openPreview} onClose={() => setOpenPreview(false)} exam={examData} />
            <ExportPdfPage visible={openExportPage} onClose={() => setOpenExportPage(false)} />
        </header>
    );
};

export default ExamHeader;
