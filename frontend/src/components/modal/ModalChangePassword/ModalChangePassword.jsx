import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { api } from '../../../api'
import './ModalChangePassword.css'

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
            newPassword: '',
            newPasswordRepeat: '',
        }
    })

    const newPassword = watch('newPassword')
    const newPasswordRepeat = watch('newPasswordRepeat')

    const onSubmit = async (data) => {
        try{
            const response = await api.post('/auth/change-password/', {
                current_password: data.currentPassword,
                new_password: data.newPassword
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
                {newPassword !== newPasswordRepeat && ( 
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
                    {...register('newPassword', {
                        required: 'Обязательное поле',
                        minLength: {value: 6, message: 'Минимум 6 символов'},
                        maxLength: {value: 50, message: 'Макисмум 50 символов'}
                    })} 
                    autoComplete='off' 
                    />
                    {errors.newPassword && (
                        <div className='error-message'>{errors.newPassword.message}</div>
                    )}
                    <label htmlFor="new-password2">Повторите новый пароль</label>
                    <input 
                    id="new-password2" 
                    type="password" 
                    {...register('newPasswordRepeat', {
                        required: 'Обязательное поле',
                        validate: value => value === newPassword || 'Пароли не совпадают'
                    })} 
                    autoComplete='off'
                    />                
                </div>
                    <button className="submit-btn" type='submit' disabled={isSubmitting || newPassword !== newPasswordRepeat}>
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