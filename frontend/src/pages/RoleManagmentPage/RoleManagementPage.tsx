import React, { useState, useEffect, useContext } from 'react';
import { api } from '../../api'
import './RoleManagementPage.scss'
import Loading from '../../components/UI/Loading/Loading';
import Button from '../../components/UI/Buttons/Button';
import { AuthContext } from '../../hooks/AuthContext';
import {IUser, TUserType} from "../../types/user";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import {getErrorMsg} from "../../utils/errorMassages";

function RoleManagementPage() {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const { user } = useContext(AuthContext)


  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const response = await api.get<{users: IUser[]}>('/auth/users/')
        const filteredUsers = response.data.users.filter(
        userItem => userItem.id !== user?.id
      )

      setUsers(filteredUsers)
    } catch (error: any) {
      console.error('Ошибка загрузки пользователей:', error)
      setErrorMessage(`Ошибка загрузки пользователей: ${(getErrorMsg(error))}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: number, newRole: TUserType) => {
    setErrorMessage('')
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
      
    } catch (error: any) {
      console.error('Ошибка изменения роли:', error)
      setErrorMessage(`Ошибка изменения роли: ${(getErrorMsg(error))}`)
    }
  }

  if (loading) {
    return <Loading fullPage={true}/>
  }

  return (
    <main className="role-management-page">
      <h1>Роли пользователей</h1>

      {errorMessage && (
        <ErrorMessage className="role-management-page__error-message" errorMsg={errorMessage}/>
      )}
      {successMessage && (
        <div className="role-management-page__success-message">
          {successMessage}
        </div>
      )}
      
      <div className="role-management-page__users-list">
        {users.length === 0 ? (
          <p className="role-management-page__no-users">Пользователи не найдены</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="role-management-page__user-card">
              <div className="role-management-page__user-info">
                <div className="role-management-page__user-main">
                  <h3>{user.username}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="role-management-page__user-details">
                  <p>Имя: {user.first_name || 'Не указано'}</p>
                  <p>Фамилия: {user.last_name || 'Не указано'}</p>
                </div>
              </div>
              
              <div className="role-management-page__user-role">
                <div className="role-management-page__role-selector">
                  <span>Роль: </span>
                  <select 
                    value={user.user_type}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as TUserType)}
                    className="role-management-page__role-select"
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
      
      <div className="role-management-page__page-actions">
        <Button 
          text="Обновить список"
          onClick={loadUsers}
        />
      </div>
    </main>
  )
}

export default RoleManagementPage