import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Rating } from '@mui/material';
import { api } from '../../api';
import './ProductPage.scss';
import Button from '../../components/UI/Buttons/Button';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Inputs/Input';
import { addToCart } from '../../utils/functions';
import { AuthContext } from '../../hooks/AuthContext';
import {IProduct, IReview} from "../../types/product";
import ProductReviewList from "../../components/ProductReviewList/ProductReviewList";
import RecommendationList from "../../components/RecommendationList/RecommendationList";
import {getErrorMsg} from "../../utils/errorMassages";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage/SuccessMessage";

function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { user } = useContext(AuthContext)
    const [product, setProduct] = useState<IProduct>()
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(true)
    const [isEdit, setIsEdit] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [reviews, setReviews] = useState<IReview[]>([])

    const [editName, setEditName] = useState('')
    const [editPrice, setEditPrice] = useState(0)
    const [editQuantity, setEditQuantity] = useState(0)
    const [editDescription, setEditDescription] = useState('')

    const [addedToCart, setAddedToCart] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [addToCartError, setAddToCartError] = useState<string | null>(null);
    const [saveProductError, setSaveProductError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (id) loadProduct();
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
            await loadReviews(response.data.id);
        } catch (error) {
            console.error('Ошибка загрузки товара:', error)
        } finally {
            setLoading(false)

        }
    }

    const loadReviews = async (productId: number) => {
        try {
            const response = await api.get<IReview[]>(`/products/reviews/${productId}`)
            setReviews(response.data)
        } catch (error) {
            console.error("Ошибка загрузки отзывов", error)
        }
    }

    const switchEdit = () => {
        setIsEdit(!isEdit)
    }

    const saveEdit = async () => {
        if (user?.user_type !== 'Manager') {
            setSaveProductError('Ошибка сохранения изменений')
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
            setSuccessMessage('Товар успешно обновлен')
            setTimeout(() => {setSuccessMessage(null) }, 5000)
            
        } catch (error: any) {
            console.error('Ошибка сохранения:', error)
            setSaveProductError(`Ошибка сохранения: ${getErrorMsg(error)}`)
            setTimeout(() => {setSaveProductError(null) }, 5000)
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

    const handleAddToCartClick = async () => {
        if (!product) {
            setAddToCartError('Товар не найден');
            return;
        }
        if (quantity > product.quantity || quantity < 1) {
            setAddToCartError('Не хватает товара на складе');
            return;
        }
        if (addLoading) return;

        setAddLoading(true);
        setAddToCartError(null);

        try {
            await addToCart(product.id, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (error: any) {
            setAddToCartError(getErrorMsg(error) || 'Ошибка добавления в корзину');
            setTimeout(() => setAddToCartError(null), 3000);
        } finally {
            setAddLoading(false);
        }
    };

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
                    {product.image_path ? (
                        <img 
                            src={product.image_path}
                            alt={product.name}
                            className="product-page__image"
                        />
                    ) : (
                        <p className="product-page__no-image">Нет изображения</p>
                    )}
                </div>
                <div className="product-page__info">
                    <h3>{product.name}</h3>
                    <div className='product-page__rating-container'>
                        <p className="product-page__rating">{product.rating_avg}</p>
                        <Rating size='large' precision={0.1} value={product.rating_avg} readOnly/>
                    </div>
                    <div className="product-page__price">Цена: <strong>{Math.floor(product.price).toLocaleString('ru-RU')} ₽</strong></div>

                    {product.parameters.length > 0  && (
                    <div className="product-page__parameters">
                        <h3>Характеристики:</h3>
                        {product.parameters?.map((param, index) => (
                            <div key={index} className="product-page__parameters-item">
                                <span>{param.name}: <strong>{param.value}</strong></span>
                            </div>
                        ))}
                    </div>
                    )}
                    
                    <div className="product-page__description">
                        <h3>Описание</h3>
                        <p>{product.description}</p>
                    </div>

                    
                </div>
                {user && (
                    <div className="product-page__button-container">
                        <Button
                            className={`add-to-cart-btn ${addedToCart ? "add-to-cart-btn--added" : ""} ${addToCartError ? "add-to-cart-btn--error" : ""}`}
                            text={addLoading ? "Добавление" : addedToCart ? "Добавлено" : addToCartError ? "Ошибка" : "В корзину"}
                            onClick={handleAddToCartClick}
                            disabled={addLoading || addedToCart || !!addToCartError}
                        />
                        {addToCartError && (<ErrorMessage className="product-page__error-message" errorMsg={addToCartError} />)}

                        <div className='product-page__quantity-container'>
                            <Button className='quantity-btn'
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1 || addLoading}
                                    text={'-'}
                            />
                            <input
                                type="text"
                                className='product-page__quantity'
                                value={quantity}
                                readOnly
                            />
                            <Button
                                className='quantity-btn'
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={quantity >= product.quantity || addLoading}
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
                        <div className="product-page__edit-field">
                            <label>Название товара:</label>
                            <Input 
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>

                        <div className="product-page__edit-field">
                            <label>Цена (₽):</label>
                            <Input 
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="product-page__edit-field">
                            <label>Количество на складе:</label>
                            <Input 
                                type="number"
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(Number(e.target.value))}
                            />
                        </div>

                        <div className="product-page__edit-field">
                            <label>Описание:</label>
                            <textarea
                                className='product-page__edit-description'
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
                    {saveProductError && (<ErrorMessage errorMsg={saveProductError} />)}
                    {successMessage && (<SuccessMessage successMsg={successMessage} />)}
                </div>
                )}
                {user && user.user_type === 'Manager' && !isEdit && (
                    <div className='product-page__manager-buttons'>
                        <Button text={'Редактировать товар'} className={'submit-btn'} onClick={switchEdit}/>
                    </div>)}
            {!isEdit && (
                <>
                    <RecommendationList productId={product.id} />
                    <ProductReviewList reviews={reviews} productId={product.id} />
                </>
            )}
            </div>
    )
}

export default ProductPage