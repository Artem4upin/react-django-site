import React, { useState} from 'react';
import './Header.scss'
import {IProduct} from "../../types/product";
import SearchContainer from "../SearchContainer/SearchContainer";
import NavigationLinks from "../NavigationLinks/NavigationLinks";
import AccountButton from "../UI/Buttons/AccountButton/AccountButton";
import CartButton from "../UI/Buttons/CartButton/CartButton";

function Header(){

    const [searchResult, setSearchResult] = useState<IProduct[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [hasSearching, setHasSearching] = useState(false);
    return (
    <header className="header">
        <div className="header__container">
            <h1 className="header__logo" >TechShop</h1>
            <NavigationLinks />
            <SearchContainer
                searchResult={searchResult}
                setSearchResult={setSearchResult}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                hasSearching={hasSearching}
                setHasSearching={setHasSearching}
            />
            <div className='account-container'>
                <CartButton />
                <AccountButton />
            </div>
        </div>

    </header>
    )
}

export default Header