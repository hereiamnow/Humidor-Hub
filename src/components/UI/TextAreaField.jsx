import React from 'react';

const TextAreaField = ({ name, label, placeholder, value, onChange, theme, className = '', rows = 3 }) => (
    <div>
        <label className={`text-sm font-medium text-gray-400 mb-1 block`}>{label}</label>
        <textarea
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            rows={rows}
            className={`keeper-ignore w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
        />
    </div>
);

export default TextAreaField;
