import React from 'react';
import './Input.css';

function Input({ 
    id, 
    name, 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    required = false,
    pattern,
    className = 'input',
    autoComplete = 'on'
}) {
  return (
    <div className='input'>
      {label && (
        <label 
        htmlFor={id} 
        className="input__label"
        >
        {label}
        </label>
      )}
      <input
        id={id}
        name={name || id} 
        className={className}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default Input;