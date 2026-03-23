import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Banner.scss'
import PCIcon from "../../icons/PCIcon";
import ContactIcon from "../../icons/ContactIcon";
import CarIcon from "../../icons/CarIcon";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../hooks/AuthContext";
import { useContext } from "react";

function Banner() {
    
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    
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
                        <h3>Каталог товаров</h3>
                    </div>
                    <div className="banner__slide-content">
                        <PCIcon />
                    </div>
                    <div className="banner__slide-content">
                        <p>Компьютерные комплектующие от производителей</p>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide onClick={user ? (() => navigate('/orders')): undefined}>
                    <div className="banner__slide-content">
                        <h3>Доставка</h3>
                    </div>
                    <div className="banner__slide-content">
                        <CarIcon />
                    </div>
                    <div className="banner__slide-content">
                        <p>Закажите товар из любой точки страны</p>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide onClick={() => navigate('/about')}>
                    <div className="banner__slide-content">
                        <h3>Наши контакты</h3>
                    </div>
                    <div className="banner__slide-content">
                        <ContactIcon />
                    </div>
                    <div className="banner__slide-content">
                        <p>Свяжитесь с нами для сотрудничества</p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Banner