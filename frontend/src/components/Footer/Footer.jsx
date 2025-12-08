// Footer.jsx
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer__content">
                <div className="footer__brand">
                    <span className="footer__shop-name">TechShop</span>
                </div>
                
                <nav className="footer__nav">
                    <Link to="/privacy" className="footer__link">Политика конфиденциальности</Link>
                    <Link to="/terms" className="footer__link">Условия использования</Link>
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