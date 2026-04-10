import React from 'react';
import {FieldError, UseFormRegister} from "react-hook-form";
import {getErrorMsg} from "../../../utils/errorMassages";
import ErrorMessage from "../../ErrorMessage/ErrorMessage";

interface IInputFormProps {
  id?: string;
  name?: string;
  label?: string | React.ReactNode;
  type?: string;
  register?: UseFormRegister<any>;
  validation?: object;
  error?: FieldError;
  placeholder?: string;
  autoComplete?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  className = 'input-form',
  value,
  onChange,
}: IInputFormProps) {
  if (type == 'checkbox') {
    return (
        <div className='input-form-checkbox'>
          <input
              id={id}
              type={type}
              className={className}
              {...(register ? register(name, validation) : {})}
              placeholder={placeholder}
              autoComplete={autoComplete}
          />
          {label && (
              <label htmlFor={id} className="input-form__label">
                {label}
              </label>
          )}
          {error && (
              <ErrorMessage className="input-form__error" errorMsg={error.message || 'Ошибка чекбокса формы'} />
          )}
        </div>
    )
  }

  const inputProps = value !== undefined && onChange
    ? { value, onChange }
    : (register ? register(name, validation) : {});

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
        {...inputProps}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && (
          <ErrorMessage className="input-form__error" errorMsg={error.message || 'Ошибка поля формы'} />
      )}
    </div>
  );
}

export default InputForm;