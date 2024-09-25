import React from 'react';

const InputField = ({ label, value, onChange, type = 'text' }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-bold mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>
    );
};

export default InputField;
