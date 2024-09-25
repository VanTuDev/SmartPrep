import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Nếu bạn muốn ứng dụng của mình có thể hoạt động offline và tải nhanh hơn,
// hãy đăng ký service worker bằng cách sử dụng register() thay vì unregister()
serviceWorkerRegistration.register();

// Nếu bạn muốn bắt đầu đo lường hiệu suất ứng dụng, 
// hãy chuyển một hàm để log kết quả (ví dụ: reportWebVitals(console.log))
// hoặc gửi kết quả tới một endpoint phân tích.
reportWebVitals();
