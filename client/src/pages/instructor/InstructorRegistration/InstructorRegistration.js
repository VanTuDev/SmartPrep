import React, { useState } from 'react';
import { Steps, Button, Form, Input, Upload, message, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { TextArea } = Input;

const InstructorRegistration = () => {
    const [current, setCurrent] = useState(0);
    const [finished, setFinished] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        specialization: '',
        identityCard: null,
        cvFile: null,
    });

    const steps = [
        {
            title: 'Thông tin cơ bản',
            content: <BasicInfoForm formData={formData} setFormData={setFormData} />,
        },
        {
            title: 'Tải ảnh căn cước',
            content: <UploadIdentityCard formData={formData} setFormData={setFormData} />,
        },
        {
            title: 'Tải CV',
            content: <UploadCV formData={formData} setFormData={setFormData} />,
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('bio', formData.bio);
            formDataToSend.append('specialization', formData.specialization);
            formDataToSend.append('citizenIdPhotos', formData.identityCard);
            formDataToSend.append('cv', formData.cvFile);

            const response = await fetch('http://localhost:5000/api/access_instructor/applications', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add the token here
                },
            });

            if (response.ok) {
                message.success('Nộp hồ sơ thành công!');
                setFinished(true);
            } else {
                message.error('Có lỗi xảy ra khi nộp hồ sơ!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi nộp hồ sơ!');
        }
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

const BasicInfoForm = ({ formData, setFormData }) => {
    const [form] = Form.useForm();

    const handleChange = (changedValues) => {
        setFormData({
            ...formData,
            ...changedValues,
        });
    };

    return (
        <Form form={form} layout="vertical" onValuesChange={handleChange}>
            <Form.Item
                name="bio"
                label="Bio (Tiểu sử)"
                className="mb-5"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin đầy đủ!' }]}
                tooltip={{
                    title: 'Giới thiệu ngắn về bản thân, bao gồm sở thích, điểm mạnh, hoặc kinh nghiệm nổi bật.',
                    placement: 'topLeft',
                    overlayClassName: 'tooltip-custom',
                }}
            >
                <TextArea placeholder="Nhập bio của bạn" autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>

            <Form.Item
                name="specialization"
                label="Specialization (Chuyên môn)"
                rules={[{ required: true, message: 'Vui lòng nhập thông tin đầy đủ!' }]}
                tooltip={{
                    title: 'Nêu rõ lĩnh vực bạn có chuyên môn hoặc mong muốn phát triển, như phát triển web, game, phân tích dữ liệu, v.v.',
                    placement: 'topLeft',
                    overlayClassName: 'tooltip-custom',
                }}
            >
                <TextArea placeholder="Nhập chuyên môn của bạn" autoSize={{ minRows: 5, maxRows: 6 }} />
            </Form.Item>
        </Form>
    );
};

const UploadIdentityCard = ({ formData, setFormData }) => {
    const uploadProps = {
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ được phép tải lên file JPG/PNG!');
            } else {
                setFormData({
                    ...formData,
                    identityCard: file,
                });
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

const UploadCV = ({ formData, setFormData }) => {
    const uploadProps = {
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            if (!isPDF) {
                message.error('Chỉ được phép tải lên file PDF!');
            } else {
                setFormData({
                    ...formData,
                    cvFile: file,
                });
            }
            return isPDF || Upload.LIST_IGNORE;
        },
    };

    return (
        <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Tải lên CV PDF</Button>
        </Upload>
    );
};

export default InstructorRegistration;
