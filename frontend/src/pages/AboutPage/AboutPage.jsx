import React from 'react';
import './AboutPage.css';

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-page__container">
                <h1 className="about-page__title">О нас</h1>
                
                <div className="about-page__content">
                    <p>
                        TechShop — это современный интернет-магазин компьютерных комплектующих и электроники.
                    </p>
                    
                    <h2>Почему выбирают нас</h2>
                    <ul>
                        <li>Оригинальная продукция от производителей</li>
                        <li>Доступные цены</li>
                        <li>Быстрая доставка</li>
                        <li>Проверенные товары</li>
                    </ul>
                    
                    <h2>Контакты</h2>
                    <p>Телефон 8 (923) 123-45-67</p>
                    <p>Email: info@techshop.ru</p>
                    <p>Адрес: г. Кемерово, ул. Техническая, д.3</p>
                    <p>Режим работы: Пн-Пт 9:00-21:00, Сб-Вс 10:00-20:00</p>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;