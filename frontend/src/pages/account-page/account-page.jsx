import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { api } from "../../api"
import './account-page.css'
import { AuthContext } from "../../hooks/authContext";
import ModalChangePassword from "../../components/modal/modal-change-password/modal-change-password";

// useForm
// модальное окно смены пароля

function AccountPage() {

    const { setUser } = useContext(AuthContext)

    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [phone, setPhone] = useState() 
    const [first_name, setFirstName] = useState()
    const [last_name, setLastName] = useState()
    
    const [ showModal, setShowModal ] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        get_user_data()
    },[])


    const get_user_data = async () => {
        const response = await api.get('/auth/get-user-data/')
        console.log(response.data.user)
        setUsername(response.data.user.username)
        setEmail(response.data.user.email)
        setPhone(response.data.user.phone)
        setFirstName(response.data.user.first_name)
        setLastName(response.data.user.last_name)
        setLoading(false)
    }

    const updateUserData = async (e) => {
        e.preventDefault()

        const userData = {
            username: username,
            email: email,
            phone: phone,
            first_name: first_name,
            last_name: last_name,
        }

        try {
            const response = await api.patch('/auth/update-user-data/', userData)
            console.log('Данные обновленны:', response.data)
            alert('Данные сохранены')
        }
        catch (error) {
            console.error('Ошибка сохранения', error)
            alert('Ошибка сохранения данных')
        }
    }

    const handleLogout = async () => {
      try {
        await api.post('/auth/logout/')
        localStorage.removeItem('token')
        setUser(null)
        navigate('/')
        console.log("Успешный выход из аккаунта") 
      } catch (error) {
        console.error('Ошибка выхода:', error)   
      }
    };

    if (loading) {
        return <p>Загрузка</p>
    }

    return (

        <div className="account-page">
            <div className='account-container'>
                <div className="menu">
                    <Link to='/orders'>Заказы</Link>
                </div>

                <div className="user-container">
                    <form onSubmit={updateUserData} className="user-data-form">
                        <span>Данные аккаунта</span>                        
                    <div className="row">
                        <label htmlFor="username">Логин</label>
                        <input id='username' type="text" value={username || ''}  
                        onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="row">
                        <label htmlFor="email">Email</label>
                        <input id='email' type="email" value={email || ''} 
                        onChange={(e) => setEmail(e.target.value)} required />
                        
                        <label htmlFor="first-name">Имя</label>
                        <input id='first-name' type="text" value={first_name || ''} 
                        onChange={(e) => setFirstName(e.target.value)} />
                    </div>

                    <div className="row">
                        <label htmlFor="phone">Номер телефона</label>
                        <input id='phone' type="tel" placeholder="+7 (xxx) xxx-xx-xx" pattern="[78]{1}[0-9]{10}" value={phone || ''} 
                        onChange={(e) => setPhone(e.target.value)} />
                        
                        
                        <label htmlFor="last-name">Фамилия</label>
                        <input id='last-name' type="text" value={last_name || ''} 
                        onChange={(e) => setLastName(e.target.value)}  />
                    </div>

                        <button className="submit-btn">Сохранить</button>
                        </form>
                    <div className="form-buttons">
                        <button onClick={() => setShowModal(true)} className="change-password-btn">Сменить пароль</button>
                        <button onClick={handleLogout} className="logout-btn">Выйти из аккаунта</button>
                    </div>
                </div>
            </div>
            <ModalChangePassword showModal = {showModal} setShowModal = {setShowModal}/> 
        </div>
    )

}

export default AccountPage