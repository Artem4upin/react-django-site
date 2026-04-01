import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form' 
import { api } from '../../api'
import './LoginPage.scss'
import { AuthContext } from '../../hooks/AuthContext'
import Button from '../../components/UI/Buttons/Button'
import InputForm from '../../components/UI/Inputs/InputForm'

interface ILoginFormData {
  username: string;
  email?: string;
  password: string;
  password_repeat?: string;
  privacy_checkbox?: boolean;
}

function LoginPage() { 
  const { setUser } = useContext(AuthContext)
  const [isRegistration, setIsRegistration] = useState(false)
  const [loading, setLoading] = useState(false)
  const [responseError, setResponseError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ILoginFormData>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_repeat: '',
      privacy_checkbox: false,
    }
  })

  const password = watch('password')

  const onSubmit = async (data: ILoginFormData) => {
    setLoading(true)
    setResponseError('')

    try {
      const loginURL = isRegistration ? '/auth/register/' : '/auth/login/'
      const dataToSend = isRegistration 
        ? data 
        : { username: data.username, password: data.password }
      
      const response = await api.post(loginURL, dataToSend)
      
      if (response.status === 200 || response.data.success) {
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        reset()
        navigate('/account')
      }
    } catch (error: any) {
      if (error.response) {
        setResponseError(error.response.data.error || `Ошибка ${isRegistration ? 'регистрации' : 'входа'}`)
      } else if (error.request) {
        setResponseError('Ошибка сети')
      } else {
        setResponseError('Произошла ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsRegistration(!isRegistration)
    setResponseError('')
    reset({
      username: '',
      email: '',
      password: '',
      password_repeat: '',
      privacy_checkbox: false,
    })
  }

  return (
    <div className="login-page">
      <div className="login-page__auth-container">
        <h2>{isRegistration ? 'Регистрация' : 'Вход'}</h2>
        
        {responseError && <div className="login-page__error-message">{responseError}</div>}
        
        <form className='login-page__auth-form' onSubmit={handleSubmit(onSubmit)}>
          {isRegistration && (
            <InputForm
              id="email"
              name="email"
              label="Email"
              type="text" 
              register={register}
              validation={{
                required: 'Email обязателен',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Некорректный email'
                }
              }}
              error={errors.email}
              autoComplete="off"
            />
          )}
          
          <InputForm
            id="username"
            name="username"
            label="Логин"
            type="text"
            register={register}
            validation={{
              required: 'Логин обязателен',
              minLength: {
                value: 5,
                message: 'Минимум 5 символов'
              },
              maxLength: {
                value: 50,
                message: 'Максимум 50 символов'
              }
            }}
            error={errors.username}
            autoComplete="off"
          />
          
          <InputForm
            id="password"
            name="password"
            label="Пароль"
            type="password"
            register={register}
            validation={{
              required: 'Пароль обязателен',
              minLength: {
                value: 4,
                message: 'Минимум 4 символа'
              },
              maxLength: {
                value: 50,
                message: 'Максимум 50 символов'
              }
            }}
            error={errors.password}
            autoComplete="off"
          />
          
          {isRegistration && (
              <>
            <InputForm
              id="password_repeat"
              name="password_repeat"
              label="Повторите пароль"
              type="password"
              register={register}
              validation={{
                required: 'Повтор пароля обязателен',
                validate: (value: string) => value === password || 'Пароли не совпадают'
              }}
              error={errors.password_repeat}
              autoComplete="off"
            />
                <div className='login-page__privacy-checkbox'
                >
                  <InputForm
                  id="privacy_checkbox"
                  name="privacy_checkbox"
                  label='Я принимаю политику кониденциальности и условия использования'
                  type="checkbox"
                  register={register}
                  validation={{
                    required: 'Необходимо подтвердить согласие',
                  }}
                  error={errors.privacy_checkbox}
                  />
                </div>
              </>
          )}
          
          <Button  
            type="submit"
            className="submit-btn"
            disabled={loading} 
            text={loading 
              ? (isRegistration ? 'Регистрация...' : 'Вход...') 
              : (isRegistration ? 'Зарегистрироваться' : 'Войти')
            }
          />
        </form>
        
        <div className="login-page__auth-links">
          <button 
            className="switch-mode-btn"
            onClick={switchMode}
            type="button"
          >
            {isRegistration 
              ? 'Войти' 
              : 'Зарегистрироваться'
            }
          </button>
        </div>

        <Link to="/" className="login-page__back-link">На главную</Link>
      </div>
    </div>
  );
}

export default LoginPage