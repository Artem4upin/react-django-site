import {api} from "../../api";
import {useState, useEffect, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {IProduct} from "../../types/product";
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'
import { Rating } from '@mui/material';
import './RecommendationList.scss'
import {goToProduct} from "../../utils/functions";

interface IRecommendationListProps {
    productId: number
}

function RecommendationList({productId}: IRecommendationListProps) {

    const [recommendations, setRecommendations] = useState<IProduct[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        if (productId) {
            loadRecommendations(productId)
        }
    }, [productId])

    const loadRecommendations = async (productId: number) => {
        try {
            const response = await api.get<IProduct[]>(`/products/recommendations/${productId}/`)
            setRecommendations(response.data)
        } catch (error: any) {
            console.error('Ошибка загрузки рекомендаций товаров', error)
        }
    }

    const handleCardClick = (productId: number) => {
        goToProduct(navigate, productId)
    }

    if (recommendations.length === 0)
        return null

    return (
        <div className="recommendation-list">
            <h3 className='recommendation-list__title'>Вместе с этим товаром заказывают</h3>
            <Swiper
                className="recommendation-list__swiper"
                slidesPerView={4}
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    0: {
                        slidesPerView: 1,
                        spaceBetween: 4,
                    },
                    768: {
                        slidesPerView: 3,
                        spaceBetween: 10,
                    },
                    1024: {
                        slidesPerView: 4,
                        spaceBetween: 12,
                    }
                }}
            >

                    {recommendations.map((rec) => (
                        <SwiperSlide className="recommendation-list__slide" key={rec.id} onClick={() => handleCardClick(rec.id)}>
                            <p className='recommendation-list__name'>{rec.name}</p>
                            <Rating value={rec.rating_avg} readOnly />
                            <img className="recommendation-list__image" src={rec.image_path} alt={rec.name} />
                            <p className='recommendation-list__price'>Цена: <strong>{Math.floor(rec.price).toLocaleString('ru-RU')} ₽</strong></p>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    )
}

export default RecommendationList