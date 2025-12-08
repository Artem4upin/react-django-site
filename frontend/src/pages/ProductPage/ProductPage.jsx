import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import './ProductPage.css';
import Button from '../../components/UI/Button/Button';
import Loading from '../../components/UI/Loading/Loading';

function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadProduct()
    }, [id])

    const loadProduct = async () => {
        try {
            const response = await api.get(`/products/${id}/`)
            setProduct(response.data)
        } catch (error) {
            console.error('Ошибка загрузки товара:', error)
        } finally {
            setLoading(false)
        }
    };

    const addToCart = async () => {
        try {
            await api.post('cart/cart-items/', {
                product: product.id,
                quantity: quantity
            })
            alert(`Товар ${product.name} добавлен в корзину`)
        } catch (error) {
            console.error('Ошибка добавления в корзину')
        }
    }

    if (loading) {
        return <Loading />
    }

    if (!product) {
        return (
            <div>
                <h2>Товар не найден</h2>
                <button onClick={() => navigate('/catalog')}>Назад к товарам</button>
            </div>
        )
    }

    return (
        <div className="product-page">
            <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
            <div className="product-page__content">
                <div className="product-page__info">
                    <h1>{product.name}</h1>
                    <div className="product-page__price">Цена: {product.price} ₽</div>
                    
                    <div className="product-page__parameters">
                        <h3>Характеристики:</h3>
                        {product.parameters?.map((param, index) => (
                            <div key={index} className="parameters__item">
                                <span>{param.name}: </span>
                                <span>{param.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="product-page__description">
                        <h3>Описание</h3>
                        <p>{product.description}</p>
                    </div>

                    
                </div>
                    <div className="product-page__button-container">
                    <Button 
                        text="Добавить в корзину" 
                        onClick={addToCart}
                        className="add-to-cart-btn"
                    />
                        <div className='product-page__quantity-container'>
                            <Button className='quantity-btn'
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            text={'-'}
                            >
                            -
                            </Button>
                            <input 
                            type="text" 
                            maxLength={2} 
                            className='product-page__product-quantity' 
                            value={quantity}
                            readOnly
                            />
                            <Button 
                            className='quantity-btn'
                            onClick={() => setQuantity(quantity + 1)}
                            text={'+'}
                            >
                            </Button>
                        </div>
                    </div>
                
            </div>
        </div>
    )
}

export default ProductPage;