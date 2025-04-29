import React from 'react';

const Input = ({
    label,
    type = "text",
    className = "",
    inputClassName = "",
    placeholder = "",
    value,
    onChange,
    ...rest
    
}) => {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && <label className="text-base font-bold">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`px-3 py-2 border border-gray rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputClassName}`}
                {...rest}
                required={true}
            />
        </div>
    );
};

export default Input;
