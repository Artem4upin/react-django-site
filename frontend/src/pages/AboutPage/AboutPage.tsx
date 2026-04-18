import './AboutPage.scss';

function AboutPage() {
    return (
        <div className="about-page">
            <div className="about-page__container">
                <h1 className="about-page__title">О нас</h1>

                <div className="about-page__content">
                    <p className="about-page__description">
                        TechShop — это современный интернет-магазин компьютерных комплектующих и электроники.
                        Мы предлагаем только качественные товары от проверенных производителей.
                    </p>

                    <h2 className="about-page__section-title">Почему выбирают нас</h2>
                    <ul className="about-page__advantages-list">
                        <li className="about-page__advantage-item">Оригинальная продукция от производителей</li>
                        <li className="about-page__advantage-item">Доступные цены</li>
                        <li className="about-page__advantage-item">Быстрая доставка</li>
                        <li className="about-page__advantage-item">Проверенные товары</li>
                        <li className="about-page__advantage-item">Гарантия качества</li>
                        <li className="about-page__advantage-item">Круглосуточная поддержка</li>
                    </ul>

                    <h2 className="about-page__section-title">Контакты</h2>
                    <p className="about-page__contact-item"><strong>Телефон:</strong> 8 (923) 123-45-67</p>
                    <p className="about-page__contact-item"><strong>Email:</strong> info@techshop.ru</p>
                    <p className="about-page__contact-item"><strong>Адрес:</strong> г. Кемерово, ул. Техническая, д.3</p>
                    <p className="about-page__contact-item"><strong>Режим работы:</strong> Пн-Пт 9:00-21:00, Сб-Вс 10:00-20:00</p>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;