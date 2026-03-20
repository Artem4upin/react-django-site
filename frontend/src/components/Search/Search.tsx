import React, {ChangeEvent, useState} from "react";
import './Search.scss'
import Input from '../UI/Inputs/Input'
import Button from "../UI/Buttons/Button";
import { api } from "../../api";
import {IProduct} from "../../types/product";

interface ISearchProps {
    searchResult?: IProduct[];
    setSearchResult: (searchResult: IProduct[]) => void;
    setIsDropdownOpen: (isOpen: boolean) => void;
    hasSearching: boolean;
    setHasSearching: (hasSearching: boolean) => void;
}

function Search ({
        setSearchResult,
        setIsDropdownOpen,
        hasSearching,
        setHasSearching,
}:ISearchProps) {

    const [searchValue, setSearchValue] = useState('')

    const searchProducts = async () => {
        if (searchValue) {
            setIsDropdownOpen(true)

            try {
                const response = await api.get(`/products/search/?search=${searchValue}`)
                if ((response.data).length > 0) {
                    setSearchResult(response.data)
                    setHasSearching(true)
                    console.log(response.data)
                }
                else {
                    setSearchResult([]);
                    setHasSearching(true);
                }

            } catch (error) {
                console.error('Ошибка поиска:', error);
                setSearchResult([]);
                setHasSearching(true)
            }
        }
    }

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);

        if (value === '') {
            setIsDropdownOpen(false);
            setHasSearching(false);
            setSearchResult([])
        }
    }

    const handleSearchReset = () => {
        setSearchResult([]);
        setSearchValue('');
        setIsDropdownOpen(false);
        setHasSearching(false)
    }

    return (
        <div className="search">

            <Input
                className="search__input"
                type="search"
                placeholder={'Поиск товара'}
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e)}
                onInput={(e: ChangeEvent<HTMLInputElement>) => {
                    if (e.target.value === '') {
                        handleSearchReset();
                    }
                }}
            />

            <Button
            text='Поиск'
            className={'submit-btn'}
            onClick={searchProducts}
            />

        </div>
    )

}

export default Search