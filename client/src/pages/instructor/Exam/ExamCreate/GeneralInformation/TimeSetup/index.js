import { useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import { Col, DatePicker, Row } from 'antd';
import { Pencil, Captions, Forward, Plus } from 'lucide-react';
import { Typography } from 'antd';
import { Input } from 'antd';
import { Switch, Button, InputNumber, TimePicker  } from 'antd';
import dayjs from 'dayjs';


const { Title, Text, Link } = Typography;
const { TextArea } = Input;

function TimeSetUp() {
    const [isDurationChecked, setIsDurationChecked] = useState(true);
    const [isStartDayChecked, setIsStartDayChecked] = useState(true);
    const [isEndDayChecked, setIsEndDayChecked] = useState(true);

    const dateFormatList = 'DD/MM/YYYY';
    const format = 'HH:mm';

    const onDurationChange = (checked) => {
        setIsDurationChecked(checked)
    };

    const onStartDateChange = (checked) => {
        setIsStartDayChecked(checked)
    };

    const onEndDateChange = (checked) => {
        setIsEndDayChecked(checked)
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
                            <InputNumber className='w-2/4' size='large' addonAfter={<p>Minute</p>} defaultValue={60} />
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
                            <TimePicker size='large' className='w-1/3' defaultValue={dayjs('17:00', format)} format={format} />
                            <DatePicker size='large' defaultValue={dayjs('06/10/2024', dateFormatList)} needConfirm format={dateFormatList} />
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
                            <TimePicker size='large' className='w-1/3' defaultValue={dayjs('17:00', format)} format={format} />
                            <DatePicker size='large' defaultValue={dayjs('06/10/2024', dateFormatList)} needConfirm format={dateFormatList} />
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