import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full py-2 border-b-[1px] text-sm border-gray-500 focus:outline-none"
      />
    </div>
  );
};

export default InputField;
