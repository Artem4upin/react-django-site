import "./ProductCard.scss"
import Button from "../UI/Buttons/Button"
import {addToCart, deleteFromCart, goToProduct} from "../../utils/functions";
import {ICartItem} from "../../types/cart";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {IProduct} from "../../types/product";
import {AuthContext} from "../../hooks/AuthContext";
import { Rating } from '@mui/material';

interface ProductCardProps {
    data: IProduct | ICartItem;
    isCart?: boolean;
    onDelete?: (id: number) => void;
    isSelected?: boolean;
    onCheckboxChange?: (id: number, checked: boolean) => void;
}
function ProductCard({
    data,
    isCart=false,
    onDelete,
    isSelected,
    onCheckboxChange
}: ProductCardProps) {

    const id = isCart ? (data as ICartItem).id : (data as IProduct).id;
    const name = isCart ? (data as ICartItem).product_name : (data as IProduct).name;
    const price = isCart ? (data as ICartItem).product_price : (data as IProduct).price;
    const image = isCart ? (data as ICartItem).image_path : (data as IProduct).image_path;
    const quantity = isCart ? (data as ICartItem).quantity : undefined;
    const parameters = !isCart ? (data as IProduct).parameters : undefined;
    const rating = isCart ? (0) : (data as IProduct).rating_avg;

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const handleProductClick = () => goToProduct(navigate, id);
    const handleDelete = () => {
        if (isCart && onDelete) {
        deleteFromCart(id, onDelete)
        }
    };
    const handleCheckboxChange = (checked: boolean) => {
        if (isCart && onCheckboxChange) {
            onCheckboxChange(id, checked)
        }
    }

    const handleAddToCart = () => addToCart(id, 1);
    return (


        <div className="product-card">
            <div className="product-card__image-container">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="product-card__image"
                        onClick={handleProductClick}
                    />
                ) : (
                    <p className="product-card__image--no-image">Нет изображения</p>
                )}
            </div>

            <div className="product-card__info-container">
                <div className="product-card__title-container">
                    <h3 className="product-card__title" onClick={handleProductClick}>
                        {name}
                    </h3>
                    {!isCart && (
                        <div className="product-card__rating">
                            <Rating size='medium' precision={0.1} readOnly value={rating} />
                        </div>
                    )}
                </div>
                <p className="product-card__price">{Math.floor(price).toLocaleString('ru-RU')} ₽</p>

                <div className="product-card__parameters">
                    {!isCart && parameters && parameters.length > 0 && (
                        <div className="product-card__parameters">
                            <h4>Характеристики</h4>
                            <ul className="product-card__parameters-list">
                                {parameters.slice(0, 3).map((p, i) => (
                                    <li key={i}>{p.name}: <strong>{p.value}</strong></li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {isCart && (
                        <div className="product-card__parameters">
                            <h4 className="product-card__quantity">Количество: <strong>{quantity}</strong></h4>
                        </div>
                    )}
                </div>
                {isCart ? (
                <div className="product-card__cart-actions">

                    <div className="product-card__checkbox">
                        <p className="product-card__checkbox-title">В заказ</p>
                        <input
                            className="product-card__checkbox-input"
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleCheckboxChange(e.target.checked)}
                        />
                    </div>

                    <Button className="exit-btn" text="Удалить" onClick={handleDelete} />

                </div>
                ) : (user && <Button className="add-to-cart-btn" text="В корзину" onClick={handleAddToCart} />
                )}
            </div>
        </div>
    );
}

export default ProductCard