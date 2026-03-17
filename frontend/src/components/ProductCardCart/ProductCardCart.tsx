import Button from "../UI/button/button"
import { deleteFromCart, goToProduct } from "../../utils/functions";
import {ICartItem} from "../../types/cart";
import {useNavigate} from "react-router-dom";

interface ProductCardCartProps {
    item: ICartItem;
    onDelete: (id: number) => void;
    isSelected: boolean;
    onCheckboxChange: (id: number, checked: boolean) => void;
}

function ProductCardCart({ item, onDelete, isSelected, onCheckboxChange }: ProductCardCartProps) {
    const navigate = useNavigate();

    const handleTitleClick = () => goToProduct(navigate, item.product);
    const handleDelete = () => deleteFromCart(item.id, onDelete);

    return (
        <div className="product-card">
            <div className="product-card__image-container">
                {item.image_pass ? (
                    <img
                        src={item.image_pass}
                        alt={item.product_name}
                        className="image-container__image"
                    />
                ) : (
                    <p className="image-container_no-image">Нет изображения</p>
                )}
            </div>

            <div className="product-card__info-container">
                <h3 className="product-card__title" onClick={handleTitleClick}>
                    {item.product_name}
                </h3>
                <p className="product-card__price">{item.product_price} ₽</p>

                <div className="product-card__parameters">
                    <h4 className="product-card__quantity">Количество: {item.quantity}</h4>
                </div>

                <div className="product-card__cart-actions">
                    <Button className="exit-btn" text="Удалить" onClick={handleDelete} />

                    <div className="cart-actions__checkbox">
                        <p className="cart-actions__checkbox-title">Добавить в заказ</p>
                        <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => onCheckboxChange(item.id, e.target.checked)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCardCart;