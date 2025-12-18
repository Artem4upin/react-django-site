import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import './ProductPage.css';
import Button from '../../components/UI/Button/Button';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Input/Input';
import { addToCart } from '../../utils/functions';
import { AuthContext } from '../../hooks/authContext';

function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const { user } = useContext(AuthContext)
    const [product, setProduct] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const [saving, setSaving] = useState(false)
    
    const [editName, setEditName] = useState()
    const [editPrice, setEditPrice] = useState()
    const [editQuantity, setEditQuantity] = useState()
    const [editDescription, setEditDescription] = useState()

    useEffect(() => {
        loadProduct()
    }, [id])

    useEffect(() => {
        if (product) {
            setEditName(product.name || '')
            setEditPrice(product.price || '')
            setEditQuantity(product.quantity || '')
            setEditDescription(product.description || '')
        }
    }, [product])

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

    const switchEdit = () => {
        setIsEdit(!isEdit)
    }

    const saveEdit = async () => {
        if (!user?.user_type === 'Manager') {
            alert('Только менеджер может редактировать товары')
            return
        }

        setSaving(true)
        try {
            const dataToUpdate = {
                name: editName,
                price: editPrice,
                quantity: editQuantity,
                description: editDescription
            }

            const response = await api.patch(`/products/${id}/`, dataToUpdate)
            
            setProduct(response.data)
            setIsEdit(false)
            alert('Товар успешно обновлен!')
            
        } catch (error) {
            console.error('Ошибка сохранения:', error)
            alert('Ошибка сохранения: ' + (error.response?.data?.error || error.message))
        } finally {
            setSaving(false)
        }
    }

    const cancelEdit = () => {
        if (product) {
            setEditName(product.name || '')
            setEditPrice(product.price || '')
            setEditQuantity(product.quantity || '')
            setEditDescription(product.description || '')
        }
        setIsEdit(false)
    }

    const handleAddToCartClick = () => {
        if (quantity > product.quantity || quantity < 1)
            return 
        addToCart(product.id, quantity, product.name)
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
            {!isEdit? (
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
                            
                            className='product-page__product-quantity' 
                            value={quantity}
                            readOnly
                            />
                            <Button 
                            className='quantity-btn'
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity >= product.quantity}
                            text={'+'}
                            >
                            </Button>
                        </div>
                    </div>
                    )}
                </div>
            ) : (
                <div className='product-page__edit-content'>
                    <h3>Редактировать товар</h3>

                    <div className='product-page__edit-inputs'>    
                        <div className="edit-field">
                            <label>Название товара:</label>
                            <Input 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>

                        <div className="edit-field">
                            <label>Цена (₽):</label>
                            <Input 
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                            />
                        </div>

                        <div className="edit-field">
                            <label>Количество на складе:</label>
                            <Input 
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                            />
                        </div>

                        <div className="edit-field">
                            <label>Описание:</label>
                            <textarea
                                className='product-page__edit-description'
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows="5"
                                placeholder="Описание товара"
                            />
                        </div>
                    </div>
                    
                    <div className='product-page__edit-buttons'>
                        <Button
                            text={saving ? "Сохранение..." : "Сохранить"} 
                            className={'submit-btn'}
                            onClick={saveEdit}
                            disabled={saving}
                        />

                        <Button
                            text="Отмена"
                            className="exit-btn"
                            onClick={cancelEdit}
                            disabled={saving}
                        />
                    </div>
                </div>
                )}
                {user && user.user_type === 'Manager' && !isEdit && (
                    <div className='product-page__buttons'>
                        <Button text={'Редактировать товар'} className={'submit-btn'} onClick={switchEdit}/>
                    </div>
            )}
            </div>
    )
}

export default ProductPage