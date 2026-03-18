import React, {ChangeEvent} from 'react';
import './Input.css';

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
    id?: string;
    name?: string;
    label?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    pattern?: string;
    className?: string;
    autoComplete?: string;
    min?: string;
}

function Input({ 
    id = '',
    name = '',
    label = '',
    type = 'text', 
    value='',
    onChange,
    placeholder = "",
    required = false,
    pattern = "",
    className = 'input',
    autoComplete = 'on'
}: IInputProps) {
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
        name={name || id || ''} 
        className={className || 'input'}
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder || ''}
        required={required}
        pattern={pattern}
        autoComplete={autoComplete}
      />
    </div>
  );
}

export default Input;