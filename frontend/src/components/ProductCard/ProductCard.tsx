import "./ProductCard.scss"
import Button from "../UI/Buttons/Button"
import {addToCart, deleteFromCart, goToProduct} from "../../utils/functions";
import {ICartItem} from "../../types/cart";
import {useNavigate} from "react-router-dom";
import { useState, useContext } from "react";
import {IProduct} from "../../types/product";
import {AuthContext} from "../../hooks/AuthContext";
import { Rating } from '@mui/material';
import ErrorMessage from "../ErrorMessage/ErrorMessage";

interface ProductCardProps {
    data: IProduct | ICartItem;
    isCart?: boolean;
    onDelete?: (id: number) => void;
    isSelected?: boolean;
    onCheckboxChange?: (id: number, checked: boolean) => void;
}

function ProductCard({
    data,
    isCart = false,
    onDelete,
    isSelected,
    onCheckboxChange
}: ProductCardProps) {

    const productId = isCart ? (data as ICartItem).product : (data as IProduct).id;
    const cartItemId = isCart ? (data as ICartItem).id : undefined;
    const name = isCart ? (data as ICartItem).product_name : (data as IProduct).name;
    const price = isCart ? (data as ICartItem).product_price : (data as IProduct).price;
    const image = isCart ? (data as ICartItem).image_path : (data as IProduct).image_path;
    const quantity = isCart ? (data as ICartItem).quantity : undefined;
    const parameters = !isCart ? (data as IProduct).parameters : undefined;
    const rating = isCart ? 0 : (data as IProduct).rating_avg;

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [addToCartError, setAddToCartError] = useState<any>(null)

    const handleProductClick = () => goToProduct(navigate, productId);

    const handleDelete = () => {
        if (isCart && onDelete && cartItemId !== undefined) {
            deleteFromCart(cartItemId, onDelete);
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        if (isCart && onCheckboxChange && cartItemId !== undefined) {
            onCheckboxChange(cartItemId, checked);
        }
    }

    const handleAddToCart = async () => {
        if (loading) return;

        setLoading(true);
        setAddToCartError(null);
        try {
            await addToCart(productId, 1);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch (error: any) {
            setAddToCartError(error.response.data.error || 'Ошибка добавления в корзину');
            setTimeout(() => setAddToCartError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

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
                    <div className="product-card__cart-actions--cart">
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
                ) : (
                    user && (
                        <div className='product-card__cart-actions'>
                            <Button
                                className={`add-to-cart-btn ${added ? "add-to-cart-btn--added" : ""} ${addToCartError ? "add-to-cart-btn--error" : ""}`}
                                text={loading ? "Добавление" : added ? "Добавлено" : addToCartError ? "Ошибка" : "В корзину"}
                                onClick={handleAddToCart}
                                disabled={added || loading || addToCartError}
                            />
                            {addToCartError && (
                                <ErrorMessage className="product-card__error" errorMsg={addToCartError} />
                            )}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default ProductCard;