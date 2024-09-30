import React from 'react';
import { Collapse } from 'antd';
import '../CustomCollapse.css'

const { Panel } = Collapse;

const SingleCollapse = ({ header, children }) => {
  return (
    <Collapse size='large' className='shadow-xl'>
      <Panel className='custom-header' header={header} key="1">
        <div className='custom-body'>
          {children}
        </div>
      </Panel>
    </Collapse>
  );
};

export default SingleCollapse;
