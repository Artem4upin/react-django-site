import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { api } from '../../../api'
import './ModalChangePassword.css'

// caniuse, синтаксическая разметка, modal api html5

function ModalChangePassword ({showModal, setShowModal}) {
    
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors, isSubmitting}
    } = useForm({
        defaultValues: {
            currentPassword: '',
            newPassword1: '',
            newPassword2: '',
        }
    })

    const newPassword1 = watch('newPassword1')
    const newPassword2 = watch('newPassword2')

    const onSubmit = async (data) => {
        try{
            const response = await api.post('/auth/change-password/', {
                current_password: data.currentPassword,
                new_password: data.newPassword1
            })

            if (response.data.success) {
                alert('Пароль изменен')
                reset()
                setShowModal(false)
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Ошибка смены пароля')
        }
    }

    if (showModal) {
    return (
        <div className="ModalChangePassword">
            <div className="main-container">
                <form className='change-password-form' onSubmit={handleSubmit(onSubmit)}>
                <span>Смена пароля</span>
                {newPassword1 !== newPassword2 && ( 
                    <div className='error-message'>Пароли не совпадают</div>
                    )}
                <div className="input-container">
                    <label htmlFor="password">Введите пароль</label>
                    <input 
                    id="password" 
                    type="password" 
                    {...register('currentPassword', {
                        required: 'Обязательное поле', 
                        maxLength: {value: 50, message: 'Максимум 50 символов'}
                    })} 
                    autoComplete='off'
                    />
                    {errors.currentPassword && (
                        <div className='error-message'>{errors.currentPassword.message}</div>
                    )}
                    <label htmlFor="new-password1">Введите новый пароль</label>
                    <input 
                    id="new-password1" 
                    type="password" 
                    {...register('newPassword1', {
                        required: 'Обязательное поле',
                        minLength: {value: 6, message: 'Минимум 6 символов'},
                        maxLength: {value: 50, message: 'Макисмум 50 символов'}
                    })} 
                    autoComplete='off' 
                    />
                    {errors.newPassword1 && (
                        <div className='error-message'>{errors.newPassword1.message}</div>
                    )}
                    <label htmlFor="new-password2">Повторите новый пароль</label>
                    <input 
                    id="new-password2" 
                    type="password" 
                    {...register('newPassword2', {
                        required: 'Обязательное поле',
                        validate: value => value === newPassword1 || 'Пароли не совпадают'
                    })} 
                    autoComplete='off'
                    />                
                </div>
                    <button className="submit-btn" type='submit' disabled={isSubmitting || newPassword1 !== newPassword2}>
                        {isSubmitting ? 'Отправка' : 'Отправить'}
                    </button>
                </form>
                <button className='exit-btn' onClick={() => {
                    reset()
                    setShowModal(false)
                }}>Закрыть</button>
            </div>
        </div>
        )   
    }
}

export default ModalChangePassword