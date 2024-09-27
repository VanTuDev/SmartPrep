import { useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import { Pencil, Captions, Forward, Plus } from 'lucide-react';
import { Typography } from 'antd';
import { Input } from 'antd';
import { Switch, Button } from 'antd';
import AccessControl from './AccessControl';
import TimeSetUp from './TimeSetup';


const { Title, Text, Link } = Typography;
const { TextArea } = Input;

function GeneralInformation() {
    const [value, setValue] = useState('');

    return (
        <div>
            {/* Input Brief  */}
            <div>
                <div className="flex items-start w-full rounded-lg p-2">
                    <Captions className='primary-color' />
                    <Input
                        className='mx-4 input-custom'
                        size='large'
                        placeholder="Test title"
                    />
                </div>

                <div className="flex items-start w-full rounded-lg p-2">
                    <Pencil className='primary-color' />
                    <TextArea
                        className='mx-4 input-custom'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Brief description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
            </div>

            {/* Setup State  */}
            <div className='mt-6'>
                <AccessControl />
            </div>

            {/* Setup Time  */}
            <div className='mt-6'>
                <TimeSetUp />
            </div>
        </div>
    );
}

export default GeneralInformation;