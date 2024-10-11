import React from 'react';

const CardComponent = ({ icon, title, description }) => {
   return (
      <div className="flex flex-col items-center justify-center w-full p-8 bg-white rounded-lg shadow-md">
         <div className="mb-4">{icon}</div>
         <h3 className="mb-2 text-lg font-semibold text-gray-700">{title}</h3>
         <p className="text-sm text-gray-500">{description}</p>
      </div>
   );
};

export default CardComponent;
