import React from "react"
import "./ProductCard.css"
import Button from "../UI/Button/Button"
import { api } from "../../api"

function ProductCard({ product, isProducts, deleteFromCart }) {

    const addToCart = async () => {
        try {
            const response = await api.post('cart/cart-items/', {
                product: product.id,
                quantity: 1
            })
            console.log(response.data)
            alert(`Товар ${product.name} добавлен в корзину`)
        } catch (error) {
            console.error('Ошибка добавления в корзину')
        }
    }

    return (
        <div className="product-card">
            <h3>{product.name || product.product_name}</h3>
            <p className="product-card__price">{product.price || product.product_price} ₽</p> 
            <div className="product-card__parameters">
                {isProducts? (
                <h4>Характеристики</h4>
                ) : (
                    <div className="product-info">
                        <h4 className="product-info__quantity">{`Количество: ${product.quantity}`}</h4>
                        <Button className='exit-btn' text='Удалить'  onClick={deleteFromCart} />
                    </div>
            )} 
                <ul className="parameters-list">
                    {product.parameters?.map((param, index) => ( 
                        <li key={index} className="parameters-list__item">
                            <span className="parameter">{`${param.name}: ${param.value}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="product-card__description">{product.description}</p>
            {isProducts && (
            <Button className = 'add-to-cart-btn' text = 'В корзину' onClick={addToCart} />
            )}
        </div>
    );
}

export default ProductCard