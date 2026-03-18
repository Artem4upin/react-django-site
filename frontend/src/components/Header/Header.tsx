import React, {useContext, useState} from 'react';
import { Link } from 'react-router-dom';
import './header.css'
import CartIcon from '../icons/CartIcon';
import { AuthContext } from '../../hooks/AuthContext';
import Search from "../Search/Search";
import {IProduct} from "../../types/product";
import SearchDropdown from "./SearchDropdown/SearchDropdown";

function Header(){

    const [searchResult, setSearchResult] = useState<IProduct[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hasSearching, setHasSearching] = useState(false);
    const { user } = useContext(AuthContext)

    return (
    <header className="header">
        <div className="container">
        <h1 className="logo">TechShop</h1>

            <nav className="navigation">
                <div className='search-wrapper'>
                    <Search
                        searchResult={searchResult}
                        setSearchResult={setSearchResult}
                        setIsDropdownOpen={setIsDropdownOpen}
                        setHasSearching={setHasSearching}
                        hasSearching={hasSearching}
                    />
                    <SearchDropdown
                        results={searchResult}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        hasSearching={hasSearching}
                    />
                </div>
                <Link to="/">Главная</Link>
                <Link to="/catalog">Каталог</Link>
                <Link to="/about">О нас</Link>
            </nav>

            <div className='account'>
                <div className='account__cart-icon'>
                    <Link to="/cart" className='cart-btn' >
                    <CartIcon  />
                    <span>Корзина</span>
                    </Link>
                </div>
                <div className='account-btn'>
                    {user ? (<Link to='/account'>{user.username}</Link>) 
                    : (<Link to='/login'>Войти</Link>)
                    }
                </div>
            </div>
        </div>

    </header>
    )
}

export default Header