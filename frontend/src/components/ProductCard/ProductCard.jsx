import React, { useContext } from "react"
import "./ProductCard.css"
import Button from "../UI/Button/Button"
import { useNavigate } from 'react-router-dom';
import { addToCart, deleteFromCart, goToProduct } from "../../utils/functions";
import { AuthContext } from "../../hooks/authContext";

function ProductCard({ 
    product, 
    isCart, 
    onItemDelete, 
    isSelected,
    onCheckboxChange 
}) {
    const navigate = useNavigate()
    
    const { user } = useContext(AuthContext)

    const handleTitleClick = () => {
        if (isCart) {
            goToProduct(navigate, product.product) 
        } else {
            goToProduct(navigate, product.id) 
        }
    }

    const handleAddToCartClick = () => {
        addToCart(product.id, 1, product.name)
    }

    const handleDeleteFromCartClick = () => {
        deleteFromCart(product.id, onItemDelete)
    }

    const handleCheckboxChange = (e) => {
        if (onCheckboxChange) {
            onCheckboxChange(product.id, e.target.checked)
        }
    }

    return (
        <div className="product-card" >
            <h3 className="product-card__title" onClick={handleTitleClick}>
                {product.name || product.product_name}
            </h3>
            <p className="product-card__price">{product.price || product.product_price} ₽</p> 
            <div className="product-card__parameters">
                {isCart ? (
                    <div className="product-card__info">
                        <h4 className="product-card__quantity">{`Количество: ${product.quantity}`}</h4>
                    </div>
                ) : (
                    <h4>Характеристики</h4>    
                )} 
                <ul className="product-card__list">
                    {product.parameters?.map((param, index) => ( 
                        <li key={index} className="product-card__item">
                            <span className="product-card__parameter">{`${param.name}: ${param.value}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="product-card__description">{product.description}</p>
            
            {isCart ? (
                <div className="product-card__cart-actions">
                    <Button className='exit-btn' text='Удалить' onClick={handleDeleteFromCartClick} />
                    <div className="cart-actions__checkbox">
                        <p className="cart-actions__checkbox-title">Добавить в заказ</p>
                        <input 
                            type="checkbox" 
                            className="cart-actions__checkbox-input"
                            checked={isSelected}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                </div>
            ) : ( user && (
                <Button className='add-to-cart-btn' text='В корзину' onClick={handleAddToCartClick} />
            ))}
        </div>
    );
}

export default ProductCard