import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';
import { Box, Typography, Rating, TextField, Button, Card, Alert } from '@mui/material';
import { api } from '../../api';
import './ProductAddReview.scss';
import {AuthContext} from "../../hooks/AuthContext";
import {TRating} from "../../types/product";
import {getErrorMsg} from "../../utils/errorMassages";
import XIcon from "../icons/XIcon";

interface IProductAddReviewProps {
    productId: number;
}

interface IAddReviewFormData {
    rating: TRating;
    comment: string;
    image_path: File | null;
}

function ProductAddReview({
    productId,
    }: IProductAddReviewProps) {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<IAddReviewFormData>({
        defaultValues: {
            rating: null,
            comment: '',
            image_path: null,
        }
    });
    const navigate = useNavigate();
    const user = useContext(AuthContext)
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setSubmitError('Размер изображения не должен превышать 2MB');
                removeImage();
                return;
            }
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            }
            reader.readAsDataURL(file);
        }
    }

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const onSubmit = async (data: IAddReviewFormData) => {
        setSubmitError('')

        const formData = new FormData();
        formData.append('rating', String(data.rating));
        formData.append('comment', data.comment);
        if (selectedImage) {
            formData.append('image_path', selectedImage);
        }

        try {
            await api.post(`/products/reviews/${productId}/`, formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            })
            setSubmitSuccess(true);
            reset()
            removeImage()
        } catch (error: any) {
            if (error.response.status === 401) {
                setSubmitError('Для отправки отзыва необходима авторизация');
                navigate('/login');
            } else if (error.response.status === 400) {
                setSubmitError(error.response?.data?.error || 'Ошибка добавления отзыва');
            } else {
                setSubmitError(getErrorMsg(error))
            }
        }
    }

    if (!user) {
        return (
            <Card className='product-add-review--not-auth'>
                <Typography>
                    Войдите в аккаунт чтобы оставить отзыв
                </Typography>
            </Card>
        )
    }

    return (
        <Card className="product-add-review">
            <Typography className="product-add-review__title" variant="subtitle1" color="textPrimary">
                Оставить отзыв
            </Typography>

            <Box component='form' onSubmit={handleSubmit(onSubmit)} className='product-add-review__form'>
                <Box className='product-add-review__form__rating'>
                    <Controller
                        control={control}
                        name='rating'
                        rules={{ required: "Выберите оценку для товара" }}
                        render={({field}) => (
                        <Rating
                            value={field.value}
                            onChange={(e, newValue) => field.onChange(newValue)}
                            size='large'
                        />
                    )}
                    />
                    {errors.rating && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                            {errors.rating.message}
                        </Typography>
                    )}
                </Box>
                <Box className='product-add-review__form__comment'>
                    <Controller
                        control={control}
                        name='comment'
                        rules={{
                            required: 'Введите ваш отзыв',
                            minLength: {value: 10, message: 'Минимум 10 символов'},
                            maxLength: {value: 500, message: 'Максимум 500 символов'}
                    }}
                        render={({field}) => (
                        <TextField
                            {...field}
                            label='Ваш отзыв'
                            multiline
                            fullWidth
                            placeholder='Поделитесь впечатлением о товаре'
                            disabled={isSubmitting}
                            error={!!errors.comment}
                            helperText={errors.comment?.message}
                        />
                    )}
                    />
                </Box>

                <Box className='product-add-review__form__image-container'>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        disabled={isSubmitting}
                    />
                    {imagePreview && (
                        <Box
                            className='product-add-review__image-container__image'
                            style={{ position: 'relative', display: 'inline-block' }}
                        >
                            <img
                                src={imagePreview}
                                alt="Изображение"
                                style={{
                                    maxWidth: '200px',
                                    maxHeight: '200px',
                                    width: 'auto',
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }}
                            />
                            <Button
                                className='product-add-review__image-container__image__button'
                                size="small"
                                variant="contained"
                                color="error"
                                onClick={removeImage}
                                style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    right: '-10px',
                                    minHeight: '20px',
                                    minWidth: '20px',
                                    padding: '0',
                                    }}
                            >
                            <XIcon />
                            </Button>
                        </Box>
                    )}
                    <Typography variant="caption" color="textSecondary">
                        Максимальный размер изображения 2MB
                    </Typography>
                </Box>

                {submitError && (
                    <Alert severity="error" onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                {submitSuccess && (
                    <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                        Отзыв успешно добавлен!
                    </Alert>
                )}

                <Button
                    className="product-add-review__form__button"
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                >
                {isSubmitting ? ('Отправка') : ('Отправить отзыв')}
                </Button>
            </Box>
        </Card>
    )
}

export default ProductAddReview