import { useEffect, useState } from 'react';
import 'styles/instructor/ExamCreate.css'
import { useSelector, useDispatch } from 'react-redux';
import { Forward, Plus } from 'lucide-react';
import { Switch, Input, Typography, Modal, message, QRCode, Tabs, Segmented, Empty } from 'antd';
import { generateUniqueTestLink } from 'utils/generateUniqueExamLink';
import { updateExam } from 'store/examSlice';

const { Title } = Typography;

const items = [
    {
        key: '1',
        label: 'Link',
    },
    {
        key: '2',
        label: 'QR Code',
    }
];

function doDownload(url, fileName) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  const downloadCanvasQRCode = () => {
    const canvas = document.getElementById('myqrcode')?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL();
      doDownload(url, 'QRCode.png');
    }
  };
  const downloadSvgQRCode = () => {
    const svg = document.getElementById('myqrcode')?.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    doDownload(url, 'QRCode.svg');
  };

function AccessControl({exam}) {
    const [isPublicChecked, setIsPublicChecked] = useState(exam?.access_type === 'public')
    const [accessType, setAccessType] = useState(exam?.access_type === 'public'? "public":"private")
    const [modalVisibility, setModalVisibility] = useState({ share: false, addMember: false });
    const [accessLink, setAccessLink] = useState(exam?.access_link || generateUniqueTestLink());
    const [activeTab, setActiveTab] = useState('1');
    const [renderType, setRenderType] = useState('canvas');

    const dispatch = useDispatch();

    useEffect(() => {
        const updatedExam = {...exam, access_type: accessType, access_link: accessLink}
        dispatch(updateExam(updatedExam))
    }, [accessLink, isPublicChecked]);

    const onChangeTab = (key) => {
        setActiveTab(key)
    }

    // Functions to handle Modal visibility
    const showModal = (modalType) => {
        setModalVisibility((prev) => ({ ...prev, [modalType]: true }));
    };

    const handleModalOk = (modalType) => {
        setModalVisibility((prev) => ({ ...prev, [modalType]: false }));
    };

    const handleModalCancel = (modalType) => {
        setModalVisibility((prev) => ({ ...prev, [modalType]: false }));
    };

    const onChange = (checked) => {
        setIsPublicChecked(checked)
        setAccessType(checked?"public":"private")
    };

    // Function to handle copying the link
    const handleCopy = () => {
        navigator.clipboard.writeText(accessLink); // Copy the link to clipboard
        message.success("Copied!")
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
                                <div className='text-lg font-normal primary-color italic underline hover:cursor-pointer'>{accessLink}</div>
                                <button
                                    class="button-outlined-custom font-semibold space-x-2"
                                    onClick={() => showModal('share')}
                                >
                                    <Forward size={24} />
                                    Share
                                </button>
                            </div>
                        ) :
                        (
                            <div className='mt-3 w-full flex justify-between items-start'>
                                <p className="text-lg font-medium">Members take the test</p>
                                <button
                                    class="button-outlined-custom font-semibold space-x-2"
                                    onClick={() => showModal('addMember')}
                                >
                                    <Plus size={24} />
                                    Add member
                                </button>
                            </div>
                        )
                    }

                </div>
            </div>

            {/* Share Modal */}
            <Modal
                visible={modalVisibility.share}
                onOk={() => handleModalOk('share')}
                onCancel={() => handleModalCancel('share')}
                footer={null}
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChangeTab} className="h-full" />
                {activeTab === '1' && (
                    <>
                        <p className='font-bold mb-3'>Share this link with others to give them access to the test:</p>
                        <Input className='input-custom' value={accessLink} readOnly onClick={handleCopy} />
                    </>
                )}
                {activeTab === '2' && (
                    <>
                        <div className='flex justify-center flex-col items-center space-y-3'>
                            <QRCode
                                type={renderType}
                                value={accessLink}
                                icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                            />
                            <Segmented options={['canvas', 'svg']} onChange={(val) => setRenderType(val)} />
                            <button
                                onClick={renderType === 'canvas' ? downloadCanvasQRCode : downloadSvgQRCode}
                                className='button-normal-custom p-3'
                            >
                                Download
                            </button>
                        </div>
                    </>
                )}
            </Modal>

            {/* Add Member Modal */}
            <Modal
                visible={modalVisibility.addMember}
                onCancel={() => handleModalCancel('addMember')}
                footer={null}
            >
                <Empty/>
            </Modal>
        </>
    );
}

export default AccessControl;