import { useEffect, useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import { Col, DatePicker, Row } from 'antd';
import { Switch, InputNumber, TimePicker, Typography, message  } from 'antd';
import dayjs from 'dayjs';
import { updateExam } from 'store/examSlice';


const { Title } = Typography;

function TimeSetUp({exam, onUpdateExam}) {
    const [isDurationChecked, setIsDurationChecked] = useState(true);
    const [isStartDayChecked, setIsStartDayChecked] = useState(true);
    const [isEndDayChecked, setIsEndDayChecked] = useState(true);

    const [duration, setDuration] = useState(exam?.duration ? exam.duration : null);
    const [startDate, setStartDate] = useState(exam?.start_date ? dayjs(exam.start_date) : null);
    const [endDate, setEndDate] = useState(exam?.end_date ? dayjs(exam.end_date) : null);

    const dateFormatList = 'DD/MM/YYYY';
    const format = 'HH:mm';

    // Function to validate the start and end date
    const validateDates = (start, end) => {
        const now = dayjs(); // Get the current time

        if (start && start.isBefore(now)) {
            message.error("Start date cannot be in the past.");
            return false;
        }

        if (start && end && end.isBefore(start)) {
            message.error("End date must be after the start date.");
            return false;
        }

        return true;
    };


    const onDurationChange = (checked) => {
        setIsDurationChecked(checked)
    };

    const onStartDateChange = (checked) => {
        setIsStartDayChecked(checked)
    };

    const onEndDateChange = (checked) => {
        setIsEndDayChecked(checked)
    };

    const handleDurationChange = (value) => {
        setDuration(value);
        onUpdateExam({ ...exam, duration: value });
    };

    const handleStartDateChange = (value) => {
        const newStartDate = dayjs(value); // Tạm thời lưu start date
        setStartDate(newStartDate);

        // Kiểm tra nếu đã có end date thì mới kiểm tra logic
        if (endDate && validateDates(newStartDate, endDate)) {
            onUpdateExam({ ...exam, start_date: newStartDate.toISOString(), end_date: endDate.toISOString() });
        } else if (!endDate) {
            // Nếu chưa có end date thì chỉ lưu start date
            onUpdateExam({ ...exam, start_date: newStartDate.toISOString() });
        }
    };

    const handleEndDateChange = (value) => {
        const newEndDate = dayjs(value); // Tạm thời lưu end date
        setEndDate(newEndDate);

        // Kiểm tra nếu đã có start date thì mới kiểm tra logic
        if (startDate && validateDates(startDate, newEndDate)) {
            onUpdateExam({ ...exam, start_date: startDate.toISOString(), end_date: newEndDate.toISOString() });
        } else if (!startDate) {
            // Nếu chưa có start date thì chỉ lưu end date
            onUpdateExam({ ...exam, end_date: newEndDate.toISOString() });
        }
    };
    return (
        <>
            <Title level={4}>Setting up time</Title>
            {/* Duration */}
            <Row>
                <Col span={14}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        <Switch className='custom-switch' checked={isDurationChecked} onChange={onDurationChange} />
                        <div className='mx-4 w-full'>
                            <p className="text-lg font-medium">Duration</p>
                            <p className="text-sm text-gray-500 mt-0">Time limit for completing the exam starting from the beginning</p>
                        </div>
                    </div>
                </Col>
                <Col span={10}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        {isDurationChecked ? (
                            <InputNumber className='w-2/4' size='large' addonAfter={<p>Minute</p>} value={duration} onChange={handleDurationChange} />
                        ):(<></>)}
                    </div>
                </Col>
            </Row>

            {/* Start time for the exam */}
            <Row className='mt-4'>
                <Col span={14}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        <Switch className='custom-switch' checked={isStartDayChecked} onChange={onStartDateChange} />
                        <div className='mx-4 w-full'>
                            <p className="text-lg font-medium">Start time for the exam</p>
                            <p className="text-sm text-gray-500 mt-0">The regulation for the start time of an exam is that users cannot begin the exam before the designated start time</p>
                        </div>
                    </div>
                </Col>
                <Col span={10}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        {isStartDayChecked ? 
                        (<div className='flex justify-between'>
                            <TimePicker size='large' className='w-1/3' value={startDate} onChange={handleStartDateChange} format={format} />
                            <DatePicker size='large' value={startDate} onChange={handleStartDateChange} needConfirm format={dateFormatList} />
                        </div>)
                        :(<></>)
                    }
                    </div>
                </Col>
            </Row>

            {/* End time for the exam */}
            <Row className='mt-4'>
                <Col span={14}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        <Switch className='custom-switch' checked={isEndDayChecked} onChange={onEndDateChange} />
                        <div className='mx-4 w-full'>
                            <p className="text-lg font-medium">End time for the exam</p>
                            <p className="text-sm text-gray-500 mt-0">The regulation for the end time of an exam is that users will not be able to continue the exam after the designated end time. If a user is in the middle of the exam, the exam will automatically stop and submit when this time is reached.</p>
                        </div>
                    </div>
                </Col>
                <Col span={10}>
                    <div className='flex items-start w-full rounded-lg p-2'>
                        {isEndDayChecked ? 
                        (<div className='flex justify-between'>
                            <TimePicker size='large' className='w-1/3'value={endDate} onChange={handleEndDateChange} format={format} />
                            <DatePicker size='large' value={endDate} onChange={handleEndDateChange} needConfirm format={dateFormatList} />
                        </div>)
                        :(<></>)
                    }
                    </div>
                </Col>
            </Row>

        </>
    );
}

export default TimeSetUp;