import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Header.css'
import CartIcon from '../icons/CartIcon';
import { AuthContext } from '../../hooks/authContext';

// добавить поле поиска

function Header(){

    const { user } = useContext(AuthContext)

    return (
    <header className="header">
        <div className="container">
        <h1 className="logo">TechShop</h1>
            
            <nav className="navigation">
                <Link to="/">Главная</Link>
                <Link to="/catalog">Каталог</Link>
                <Link to="/about">Контакты</Link>
            </nav>

            <div className='account'>
                
                <Link to="/cart" className='cart-btn'>
                <CartIcon />
                <span>Корзина</span>
                </Link>

                <div className='account-btn'>
                    {user ? (<Link to='/account'>Личный кабинет</Link>) 
                    : (<Link to='/login'>Войти</Link>)
                    }
                </div>

            </div>
        </div>
    </header>
    )
}

export default Header