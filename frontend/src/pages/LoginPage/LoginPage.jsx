import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../api'
import './LoginPage.css'
import { AuthContext } from '../../hooks/authContext'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'

function LoginPage() { 
  const { setUser } = useContext(AuthContext) 
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login/', formData)
      if (response.status === 200) {
        console.log('Успешный вход:', response.data);
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        navigate('/')
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Ошибка входа')
      } else if (err.request) {
        setError('Ошибка сети')
      } else {
        setError('Произошла ошибка')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="auth-container">
        <h2>Вход</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className='auth-form' onSubmit={handleSubmit}>
          <div className="form-input-group">
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Введите логин"
              required
            />
          </div>
          
          <div className="form-input-group">
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Введите пароль"
              autoComplete='off'
              required
            />
          </div>
          
          <Button  
            className="login-submit-btn" 
            disabled={loading} 
            text={loading ? 'Вход...' : 'Войти'}
          />
        </form>
        
        <div className="auth-links">
          <Link to='/registration' className="registration-btn">Зарегистрироваться</Link>
        </div>

        <Link to="/" className="back-link">На главную</Link>
      </div>
    </div>
  );
}

export default LoginPage;