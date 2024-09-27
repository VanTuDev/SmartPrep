import React from 'react';
import { Collapse, Button, Cascader, Dropdown, Space } from 'antd';
import '../CustomCollapse.css'
import { EllipsisVertical } from 'lucide-react';

const { Panel } = Collapse;

const options = [
    {
        value: 'notShuff',
        label: 'Do not shuffle',
    },
    {
        value: 'shuffQ',
        label: 'Shuffle questions',
    },
    {
        value: 'shuffQuA',
        label: 'Shuffle questions and answers',
    }
];

const items = [
    {
      label: "Delete",
      key: '0',
    }
  ];

const SectionCollapse = ({ header, extraHeader, children }) => {
    const onChange = (value) => {
        console.log(value);
    };

    const handleClick = (e) => {
        e.stopPropagation();
    };

    return (
        <Collapse size='large' className='shadow-xl'>
            <Panel
                className='custom-header bg-color'
                header={header}
                key="1"
                extra={<div onClick={handleClick} className='flex items-center'>
                    <Cascader options={options} defaultValue={options[0].value} onChange={onChange} placeholder="Please select" />
                    
                    <Dropdown
                        className='mx-3'
                        menu={{
                            items,
                        }}
                        trigger={['click']}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <EllipsisVertical />
                            </Space>
                        </a>
                    </Dropdown>
                </div>}
            >
                <div className='custom-body'>
                    {children}
                </div>
            </Panel>
        </Collapse>
    )
};

export default SectionCollapse;
