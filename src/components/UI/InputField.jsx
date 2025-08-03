import React from 'react';

const InputField = ({ name, label, placeholder, type = 'text', value, onChange, onBlur,  className = '', inputRef }) => (
    <div>
        <label className={`text-sm font-medium text-gray-400 mb-1 block`}>{label}</label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            ref={inputRef}
            className={`keeper-ignore w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
        />
    </div>
);

export default InputField;
