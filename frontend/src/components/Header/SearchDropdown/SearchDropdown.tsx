import {IProduct} from "../../../types/product";
import "./SearchDropdown.scss"
import {goToProduct} from "../../../utils/functions";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";

interface SearchDropdownProps {
    results: IProduct[];
    setResults: (results: IProduct[]) => void;
    isDropdownOpen?: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    hasSearching: boolean;
}

function SearchDropdown({
    results,
    setResults,
    isDropdownOpen,
    setIsDropdownOpen,
    hasSearching,
    }: SearchDropdownProps) {

    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
                setResults([])
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen, setIsDropdownOpen]);

    const handleShowMoreClick = () => {
        navigate('/catalog', {state: {searchResults: results}})
        setIsDropdownOpen(false);
    }

    return (
        <div ref={dropdownRef}>
            {isDropdownOpen && hasSearching && (
                <div className="search-dropdown">
                    {results.length > 0 ? (
                        <div className='search-dropdown__container'>
                            {results.slice(0, 3).map(product => {
                                const handleClick = () => {
                                    goToProduct(navigate, product.id);
                                    setIsDropdownOpen(false);
                                };

                                return (
                                    <div key={product.id} className="search-dropdown__item" onClick={handleClick}>
                                        <div className="search-dropdown__image-container">
                                            {product.image_path ? (
                                                <img src={product.image_path} alt={product.name}
                                                     className="search-dropdown__image"/>
                                            ) : (
                                                <p className="search-dropdown__image--no-image">Нет изображения</p>
                                            )}
                                        </div>

                                        <div className="search-dropdown__info-container">
                                            <h3 className="search-dropdown__title">
                                                {product.name}
                                            </h3>
                                            <p className="search-dropdown__price">{product.price} ₽</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {results.length > 3 && (
                                <button
                                    className="search-dropdown__show-more"
                                    onClick={handleShowMoreClick}
                                >
                                    Показать еще
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="search-dropdown--empty">Ничего не найдено</div>
                    )}
                </div>
            )}
        </div>
    )
}
export default SearchDropdown;