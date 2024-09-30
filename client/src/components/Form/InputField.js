import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="flex gap-4 items-center w-full mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        className="w-full py-2 border-b-[1.1px] text-sm border-gray-500 focus:outline-none"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
