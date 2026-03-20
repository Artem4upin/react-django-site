import { useState } from 'react'
import {SubmitHandler, useForm} from 'react-hook-form';
import { api } from '../../../api'
import InputForm from '../../UI/Inputs/InputForm';
import Button from '../../UI/Buttons/Button';
import './ModalChangePassword.css'

interface IChangePasswordInputs {
    currentPassword: string;
    newPassword: string;
    newPasswordRepeat: string;
}

interface ModalChangePasswordProps {
    showModal?: boolean;
    setShowModal: (show: boolean) => void;
}

function ModalChangePassword ({showModal = true, setShowModal}: ModalChangePasswordProps) {
    
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<IChangePasswordInputs>({
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordRepeat: '',
        }
    })

    const newPassword = watch('newPassword')
    const newPasswordRepeat = watch('newPasswordRepeat')
    const [errorPassword, setErrorPassword] = useState<string | undefined>()

    const onSubmit: SubmitHandler<IChangePasswordInputs> = async (data) => {
        setErrorPassword(undefined)
        try{
            const response = await api.post('/auth/change-password/', {
                current_password: data.currentPassword,
                new_password: data.newPassword
            })

            if (response.data.success) {
                setErrorPassword('Пароль изменен')
                reset()
                handleChangePasswordTrue()
            }
        } catch (error: any) {
            setErrorPassword(error.response?.data?.error || 'Ошибка смены пароля')
        }
    }

    const handleChangePasswordTrue = () => {
        setTimeout(() => {
        setErrorPassword(undefined)
        setShowModal(false)
    }, 5000)}

    if (!showModal) return

    return (
        <div className="modal-change-password">
            <div className="modal-change-password__main-container">
                <form className='modal-change-password__change-password-form' onSubmit={handleSubmit(onSubmit)}>
                    <span>Смена пароля</span>

                    {errorPassword && (
                        errorPassword === 'Пароль изменен'
                            ? (null)
                            : <p className='modal-change-password__error-message'>Ошибка: {errorPassword}</p>
                    )}
                    
                    <InputForm
                        id="password"
                        name="currentPassword"
                        className="input-form"
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
                        className="input-form"
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
                        className="input-form"
                        label="Повторите новый пароль"
                        type="password"
                        register={register}
                        validation={{
                            required: 'Обязательное поле',
                            validate: (value: string) => value === newPassword || 'Пароли не совпадают'
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