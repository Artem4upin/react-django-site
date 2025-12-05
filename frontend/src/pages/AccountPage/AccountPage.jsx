import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { api } from "../../api"
import './AccountPage.css'
import { AuthContext } from "../../hooks/authContext";
import Loading from "../../components/UI/Loading/Loading"
import ModalChangePassword from "../../components/modal/ModalChangePassword/ModalChangePassword";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";

function AccountPage() {
    const { user, setUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        get_user_data()
    }, [])

    const get_user_data = async () => {
        try {
            const response = await api.get('/auth/get-user-data/')
            const userData = response.data.user
            setUsername(userData.username)
            setEmail(userData.email)
            setPhone(userData.phone)
            setFirstName(userData.first_name)
            setLastName(userData.last_name)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        } finally {
            setLoading(false)
        }
    };

    const updateUserData = async (e) => {
        e.preventDefault();
        const userData = {
            username,
            email,
            phone,
            first_name,
            last_name,
        };

        try {
            await api.patch('/auth/update-user-data/', userData)
        } catch (error) {
            console.error('Ошибка сохранения', error)
            alert('Ошибка сохранения данных')
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout/')
            localStorage.removeItem('token')
            setUser(null)
            navigate('/')
        } catch (error) {
            console.error('Ошибка выхода:', error)   
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div className="account-page">
            <header className="account-header">
                <h1 className="account-title">Личный кабинет</h1>
            </header>
            
            <div className="account-layout">
                <aside className="account-sidebar">
                    <nav className="account-nav">
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to='/orders' className="nav-link">
                                    <span className="nav-text">Мои заказы</span>
                                </Link>
                            </li>
                            {user?.user_type === 'Manager' && (
                                <li className="nav-item">
                                    <Link to='/manager-page' className="nav-link">
                                        <span className="nav-text">Панель управления</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </aside>

                <main className="account-main">
                    <section className="account-section">
                        <h2 className="section-title">Аккаунт</h2>
                        
                        <form onSubmit={updateUserData} className="profile-form">
                            <div className="form-section">
                                <h3 className="form-section-title">Основная информация</h3>
                                
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            Логин
                                        </label>
                                        <Input
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="first-name" className="form-label">
                                            Имя
                                        </label>
                                        <Input
                                            id="first-name"
                                            value={first_name}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="last-name" className="form-label">
                                            Фамилия
                                        </label>
                                        <Input
                                            id="last-name"
                                            value={last_name}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="phone" className="form-label">
                                            Телефон
                                        </label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+7 (999) 999-99-99"
                                            pattern="[78]{1}[0-9]{10}"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <Button 
                                    type="submit"
                                    className="submit-btn" 
                                    text="Сохранить изменения"
                                />
                            </div>
                        </form>
                    </section>

                    <section className="account-section">
                        <h2 className="section-title">Смена пароля</h2>
                        
                        <div className="security-actions">
                            <div className="action-item">
                                <div className="action-info">
                                    <h3 className="action-title">Изменение пароля</h3>
                                    <p className="action-description">
                                        Изменить пароль на этом аккаунте
                                    </p>
                                </div>
                                <Button 
                                    onClick={() => setShowModal(true)} 
                                    className="submit-btn" 
                                    text="Изменить пароль"
                                />
                            </div>
                        </div>
                    </section>

                    <section className="account-section">
                        <h2 className="section-title">Сессия</h2>
                        
                        <div className="session-actions">
                            <div className="action-item">
                                <div className="action-info">
                                    <h3 className="action-title">Выход из аккаунта</h3>
                                    <p className="action-description">
                                        Завершите текущую сессию на этом устройстве
                                    </p>
                                </div>
                                <Button 
                                    onClick={handleLogout} 
                                    className="exit-btn" 
                                    text="Выйти из аккаунта"
                                />
                            </div>
                        </div>
                    </section>
                </main>
            </div>
            
            <ModalChangePassword showModal={showModal} setShowModal={setShowModal} />
        </div>
    );
}

export default AccountPage