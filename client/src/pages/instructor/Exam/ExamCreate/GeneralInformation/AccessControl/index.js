import { useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import { Pencil, Captions, Forward, Plus } from 'lucide-react';
import { Typography } from 'antd';
import { Input } from 'antd';
import { Switch, Button } from 'antd';


const { Title, Text, Link } = Typography;
const { TextArea } = Input;

function AccessControl() {
    const [isPublicChecked, setIsPublicChecked] = useState(true)

    const onChange = (checked) => {
        setIsPublicChecked(checked)
    };
    return (
        <>
            <Title level={4}>Setting up the target audience for the test</Title>
            <div className='flex items-start w-full rounded-lg p-2'>
                <Switch className='custom-switch' checked={isPublicChecked} onChange={onChange} />
                <div className='mx-4 w-full'>
                    <p className="text-lg font-medium">Public</p>
                    <p className="text-sm text-gray-500 mt-0">Anyone with this link can take the test</p>
                    {isPublicChecked ?
                        (
                            <div className='mt-3 w-full flex justify-between items-start'>
                                <div className='text-lg font-normal primary-color italic underline hover:cursor-pointer'>https://app.ninequiz.com/9DRWLVCS</div>
                                <button class="button-outlined-custom font-semibold space-x-2">
                                    <Forward size={24} />
                                    Share
                                </button>
                            </div>
                        ) :
                        (
                            <div className='mt-3 w-full flex justify-between items-start'>
                                <p className="text-lg font-medium">Members take the test</p>
                                <button class="button-outlined-custom font-semibold space-x-2">
                                    <Plus size={24} />
                                    Add number
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default AccessControl;