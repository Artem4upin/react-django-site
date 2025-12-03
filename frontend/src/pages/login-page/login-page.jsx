import React, { useContext, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../api'
import './login-page.css'
import { AuthContext } from '../../hooks/authContext'
import Button from '../../components/UI/button/button'

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
    <div className="auth-container">
      <div className="auth-form">
        <h2>Вход</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Введите логин" required />
          </div>
          
          <div className="form-group">
            <label>Пароль</label>
            <input type="password" name="password" value={formData.password} 
            onChange={handleChange} placeholder="Введите пароль" required autoComplete="off" />
          </div>
          
          <Button  
            className="submit-btn" 
            disabled={loading} 
            text={loading ? 'Вход...' : 'Войти'}>
          </Button>
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