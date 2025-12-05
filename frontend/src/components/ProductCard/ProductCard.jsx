import React from "react"
import "./ProductCard.css"
import Button from "../UI/Button/Button"
import { api } from "../../api"

function ProductCard({ product, isCart, onItemDelete}) {

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

    const deleteFromCart = async () => {
        try {
            const response = await api.delete(`/cart/cart-items/${product.id}/`)
            console.log('Товар удален:', response.data)
            alert(`Товар ${product.name} удален из корзины`)
            
            if (onItemDelete) {
                onItemDelete()
            }
        } catch (error) {
            console.error('Ошибка удаления из корзины:', error)
            alert('Ошибка удаления товара')
        }
    }

    return (
        <div className="product-card">
            <h3 className="product-card__title">{product.name || product.product_name}</h3>
            <p className="product-card__price">{product.price || product.product_price} ₽</p> 
            <div className="product-card__parameters">
                {isCart? (
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
                <Button className='exit-btn' text='Удалить' onClick={deleteFromCart} />
            ) : (
                <Button className = 'add-to-cart-btn' text = 'В корзину' onClick={addToCart} />
            )
        }
        </div>
    );
}

export default ProductCard