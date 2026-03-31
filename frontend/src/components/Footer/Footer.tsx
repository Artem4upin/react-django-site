import React from 'react';
import './Footer.scss';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <span className="footer__shop-name">TechShop</span>
                </div>
                
                <nav className="footer__nav">
                    <a
                        href="https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FkCZkIY1NK6uYdXHYPp3mBZxU1qfDfPfGfLsDCEpE8v32t9lJkXNDFC64Q5FU%2FzbPq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=privacy.pdf&nosw=1"
                        className="footer__link"
                        target="_blank"
                    >
                        Политика конфиденциальности
                    </a>
                    <a
                        href="https://docs.yandex.ru/docs/view?url=ya-disk-public%3A%2F%2FqZua%2B0Ud9Z0%2F9dCiQoNCSWRtA%2Fnsbfwde8%2FGW9l5slIiPyV8HgS5XMrNntzeB7jpq%2FJ6bpmRyOJonT3VoXnDag%3D%3D&name=terms.pdf&nosw=1"
                        className="footer__link"
                        target="_blank"
                    >
                        Условия использования
                    </a>
                    <Link to="/faq" className="footer__link">FAQ</Link>
                </nav>
                
                <div className="footer__copyright">
                    <p>© {new Date().getFullYear()} Все права защищены</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;