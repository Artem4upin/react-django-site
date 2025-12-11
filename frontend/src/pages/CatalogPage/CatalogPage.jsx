import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import ProductList from '../../components/ProductList/ProductList';
import './CatalogPage.css'
import Loading from '../../components/UI/Loading/Loading';
import Category from '../../components/UI/Category/Category';

function CatalogPage() {

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategoryName, setSelectedCategoryName] = useState(null)
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState(null)

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const response = await api.get('/products/')
            setProducts(response.data)
            setFilteredProducts(response.data)
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = (category, subcategory) => {
        
        let filtered = [...products]
        
        if (category && !subcategory) {
            filtered = products.filter(product => 
                product.category_id === category.id
            )
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName(null)
        } else if (category && subcategory) {
            filtered = products.filter(product => 
                product.subcategory_id === subcategory.id
            )
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName(subcategory.name)
        } else {
            setSelectedCategoryName(null)
            setSelectedSubcategoryName(null)
        }
        setFilteredProducts(filtered)
    }

    if (loading) {
        return <Loading />
    }

        return (
        <div className="catalog-page">
            <div className='catalog-page__title-content'>
                <h1 className='catalog-page__title'>Товары</h1>
                <div className='catalog-page__title-category'>
                    <p>{selectedCategoryName && (selectedCategoryName)}</p>
                    {selectedSubcategoryName && (<p>-</p>)}
                    <p>{selectedSubcategoryName && (selectedSubcategoryName)}</p>
                </div>
            </div>
            <div className='catalog-page__content'>
                <div className="catalog-page__category-container">
                    <Category 
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <main className="catalog-page__product-list">
                    <ProductList
                        className='product-list_one-column' 
                        products={filteredProducts}
                    />
                </main>
            </div>
        </div>
    );
}

export default CatalogPage