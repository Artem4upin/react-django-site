import {api} from "../../../api";
import {useState, useEffect} from "react";
import './BrandsSlider.scss'
import {IBrand} from "../../../types/product";
import {Swiper, SwiperSlide} from 'swiper/react'
import {Navigation} from 'swiper/modules'

function BrandsSlider () {

    const [brands, setBrands] = useState<IBrand[]>([])

    useEffect(() => {
        loadBrands()
    }, []);

    const loadBrands = async () => {
        try {
            const response = await api.get(`/brands/`)
            setBrands(response.data)
        }
        catch (error) {
            console.error('Ошибка загрузки брендов слайдера', error)
        }
    }

    return (
        <Swiper
            className='brands-slider'
            slidesPerView={8}
            spaceBetween={20}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
                0: {
                    slidesPerView: 2,
                    spaceBetween: 4,
                },
                375: {
                    slidesPerView: 3,
                    spaceBetween: 6
                },
                768: {
                    slidesPerView: 5,
                    spaceBetween: 8
                },
                1024: {
                    slidesPerView: 8,
                    spaceBetween: 10
                }
            }}

        >
            {brands.map((brand) => (
                <SwiperSlide key={brand.id} className='brands-slider__slide'>
                    <img
                        className='brands-slider__image'
                        src={brand.image_path}
                        alt={brand.name}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default BrandsSlider;