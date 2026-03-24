import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../api';
import './ProductPage.scss';
import Button from '../../components/UI/Buttons/Button';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Inputs/Input';
import { addToCart } from '../../utils/functions';
import { AuthContext } from '../../hooks/AuthContext';
import {IProduct} from "../../types/product";

function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const { user } = useContext(AuthContext)
    const [product, setProduct] = useState<IProduct | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    
    const [editName, setEditName] = useState('')
    const [editPrice, setEditPrice] = useState(0)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editDescription, setEditDescription] = useState('')

    useEffect(() => {
        loadProduct()
    }, [id])

    useEffect(() => {
        if (product) {
            setEditName(product.name || '')
            setEditPrice(product.price || 0)
            setEditQuantity(product.quantity || 0)
            setEditDescription(product.description || '')
        }
    }, [product])

    const loadProduct = async () => {
        try {
            const response = await api.get<IProduct>(`/products/${id}/`)
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
        if (user?.user_type !== 'Manager') {
            alert('Только менеджер может редактировать товары')
            return
        }

        setIsSaving(true)
        try {
            const dataToUpdate = {
                name: editName,
                price: Number(editPrice),
                quantity: Number(editQuantity),
                description: editDescription
            }

            const response = await api.patch(`/products/${id}/`, dataToUpdate)
            
            setProduct(response.data)
            setIsEdit(false)
            alert('Товар успешно обновлен!')
            
        } catch (error: any) {
            console.error('Ошибка сохранения:', error)
            alert('Ошибка сохранения: ' + (error.response?.data?.error || error.message))
        } finally {
            setIsSaving(false)
        }
    }

    const cancelEdit = () => {
        if (product) {
            setEditName(product.name || '')
            setEditPrice(product.price || 0)
            setEditQuantity(product.quantity || 0)
            setEditDescription(product.description || '')
        }
        setIsEdit(false)
    }

    const handleAddToCartClick = () => {
        if (!product) return
        if (quantity > product.quantity || quantity < 1) return;
        addToCart(product.id, quantity, product.name);
    }

    if (loading) {
        return <Loading fullPage={true}/>
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
                            className="product-page__image-container__image"
                        />
                    ) : (
                        <p className="product-page__image-container__no-image">Нет изображения</p>
                    )}
                </div>
                <div className="product-page__info">
                    <h3>{product.name}</h3>
                    <div className="product-page__info__price">Цена: <strong>{product.price} ₽</strong></div>
                    
                    <div className="product-page__info__parameters">
                        <h3>Характеристики:</h3>
                        {product.parameters?.map((param, index) => (
                            <div key={index} className="product-page__info__parameters__item">
                                <span>{param.name}: </span>
                                <span>{param.value}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="product-page__info__description">
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
                            />
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
                            />
                        </div>
                    </div>
                    )}
                </div>
            ) : (
                <div className='product-page__edit-content'>
                    <h3>Редактировать товар</h3>

                    <div className='product-page__edit-inputs'>    
                        <div className="product-page__edit-inputs__edit-field">
                            <label>Название товара:</label>
                            <Input 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>

                        <div className="product-page__edit-inputs__edit-field">
                            <label>Цена (₽):</label>
                            <Input 
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="product-page__edit-inputs__edit-field">
                            <label>Количество на складе:</label>
                            <Input 
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Number(e.target.value))}
                            />
                        </div>

                        <div className="product-page__edit-inputs__edit-field">
                            <label>Описание:</label>
                            <textarea
                                className='product-page__edit-inputs__edit-description'
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={5}
                                placeholder="Описание товара"
                            />
                        </div>
                    </div>
                    
                    <div className='product-page__edit-buttons'>
                        <Button
                            text={isSaving ? "Сохранение..." : "Сохранить"}
                            className={'submit-btn'}
                            onClick={saveEdit}
                            disabled={isSaving}
                        />

                        <Button
                            text="Отмена"
                            className="exit-btn"
                            onClick={cancelEdit}
                            disabled={isSaving}
                        />
                    </div>
                </div>
                )}
                {user && user.user_type === 'Manager' && !isEdit && (
                    <div className='product-page__manager-buttons'>
                        <Button text={'Редактировать товар'} className={'submit-btn'} onClick={switchEdit}/>
                    </div>
            )}
            </div>
    )
}

export default ProductPage