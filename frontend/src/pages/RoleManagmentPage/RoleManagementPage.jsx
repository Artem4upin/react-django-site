import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api'
import './RoleManagementPage.css'
import Loading from '../../components/UI/Loading/Loading';
import Button from '../../components/UI/Button/Button';
import { AuthContext } from '../../hooks/authContext';

function RoleManagementPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { user } = useContext(AuthContext)


  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.get('/auth/users/')

        const filteredUsers = response.data.users.filter(
        userItem => userItem.id !== user?.id
      )
      
      setUsers(filteredUsers)
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error)
      setError('Ошибка загрузки пользователей: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setError('')
    setSuccessMessage('')
    
    try {
      const response = await api.patch(`/auth/users/${userId}/update-role/`, {
        user_type: newRole
      })
      
      setSuccessMessage(response.data.message)
      
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, user_type: newRole } : user
      )
      setUsers(updatedUsers)
      
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
      
    } catch (error) {
      console.error('Ошибка изменения роли:', error)
      setError('Ошибка изменения роли: ' + (error.response?.data?.error || error.message))
    }
  }

  if (loading) {
    return <Loading />
  }

  return (
    <main className="role-management-page">
      <h1>Управление ролями пользователей</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="users-list">
        {users.length === 0 ? (
          <p className="no-users">Пользователи не найдены</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-main">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="user-details">
                  <p>Имя: {user.first_name || 'Не указано'}</p>
                  <p>Фамилия: {user.last_name || 'Не указано'}</p>
                </div>
              </div>
              
              <div className="user-role">
                <div className="role-selector">
                  <span>Роль: </span>
                  <select 
                    value={user.user_type}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="User">Пользователь</option>
                    <option value="Manager">Менеджер</option>
                    <option value="Admin">Админ</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="page-actions">
        <Button 
          text="Обновить список"
          onClick={loadUsers}
        />
      </div>
    </main>
  )
}

export default RoleManagementPage