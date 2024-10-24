// THÔNG TIN CỦA BÀI TEST

import { useState, useEffect } from 'react';
import 'styles/instructor/ExamCreate.css';
import { Pencil, Captions } from 'lucide-react';
import { Input } from 'antd';
import AccessControl from './AccessControl/AccessControl';
import TimeSetUp from './TimeSetup/TimeSetup';

const { TextArea } = Input;

function GeneralInformation({ exam, onUpdateExam }) {
    const [title, setTitle] = useState(exam?.title || '');
    const [description, setDescription] = useState(exam?.description || '');
    const [selectedKhoi, setSelectedKhoi] = useState('');
    const [selectedMon, setSelectedMon] = useState('');
    const [monList, setMonList] = useState([]);

    // Dữ liệu môn học cho từng khối
    const category_id = {
        "10": ["Toán", "Vật Lý", "Hóa Học", "Ngữ Văn"],
        "11": ["Toán", "Lượng Giác", "Hóa Học", "Lịch Sử"],
        "12": ["Toán", "Địa Lý", "Vật Lý", "Giáo Dục Công Dân"]
    };

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

    const handleKhoiChange = (e) => {
        const khoi = e.target.value;
        setSelectedKhoi(khoi);
        setMonList(category_id[khoi] || []);
        setSelectedMon(''); // Reset môn học khi chọn khối mới
    };

    const handleMonChange = (e) => {
        setSelectedMon(e.target.value);
    };

    return (
        <div>
            {/* Input Brief */}
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

            {/* Setup State */}
            <div className='mt-6 p-3'>
                <AccessControl exam={exam} />
            </div>

            {/* Dropdown Khối và Môn Theo Hàng Ngang */}
            <div className="max-w-lg mt-6">
                <div className="flex items-center space-x-4">
                    {/* Dropdown Chọn Khối */}
                    <div className="flex-1">
                        <label
                            htmlFor="select-khoi"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Chọn Khối:
                        </label>
                        <select
                            id="select-khoi"
                            value={selectedKhoi}
                            onChange={handleKhoiChange}
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">-- Chọn Khối --</option>
                            <option value="10">Khối 10</option>
                            <option value="11">Khối 11</option>
                            <option value="12">Khối 12</option>
                        </select>
                    </div>

                    {/* Dropdown Chọn Môn */}
                    {monList.length > 0 && (
                        <div className="flex-1">
                            <label
                                htmlFor="select-mon"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Chọn Môn:
                            </label>
                            <select
                                id="select-mon"
                                value={selectedMon}
                                onChange={handleMonChange}
                                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">-- Chọn Môn --</option>
                                {monList.map((mon, index) => (
                                    <option key={index} value={mon}>
                                        {mon}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Setup Time */}
            <div className='mt-6'>
                <TimeSetUp exam={exam} onUpdateExam={onUpdateExam} />
            </div>
        </div>
    );
}

export default GeneralInformation;
