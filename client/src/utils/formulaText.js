import React from 'react';

const formatBulletPoints = (text) => {
    // Tách chuỗi text bằng ký hiệu bullet point (•)
    const lines = text.split('•').map(line => line.trim()).filter(line => line.length > 0);
    
    // Trả về một danh sách các dòng mới
    return lines.map((line, index) => (
       <React.Fragment key={index}>
          {line}
          <br />
       </React.Fragment>
    ));
 };

 export default formatBulletPoints;