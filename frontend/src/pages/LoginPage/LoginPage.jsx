import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form' 
import { api } from '../../api'
import './LoginPage.css'
import { AuthContext } from '../../hooks/authContext'
import Button from '../../components/UI/Button/Button'
import InputForm from '../../components/UI/Input/InputForm'

function LoginPage() { 
  const { setUser } = useContext(AuthContext)
  const [isRegistration, setIsRegistration] = useState(false)
  const [loading, setLoading] = useState(false)
  const [APIError, setAPIError] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_repeat: '',
    }
  })

  const password = watch('password')

  const onSubmit = async (data) => {
    setLoading(true)
    setAPIError('')

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
        navigate('/')
      }
    } catch (err) {
      if (err.response) {
        setAPIError(err.response.data.error || `Ошибка ${isRegistration ? 'регистрации' : 'входа'}`)
      } else if (err.request) {
        setAPIError('Ошибка сети')
      } else {
        setAPIError('Произошла ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsRegistration(!isRegistration)
    setAPIError('')
    reset({
      username: '',
      email: '',
      password: '',
      password_repeat: '',
    })
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>{isRegistration ? 'Регистрация' : 'Вход'}</h2>
        
        {APIError && <div className="error-message">{APIError}</div>}
        
        <form className='auth-form' onSubmit={handleSubmit(onSubmit)}>
          {isRegistration && (
            <div>
              <div className="form-input-group">
                <InputForm
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
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
              </div>
            </div>
          )}
          
          <div className="form-input-group">
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
                  message: 'Минимум 5 символа'
                },
                maxLength: {
                  value: 50,
                  message: 'Максимум 50 символов'
                }
              }}
              error={errors.username}
              autoComplete="off"
            />
          </div>
          
          <div className="form-input-group">
            <InputForm
              id="password"
              name="password"
              label="Пароль"
              type="password"
              register={register}
              validation={{
                required: 'Пароль обязателен',
                minLength: {
                  value: 6,
                  message: 'Минимум 6 символов'
                },
                maxLength: {
                  value: 50,
                  message: 'Максимум 50 символов'
                }
              }}
              error={errors.password}
              autoComplete="off"
            />
          </div>
          
          {isRegistration && (
            <div className="form-input-group">
              <InputForm
                id="password_repeat"
                name="password_repeat"
                label="Повторите пароль"
                type="password"
                register={register}
                validation={{
                  required: 'Повтор пароля обязателен',
                  validate: value => value === password || 'Пароли не совпадают'
                }}
                error={errors.password_repeat}
                autoComplete="off"
              />
            </div>
          )}
          
          <Button  
            type="submit"
            className="login-submit-btn" 
            disabled={loading} 
            text={loading 
              ? (isRegistration ? 'Регистрация...' : 'Вход...') 
              : (isRegistration ? 'Зарегистрироваться' : 'Войти')
            }
          />
        </form>
        
        <div className="auth-links">
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

        <Link to="/" className="back-link">На главную</Link>
      </div>
    </div>
  );
}

export default LoginPage