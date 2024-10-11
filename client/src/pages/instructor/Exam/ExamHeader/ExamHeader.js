import { useState } from 'react';
import 'styles/instructor/ExamCreate.css';
import { useDispatch, useSelector } from 'react-redux';
import { createExam, updateExamAPI, updateExam } from 'store/examSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Tooltip, Tabs, Popover, TimePicker, DatePicker, message } from 'antd';
import { X, Eye, Download, CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';
import PreviewExam from '../ExamCreate/Preview/PreviewExam';
import ExportPdfPage from '../ExamCreate/ExportPDF/ExportPdfPage';

const dateFormatList = 'DD/MM/YYYY';
const format = 'HH:mm';

const schedulePost = (
    <div className='p-3'>
        <div className='flex justify-center text-base font-bold'>Schedule and post content</div>
        <div className='flex justify-between mt-3'>
            <TimePicker size='large' className='w-1/3' defaultValue={dayjs('17:00', format)} format={format} />
            <DatePicker size='large' defaultValue={dayjs('06/10/2024', dateFormatList)} needConfirm format={dateFormatList} />
        </div>
        <div className='flex justify-end mt-2'>
            <button className='button-normal-custom px-2 py-2' >Save</button>
        </div>
    </div>
);

function ExamHeader({ items, activeTab, onChangeTab, setExamId, examId }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [openPreview, setOpenPreview] = useState(false);
    const [openExportPage, setOpenExportPage] = useState(false);

    const handleOpenPreview = () => {
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
    };

    const handleOpenExportPage = () => {
        setOpenExportPage(true);
    };

    const handleCloseExportPage = () => {
        setOpenExportPage(false);
    };

    const { exam, loading, error } = useSelector((state) => state.exam);

    const handleSubmit = (isPost) => {

        // Validate exam data
        if (!exam.title || !exam.description || !exam.questions.length) {
            message.error("Please fill out all required fields: title, description, and at least one question.");
            return;
        }

        // Validate time fields
    const now = dayjs(); // Current time
    const startTime = dayjs(exam.start_date);
    const endTime = dayjs(exam.end_date);

    if (exam.start_date && startTime.isBefore(now)) {
        message.error("Start time cannot be in the past.");
        return;
    }

    if (exam.start_date && exam.end_date && endTime.isBefore(startTime)) {
        message.error("End time must be after the start time.");
        return;
    }

        const updatedExam = { ...exam, status: isPost ? 'published' : 'draft' };

        // Dispatch the updateExam action to update Redux state
        dispatch(updateExam(updatedExam)); // This updates the local state


        // Dispatch the appropriate Redux action
        if (examId) {
            dispatch(updateExamAPI({ examId, examData: updatedExam }))
                .then((resultAction) => {
                    if (updateExamAPI.fulfilled.match(resultAction)) {
                        message.success("Exam updated successfully!");
                        navigate('/instructor/dashboard');
                    } else {
                        message.error(`Error updating exam: ${resultAction.payload || 'Unknown error'}`);
                    }
                })
                .catch((err) => message.error(`Error updating exam: ${err.message}`));
        } else {
            dispatch(createExam(updatedExam))
                .then((resultAction) => {
                    if (createExam.fulfilled.match(resultAction)) {
                        message.success("Exam created successfully!");
                        navigate('/instructor/dashboard');
                    } else {
                        message.error(`Error creating exam: ${resultAction.payload || 'Unknown error'}`);
                    }
                })
                .catch((err) => message.error(`Error creating exam: ${err.message}`));
        }
    };

    const handleOnCancel = () => {
        setExamId(null);
        navigate('/instructor/dashboard')
    }

    return (
        <header className="bg-white fixed top-0 left-0 right-0 shadow-lg h-20 z-50">
            <div className="w-full h-full px-8">
                <nav className="w-full h-full grid grid-cols-3 items-center">
                    {/* Logo (Left) */}
                    <div className="flex justify-start">
                        <Tooltip title="Cancel">
                            <button>
                                <X onClick={handleOnCancel} />
                            </button>
                        </Tooltip>
                    </div>

                    {/* Tabs (Center) */}
                    <div className="flex justify-center h-full">
                        <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} className="h-full" />
                    </div>

                    {/* Action Buttons (Right) */}
                    <div className="flex justify-end space-x-1">
                        {activeTab === '1' && (
                            <>
                                <Tooltip placement="bottom" title="Preview">
                                    <Button onClick={handleOpenPreview} color="default" variant="text">
                                        <Eye />
                                    </Button>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Export">
                                    <Button onClick={handleOpenExportPage} color="default" variant="text">
                                        <Download />
                                    </Button>
                                </Tooltip>
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => handleSubmit(false)}
                                        className='button-outlined-custom-non-p px-2 py-2'>
                                        Save draft
                                    </button>
                                    <button onClick={() => handleSubmit(true)} className='button-normal-custom px-2 py-2'>
                                        Post
                                    </button>
                                    <Popover content={schedulePost} placement="bottomRight" trigger="click">
                                        <button className='button-normal-custom px-2 py-2'><CalendarDays /></button>
                                    </Popover>
                                </div>
                            </>
                        )}
                    </div>
                </nav>
            </div>
            <PreviewExam
                visible={openPreview}
                onClose={handleClosePreview}
                exam={exam}
            />
            <ExportPdfPage
                visible={openExportPage}
                onClose={handleCloseExportPage}
                exam={exam}
            />
        </header>
    );
}

export default ExamHeader;
