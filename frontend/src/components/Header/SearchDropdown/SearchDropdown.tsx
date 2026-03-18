import {IProduct} from "../../../types/product";
import "./SearchDropdown.css"
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
                                <div key={product.id} className="dropdown-item" onClick={handleClick}>
                                    <div className="dropdown-item__image">
                                        {product.image_pass ? (
                                            <img src={product.image_pass} alt={product.name}
                                                 className="image-container__image"/>
                                        ) : (
                                            <p className="image--no-image">Нет изображения</p>
                                        )}
                                    </div>

                                    <div className="dropdown-item__info-container">
                                        <h3 className="dropdown-item__title">
                                            {product.name}
                                        </h3>
                                        <p className="dropdown-item__price">{product.price} ₽</p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="dropdown-empty">Ничего не найдено</div>
                    )}
                </div>
            )}
        </div>
    )
}
export default SearchDropdown;