import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { api } from '../../../api'
import InputForm from '../../UI/Input/InputForm';
import Button from '../../UI/Button/Button';
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

    if (!showModal) return

    return (
        <div className="modal-change-password">
            <div className="modal-change-password__main-container">
                <form className='modal-change-password__change-password-form' onSubmit={handleSubmit(onSubmit)}>
                    <span>Смена пароля</span>
                    
                    {newPassword !== newPasswordRepeat && ( 
                        <div className='error-message'>Пароли не совпадают</div>
                    )}
                    
                    <InputForm
                        id="password"
                        name="currentPassword"
                        label="Введите пароль"
                        type="password"
                        register={register}
                        validation={{
                            required: 'Обязательное поле',
                            minLength: {value: 6, message: 'Минимум 6 символов'}, 
                            maxLength: {value: 50, message: 'Максимум 50 символов'}
                        }}
                        error={errors.currentPassword}
                        autoComplete="off"
                    />
                    
                    <InputForm
                        id="new-password"
                        name="newPassword"
                        label="Введите новый пароль"
                        type="password"
                        register={register}
                        validation={{
                            required: 'Обязательное поле',
                            minLength: {value: 6, message: 'Минимум 6 символов'},
                            maxLength: {value: 50, message: 'Макисмум 50 символов'}
                        }}
                        error={errors.newPassword}
                        autoComplete="off"
                    />
                    
                    <InputForm
                        id="new-password-repeat"
                        name="newPasswordRepeat"
                        label="Повторите новый пароль"
                        type="password"
                        register={register}
                        validation={{
                            required: 'Обязательное поле',
                            validate: value => value === newPassword || 'Пароли не совпадают'
                        }}
                        error={errors.newPasswordRepeat}
                        autoComplete="off"
                    />
                    
                    <Button 
                        className="submit-btn" 
                        type="submit" 
                        disabled={isSubmitting || newPassword !== newPasswordRepeat}
                        text={isSubmitting ? 'Отправка...' : 'Отправить'}
                    />
                </form>
                
                <Button 
                    className="exit-btn"
                    onClick={() => {
                        reset()
                        setShowModal(false)
                    }}
                    text="Закрыть"
                />
            </div>
        </div>
    );
}

export default ModalChangePassword;