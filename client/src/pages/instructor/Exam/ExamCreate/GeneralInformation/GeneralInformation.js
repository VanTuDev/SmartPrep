import { useState, useEffect } from 'react';
import 'styles/instructor/ExamCreate.css'
import { Pencil, Captions } from 'lucide-react';
import { Input } from 'antd';
import AccessControl from './AccessControl/AccessControl';
import TimeSetUp from './TimeSetup/TimeSetup';

const { TextArea } = Input;

function GeneralInformation({exam, onUpdateExam}) {
    const [title, setTitle] = useState(exam?.title || '');
    const [description, setDescription] = useState(exam?.description || '');

    useEffect(() => {
        setTitle(exam?.title || '');
        setDescription(exam?.description || '');
    }, [exam]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        onUpdateExam({ ...exam, title: e.target.value });
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        onUpdateExam({ ...exam, description: e.target.value });
    };

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
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>

                <div className="flex items-start w-full rounded-lg p-2">
                    <Pencil className='primary-color' />
                    <TextArea
                        className='mx-4 input-custom'
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Brief description"
                        autoSize={{ minRows: 3, maxRows: 5 }}
                    />
                </div>
            </div>

            {/* Setup State  */}
            <div className='mt-6'>
                <AccessControl exam={exam} />
            </div>

            {/* Setup Time  */}
            <div className='mt-6'>
                <TimeSetUp exam={exam} onUpdateExam={onUpdateExam}/>
            </div>
        </div>
    );
}

export default GeneralInformation;