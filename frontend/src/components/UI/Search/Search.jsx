import React, { useRef, useState } from "react";
import './Search.css'
import Input from '../Input/Input'
import Button from "../Button/Button";
import { api } from "../../../api";

function Search ({searchResult, setSearchResult}) {

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
            onChange={(e) => setSearchValue(e.target.value)}
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