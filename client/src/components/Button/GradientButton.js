import React from 'react';
import { Button, ConfigProvider } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';

const GradientButton = ({ children, icon, ...props }) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: 'white', // Text color
            colorPrimaryHover: 'white',
            colorPrimaryText: 'white',
          },
        },
      }}
    >
      <Button
        type="primary"
        icon={icon}
        {...props}
        style={{
          position: 'relative',
          overflow: 'hidden',
          color: 'white',
          fontWeight: '500',
          background: 'linear-gradient(135deg, #6a8edc, #76c1ff)',
          border: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = 0.8)}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = 1)}
      >
        {children}
      </Button>
    </ConfigProvider>
  );
};

export default GradientButton;