import React from 'react';

const InputField = ({ name, label, placeholder, type = 'text', value, onChange, onBlur, className = '', inputRef }) => (
    <div className="form-control w-full">
        <label className="label">
            <span className="label-text">{label}</span>
        </label>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value || ''}
            onChange={onChange}
            onBlur={onBlur}
            ref={inputRef}
            className={`input input-bordered w-full keeper-ignore ${className}`}
        />
    </div>
);

export default InputField;
