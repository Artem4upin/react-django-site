import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import './ProductPage.css';
import Button from '../../components/UI/Button/Button';
import Loading from '../../components/UI/Loading/Loading';
import { addToCart } from '../../utils/functions';
import { AuthContext } from '../../hooks/authContext';

function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const { user } = useContext(AuthContext)
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

    const handleAddToCartClick = () => {
        addToCart(product.id, quantity, product.name)
        console.log(product.image_pass)
    }

    if (loading) {
        return <Loading />
    }

    if (!product) {
        return (
            <div>
                <h2>Товар не найден</h2>
            </div>
        )
    }

    return (
        <div className="product-page">
            <button className="back-btn" onClick={() => navigate(-1)}>Назад</button>
            <div className="product-page__content">
                <div className="product-page__image-container">
                    {product.image_pass ? (
                        <img 
                            src={product.image_pass} 
                            alt={product.name}
                            className="image-container__image"
                        />
                    ) : (
                        <p className="image-container_no-image">Нет изображения</p>
                    )}
                </div>
                <div className="product-page__info">
                    <h3>{product.name}</h3>
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
                    {user && (
                    <div className="product-page__button-container">
                        <Button 
                            text="Добавить в корзину" 
                            onClick={handleAddToCartClick}
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
                    )}
                </div>
            </div>
    )
}

export default ProductPage;