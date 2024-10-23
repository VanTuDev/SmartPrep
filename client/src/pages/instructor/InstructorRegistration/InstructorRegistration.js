import React, { useState } from 'react';
import { Steps, Button, Form, Input, Upload, message, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';


const { Step } = Steps;

const InstructorRegistration = () => {
    const [current, setCurrent] = useState(0);
    const [finished, setFinished] = useState(false);

    const steps = [
        {
            title: 'Thông tin cơ bản',
            content: <BasicInfoForm />,
        },
        {
            title: 'Tải ảnh căn cước',
            content: <UploadIdentityCard />,
        },
        {
            title: 'Tải CV',
            content: <UploadCV />,
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSubmit = () => {
        message.success('Nộp hồ sơ thành công!');
        setFinished(true);
    };

    if (finished) {
        return (
            <div className="w-full max-w-2xl mx-auto p-4">
                <Result
                    status="success"
                    title="Nộp hồ sơ thành công!"
                    subTitle="Admin sẽ xét duyệt hồ sơ của bạn trong khoảng 3 đến 4 ngày nữa. Vui lòng chờ thông báo qua email."
                    extra={[
                        <Button type="primary" key="home">
                            Về trang chủ
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-4">
            <Steps current={current} className="mb-6">
                {steps.map((item) => (
                    <Step key={item.title} title={item.title} />
                ))}
            </Steps>
            <div className="p-4 bg-white shadow-md rounded-md">
                {steps[current].content}
            </div>
            <div className="mt-4 flex justify-between">
                {current > 0 && (
                    <Button onClick={() => prev()}>
                        Quay lại
                    </Button>
                )}
                {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => next()}>
                        Tiếp tục
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" onClick={handleSubmit}>
                        Nộp hồ sơ
                    </Button>
                )}
            </div>
        </div>
    );
};

const BasicInfoForm = () => {
    return (
        <Form layout="vertical">
            <Form.Item label="Tên đầy đủ" name="fullname" rules={[{ required: true, message: 'Vui lòng nhập tên đầy đủ!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                <Input />
            </Form.Item>
        </Form>
    );
};

const UploadIdentityCard = () => {
    const uploadProps = {
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ được phép tải lên file JPG/PNG!');
            }
            return isJpgOrPng || Upload.LIST_IGNORE;
        },
    };

    return (
        <Upload {...uploadProps} listType="picture">
            <Button icon={<UploadOutlined />}>Tải lên ảnh căn cước</Button>
        </Upload>
    );
};

const UploadCV = () => {
    const [fileUrl, setFileUrl] = useState(null);

    const uploadProps = {
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('Chỉ được phép tải lên file PDF!');
            }
            if (isPDF) {
                const fileReader = new FileReader();
                fileReader.onload = function (e) {
                    setFileUrl(e.target.result);
                };
                fileReader.readAsDataURL(file);
            }
            return isPDF || Upload.LIST_IGNORE;
        },
    };

    return (
        <div>
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Tải lên CV PDF</Button>
            </Upload>
        </div>
    );
};

export default InstructorRegistration;
