import React from 'react';

const TextAreaField = ({ name, label, placeholder, value, onChange, className = '', rows = 3 }) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <textarea
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            rows={rows}
            className={`textarea textarea-bordered w-full keeper-ignore ${className}`}
        />
    </div>
);

export default TextAreaField;
