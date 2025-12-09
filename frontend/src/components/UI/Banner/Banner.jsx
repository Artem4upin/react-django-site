import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Banner.css'
import PCIcon from "../../icons/PCIcon";
import ContactIcon from "../../icons/ContactIcon";
import CarIcon from "../../icons/CarIcon";
import { useNavigate } from "react-router-dom";

function Banner() {
    
    const navigate = useNavigate()

    return (
        <div className="banner">
            <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={10}
            navigation
            pagination
            loop={true}
            >
                <SwiperSlide onClick={() => navigate('/catalog')}>
                    <div className="banner__slide-content">
                        <h1>Каталог товаров</h1>
                    </div>
                    <div className="banner__slide-content">
                        <PCIcon />
                    </div>
                    <div className="banner__slide-content">
                        <h3>Компьютерные комплектующие от поставщиков</h3>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide onClick={() => navigate('/orders')}>
                    <div className="banner__slide-content">
                        <h1>Доставка</h1>
                    </div>
                    <div className="banner__slide-content">
                        <CarIcon />
                    </div>
                    <div className="banner__slide-content">
                        <h3>Закажите товар из любой точки страны</h3>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide onClick={() => navigate('/about')}>
                    <div className="banner__slide-content">
                        <h1>Наши контакты</h1>
                    </div>
                    <div className="banner__slide-content">
                        <ContactIcon />
                    </div>
                    <div className="banner__slide-content">
                        <h3>Свяжитесь с нами для консультации</h3>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Banner