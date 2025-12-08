import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import ProductList from '../../components/ProductList/ProductList';
import './CatalogPage.css';
import Loading from '../../components/UI/Loading/Loading';

function CatalogPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="catalog-page">
            <h1 className='catalog-page__title'>Все товары</h1>
            <p className='catalog-page__product-sum'>Всего товаров: {products.length}</p>
            <ProductList 
                products={products} 
                isCart={false} 
            />
        </div>
    );
}

export default CatalogPage;