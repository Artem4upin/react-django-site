import React, {ChangeEvent} from 'react';
import './Input.scss';

interface IInputProps extends React.HTMLProps<HTMLInputElement> {
    label?: string;
    type?: string;
    value?: string | number;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onInput?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    pattern?: string;
    className?: string;
    autoComplete?: string;
    min?: string;
}

function Input({
    id = 'input-id',
    name = 'input-name',
    label = '',
    type = 'text', 
    value='',
    onChange,
    onInput,
    placeholder = "",
    required = false,
    pattern,
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
        name={name}
        className={className}
        type={type}
        value={value}
        onChange={onChange}
        onInput={onInput}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        autoComplete={autoComplete}

      />
    </div>
  );
}

export default Input;