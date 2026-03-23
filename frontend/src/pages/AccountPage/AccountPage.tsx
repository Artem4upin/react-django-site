import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { api } from "../../api"
import './AccountPage.scss'
import { AuthContext } from "../../hooks/AuthContext";
import Loading from "../../components/UI/Loading/Loading"
import ModalChangePassword from "../../components/modal/ModalChangePassword/ModalChangePassword";
import Button from "../../components/UI/Buttons/Button";
import InputForm from "../../components/UI/Inputs/InputForm";
import {IUser} from "../../types/user";
import {EMAIL_VALIDATION, PHONE_VALIDATION} from "../../utils/regular";
import OrdersIcon from "../../components/icons/OrdersIcon";
import OrderManagmentIcon from "../../components/icons/OrderManagmentIcon";
import RoleIcon from "../../components/icons/RoleIcon";

interface IFormData {
    username: string;
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
}

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
    } = useForm<IFormData>({
        defaultValues: {
            username: '',
            email: '',
            phone: '',
            first_name: '',
            last_name: '',
        }
    })

    useEffect(() => {
        getUserData()
    }, [])

    const getUserData = async () => {
        try {
            const response = await api.get('/auth/get-user-data/')
            const userData: IUser = response.data.user
            
            setUser(userData)

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

    const updateUserData = async (data: IFormData) => {
        try {
            const response = await api.patch('/auth/update-user-data/', data)
            setSaveSuccess(true)

            if (response.data.success) {
                setUser({
                    ...user!,
                    ...response.data.user
                })
            }
            
            setTimeout(() => {
                setSaveSuccess(false)
            }, 3000)
        } catch (error) {
            console.error('Ошибка сохранения', error)
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
        return <Loading fullPage={true} />
    }

    return (
        <div className="account-page">
            <header className="account-page__header">
                <h1 className="account-page__title">Личный кабинет</h1>
            </header>
            
            <div className="account-page__layout">
                <aside className="account-page__sidebar">
                    <nav className="account-page__nav">
                        <ul className="account-page__nav__list">
                            <li className="account-page__nav__item">
                                <Link to='/orders' className="account-page__nav__link">
                                    <OrdersIcon />
                                    <span className="account-page__nav__text">Мои заказы</span>
                                </Link>
                            </li>
                            {user?.user_type === 'Manager' && (
                                <li className="account-page__nav__item">

                                    <Link to='/manager-page' className="account-page__nav__link">
                                        <OrderManagmentIcon />
                                        <span className="account-page__nav__text">Управление заказами</span>
                                    </Link>
                                </li>
                            )}
                            {user?.user_type === 'Admin' && (
                                <>
                                    <li className="account-page__nav__item">

                                        <Link to='/manager-page' className="account-page__nav__link">
                                            <OrderManagmentIcon />
                                            <span className="account-page__nav__text">Управление заказами</span>
                                        </Link>
                                    </li>
                                    <li className="account-page__nav__item">

                                        <Link to='/role-management' className="account-page__nav__link">
                                            <RoleIcon />
                                            <span className="account-page__nav__text">Управление ролями</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </aside>
                <main className="account-page__main">
                    <section className="account-page__section">
                        <h2 className="account-page__section__title">Аккаунт</h2>
                        
                        <form onSubmit={handleSubmit(updateUserData)} className="account-page__profile-form">
                            <div className="account-page__profile-form__form-section">
                                <h3 className="account-page__profile-form__form-section__title">Основная информация</h3>
                                
                                <div className="account-page__profile-form__form-grid">
                                    <div className="account-page__profile-form__form-group">
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
                                    
                                    <div className="account-page__profile-form__form-group">
                                        <InputForm
                                            id="email"
                                            name="email"
                                            label="Email"
                                            type="text"
                                            register={register}
                                            validation={{
                                                required: 'Email обязателен',
                                                pattern: {
                                                    value: EMAIL_VALIDATION,
                                                    message: 'Некорректный email'
                                                }
                                            }}
                                            error={errors.email}
                                            autoComplete="email"
                                        />
                                    </div>
                                    
                                    <div className="account-page__profile-form__form-group">
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
                                    
                                    <div className="account-page__profile-form__form-group">
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
                                    
                                    <div className="account-page__profile-form__form-group">
                                        <InputForm
                                            id="phone"
                                            name="phone"
                                            label="Номер телефона"
                                            type="tel"
                                            register={register}
                                            validation={{
                                                pattern: {
                                                    value: PHONE_VALIDATION,
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
                            
                            <div className="account-page__profile-form__form-actions">
                                <Button 
                                    type="submit"
                                    className="submit-btn" 
                                    text={isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                                    disabled={isSubmitting}
                                />
                                {saveSuccess && (
                                <div className="account-page__profile-form__form-success">
                                    Данные успешно сохранены!
                                </div>
                                )}
                            </div>
                        </form>
                    </section>

                    <section className="account-page__account-section">
                        <h2 className="account-page__account-section__section__title">Смена пароля</h2>
                        
                        <div className="account-page__account-section__security-actions">
                            <div className="account-page__account-section__action-item">
                                <div className="account-page__account-section__action-info">
                                    <h3 className="account-page__account-section__action-title">Изменение пароля</h3>
                                    <p className="account-page__account-section__action-description">
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

                    <section className="account-page__account-section">
                        <h2 className="account-page__account-section__section__title">Сессия</h2>
                        
                        <div className="account-page__account-section__session-actions">
                            <div className="account-page__account-section__action-item">
                                <div className="account-page__account-section__action-info">
                                    <h3 className="account-page__account-section__action-title">Выход из аккаунта</h3>
                                    <p className="account-page__account-section__action-description">
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