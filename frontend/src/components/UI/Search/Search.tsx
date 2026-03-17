import React, {ChangeEvent, useState} from "react";
import './Search.css'
import Input from '../Input/Input'
import Button from "../button/button";
import { api } from "../../../api";
import {IProduct} from "../../../types/product";

interface ISearchProps {
    searchResult: IProduct[];
    setSearchResult: (searchResult: IProduct[]) => void;
}

function Search ({
        searchResult,
        setSearchResult
}:ISearchProps) {

    const [searchValue, setSearchValue] = useState('')

    const searchProducts = async () => {
        if (searchValue) {
            try {
                const response = await api.get(`/products/search/?search=${searchValue}`)
                if ((response.data).length > 0) {
                setSearchResult(response.data)
                }
                else {
                    console.log('Ничего не нашлось')
                    handleSearchReset()
                }
            } catch (error) {
                console.error('Ошибка поиска:', error)
            }
        }
    }

    const handleSearchReset = () => {
        setSearchResult([])
        setSearchValue('')
    } 

    return (
        <div className="search">

            <Input 
            type="text" 
            placeholder={'Поиск товара'} 
            value={searchValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
            />

            {searchResult.length > 0 && (
            <Button 
            text="Х" 
            className="exit-btn"
            onClick={handleSearchReset}
            />
            )}
            
            <Button 
            text='Поиск' 
            className={'submit-btn'}
            onClick={searchProducts}
            />

        </div>
    )

}

export default Search