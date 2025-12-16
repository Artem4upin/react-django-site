import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from "../../api"
import './AccountPage.css'
import { AuthContext } from "../../hooks/authContext";
import Loading from "../../components/UI/Loading/Loading"
import ModalChangePassword from "../../components/modal/ModalChangePassword/ModalChangePassword";
import Button from "../../components/UI/Button/Button";
import InputForm from "../../components/UI/Input/InputForm";

function AccountPage() {
    const { user, setUser } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const navigate = useNavigate()
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue
    } = useForm({
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            first_name: '',
            last_name: '',
        }
    })

    useEffect(() => {
        get_user_data()
    }, [])

    const get_user_data = async () => {
        try {
            const response = await api.get('/auth/get-user-data/')
            const userData = response.data.user
            reset({
                username: userData.username || '',
                email: userData.email || '',
                phone: userData.phone || '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || '',
            })
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
        } finally {
            setLoading(false)
        }
    };

    const updateUserData = async (data) => {
        try {
            await api.patch('/auth/update-user-data/', data)
            setSaveSuccess(true)
            
            setTimeout(() => {
                setSaveSuccess(false)
            }, 3000)
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
                        
                        <form onSubmit={handleSubmit(updateUserData)} className="profile-form">
                            <div className="form-section">
                                <h3 className="form-section-title">Основная информация</h3>
                                
                                <div className="form-grid">
                                    <div className="form-group">
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
                                            autoComplete="username"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
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
                                            autoComplete="email"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <InputForm
                                            id="first_name"
                                            name="first_name"
                                            label="Имя"
                                            type="text"
                                            register={register}
                                            validation={{
                                                maxLength: {
                                                    value: 50,
                                                    message: 'Максимум 50 символов'
                                                }
                                            }}
                                            error={errors.first_name}
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <InputForm
                                            id="last_name"
                                            name="last_name"
                                            label="Фамилия"
                                            type="text"
                                            register={register}
                                            validation={{
                                                maxLength: {
                                                    value: 50,
                                                    message: 'Максимум 50 символов'
                                                }
                                            }}
                                            error={errors.last_name}
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <InputForm
                                            id="phone"
                                            name="phone"
                                            label="Телефон"
                                            type="tel"
                                            register={register}
                                            validation={{
                                                pattern: {
                                                    value: /^[78]\d{10}$/,
                                                    message: 'Введите телефон в формате 79999999999'
                                                }
                                            }}
                                            error={errors.phone}
                                            placeholder="79999999999"
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="form-actions">
                                <Button 
                                    type="submit"
                                    className="submit-btn" 
                                    text={isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                                    disabled={isSubmitting}
                                />
                                {saveSuccess && (
                                <div className="form-success">
                                    Данные успешно сохранены!
                                </div>
                                )}
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
                                        Завершить текущую сессию
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