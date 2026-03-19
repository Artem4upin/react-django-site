import React from 'react';
import {FieldError, UseFormRegister} from "react-hook-form";

interface IInputFormProps {
  id?: string;
  name: string;
  label?: string;
  type?: string;
  register: UseFormRegister<any>;
  validation?: object;
  error?: FieldError;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
}

function InputForm({
  id= '',
  name = '',
  label = '',
  type = 'text',
  register,
  validation = {},
  error,
  placeholder = '',
  autoComplete = 'on',
  className = 'input-form'
}: IInputFormProps) {
  return (
    <div className='input-form'>
      {label && (
        <label htmlFor={id} className="input-form__label">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={className}
        {...register(name, validation)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && (
        <div className="input-form__error">{error.message}</div>
      )}
    </div>
  );
}

export default InputForm;