import React from 'react';
import 'styles/instructor/ExamCreate.css';
import { Button, Tooltip, Tabs, Popover, TimePicker, DatePicker } from 'antd';
import { X, Eye, Download, CalendarDays } from 'lucide-react';
import dayjs from 'dayjs';

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

function ExamHeader({ items, activeTab, onChangeTab }) {
    

    return (
        <header className="bg-white fixed top-0 left-0 right-0 shadow-lg h-20 z-50">
            <div className="w-full h-full px-8">
                <nav className="w-full h-full grid grid-cols-3 items-center">
                    {/* Logo (Left) */}
                    <div className="flex justify-start">
                        <Tooltip title="Cancel">
                            <button>
                                <X />
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
                                    <Button color="default" variant="text">
                                        <Eye />
                                    </Button>
                                </Tooltip>
                                <Tooltip placement="bottom" title="Export">
                                    <Button color="default" variant="text">
                                        <Download />
                                    </Button>
                                </Tooltip>
                                <div className="flex justify-center items-center space-x-2">
                                    <button className='button-outlined-custom-non-p px-2 py-2'>
                                        Save draft
                                    </button>
                                    <button className='button-normal-custom px-2 py-2'>
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
        </header>
    );
}

export default ExamHeader;
