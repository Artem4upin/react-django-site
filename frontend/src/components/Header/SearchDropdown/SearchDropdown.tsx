import {IProduct} from "../../../types/product";
import "./SearchDropdown.scss"
import {goToProduct} from "../../../utils/functions";
import {useNavigate} from "react-router-dom";

interface SearchDropdownProps {
    results: IProduct[];
    isDropdownOpen?: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    hasSearching: boolean;
}

function SearchDropdown({
    results,
    isDropdownOpen,
    setIsDropdownOpen,
    hasSearching,
    }: SearchDropdownProps) {

    const navigate = useNavigate();

    return (
        <div>
            {isDropdownOpen && hasSearching && (
                <div className="search-dropdown">
                    {results.length > 0 ? (
                        results.map(product => {
                            const handleClick = () => {
                                goToProduct(navigate, product.id);
                                setIsDropdownOpen(false);
                            }

                            return (
                                <div key={product.id} className="search-dropdown__item" onClick={handleClick}>
                                    <div className="search-dropdown__item__image-container">
                                        {product.image_path ? (
                                            <img src={product.image_path} alt={product.name}
                                                 className="search-dropdown__item__image-container__image"/>
                                        ) : (
                                            <p className="search-dropdown__item__image-container__image--no-image">Нет изображения</p>
                                        )}
                                    </div>

                                    <div className="search-dropdown__item__info-container">
                                        <h3 className="search-dropdown__item__title">
                                            {product.name}
                                        </h3>
                                        <p className="search-dropdown__item__price">{product.price} ₽</p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="search-dropdown--empty">Ничего не найдено</div>
                    )}
                </div>
            )}
        </div>
    )
}
export default SearchDropdown;