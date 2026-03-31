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
import UploadIcon from "../icons/UploadIcon";

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
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const checkAndSetImage = (file: File) => {
        if (file.size > 2 * 1024 * 1024) {
            setSubmitError('Размер изображения не должен превышать 2MB');
            return;
        }

        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
        setSubmitError('');
    };

    const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            checkAndSetImage(file);
        }
    }

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            checkAndSetImage(file);
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
            <Card >
                <Typography>
                    Войдите в аккаунт чтобы оставить отзыв
                </Typography>
            </Card>
        )
    }

    return (
        <Card className="product-add-review">
            <Typography variant="subtitle1" color="textPrimary">
                Оставить отзыв
            </Typography>

            <Box component='form' onSubmit={handleSubmit(onSubmit)} className='product-add-review__form'>
                <Box>
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
                        <Typography className='product-add-review__rating-error' variant="caption" color="error" >
                            {errors.rating.message}
                        </Typography>
                    )}
                </Box>
                <Box >
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

                <Box className='product-add-review__dropzone'
                     onDragEnter={handleDragEnter}
                     onDragLeave={handleDragLeave}
                     onDragOver={handleDragOver}
                     onDrop={handleDrop}
                     onClick={() => fileInputRef.current?.click()}
                >
                    <UploadIcon />
                    <Typography className='product-add-review__dropzone-title' variant="body2" align="center">
                        {isDragging
                            ? "Отпустите изображение здесь"
                            : "Перетащите изображение сюда\nили нажмите для выбора"}
                    </Typography>
                    <Typography className='product-add-review__dropzone-description' variant="caption" color="textSecondary">
                        Максимальный размер изображения 2 МБ
                    </Typography>
                </Box>

                <input
                    className='product-add-review__review-input'
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    disabled={isSubmitting}
                />

                {imagePreview && (
                    <Box className='product-add-review__image-container'
                         >
                        <img
                            className='product-add-review__image'
                            src={imagePreview}
                            alt="Изображение"
                        />
                        <Button
                            className='product-add-review__delete-button'
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={removeImage}
                        >
                            <XIcon />
                        </Button>
                    </Box>
                )}

                {submitError && (
                    <Alert severity="error" onClose={() => setSubmitError('')}>
                        {submitError}
                    </Alert>
                )}

                {submitSuccess && (
                    <Alert severity="success" onClose={() => setSubmitSuccess(false)}>
                        Отзыв добавлен
                    </Alert>
                )}

                <Button
                    className="product-add-review__submit-button"
                    type='submit'
                    variant='contained'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                </Button>
            </Box>
        </Card>
    )
}

export default ProductAddReview