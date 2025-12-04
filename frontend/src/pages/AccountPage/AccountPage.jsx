import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { api } from "../../api"
import './AccountPage.css'
import { AuthContext } from "../../hooks/authContext";
import ModalChangePassword from "../../components/modal/ModalChangePassword/ModalChangePassword";
import Button from "../../components/UI/Button/Button";
import Input from "../../components/UI/Input/Input";

function AccountPage() {
    const { setUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState(); 
    const [first_name, setFirstName] = useState();
    const [last_name, setLastName] = useState();
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        get_user_data();
    }, []);

    const get_user_data = async () => {
        const response = await api.get('/auth/get-user-data/');
        setUsername(response.data.user.username);
        setEmail(response.data.user.email);
        setPhone(response.data.user.phone);
        setFirstName(response.data.user.first_name);
        setLastName(response.data.user.last_name);
        setLoading(false);
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
            const response = await api.patch('/auth/update-user-data/', userData);
            console.log('Данные обновленны:', response.data);
            alert('Данные сохранены');
        } catch (error) {
            console.error('Ошибка сохранения', error);
            alert('Ошибка сохранения данных');
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout/');
            localStorage.removeItem('token');
            setUser(null);
            navigate('/');
            console.log("Успешный выход из аккаунта"); 
        } catch (error) {
            console.error('Ошибка выхода:', error);   
        }
    };

    if (loading) {
        return <p>Загрузка</p>;
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
                        <label htmlFor="username" className="input-label">Логин</label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>

                    <div className="row">
                        <label htmlFor="email" className="input-label">Email</label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                        />
                        
                        <label htmlFor="first-name" className="input-label">Имя</label>
                        <Input
                            id="first-name"
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <div className="row">
                        <label htmlFor="phone" className="input-label">Телефон</label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+7 (xxx) xxx-xx-xx"
                            pattern="[78]{1}[0-9]{10}"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="input-field"
                        />
                        
                        <label htmlFor="last-name" className="input-label">Фамилия</label>
                        <Input
                            id="last-name"
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            className="input-field"
                        />
                    </div>

                    <Button className='submit-btn' text='Сохранить' />
                </form>
                
                <div className="form-buttons">
                    <Button 
                        onClick={() => setShowModal(true)} 
                        className="submit-btn" 
                        text="Изменить пароль"
                    />
                    <Button 
                        onClick={handleLogout} 
                        className="exit-btn" 
                        text="Выйти из аккаунта"
                    />
                </div>
            </div>
        </div>
        <ModalChangePassword showModal={showModal} setShowModal={setShowModal} /> 
    </div>
    );
}

export default AccountPage;