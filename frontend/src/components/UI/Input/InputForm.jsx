import React from 'react';

function InputForm({
  id,
  name,
  label,
  type = 'text',
  register,
  validation,
  error,
  placeholder = '',
  autoComplete = 'on',
  className = 'input'
}) {
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