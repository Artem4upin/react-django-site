import React, { useState, useEffect } from 'react';
import { api } from '../../api';
import ProductList from '../../components/ProductList/ProductList';
import './CatalogPage.css'
import Loading from '../../components/UI/Loading/Loading';
import Category from '../../components/Category/Category';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import Search from '../../components/UI/Search/Search';

function CatalogPage() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [filteredProducts, setFilteredProducts] = useState([])
    const [selectedCategoryName, setSelectedCategoryName] = useState(null)
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState(null)
    const [searchResult, setSearchResult] = useState([])
    
    const [currentFilters, setCurrentFilters] = useState({
        category: null,
        subcategory: null,
        minPrice: null,
        maxPrice: null,
        brandId: null,
        paramId: null,
        paramValue: null,
        inStock: true
    })

    useEffect(() => {
        loadProducts()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [products, searchResult, currentFilters])

    const loadProducts = async () => {
        try {
            const response = await api.get('/products/')
            setProducts(response.data)
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCategoryFilterChange = (category, subcategory) => {
        if (category && !subcategory) {
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName(null)
        } else if (category && subcategory) {
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName(subcategory.name)
        } else {
            setSelectedCategoryName(null)
            setSelectedSubcategoryName(null)
        }
        
        setCurrentFilters(filters => ({
            ...filters,
            category,
            subcategory,
            paramId: null,        
            paramValue: null
        }))
    }

    const handleFilterChange = (type, value) => {
        if (type === 'reset') {
            setCurrentFilters({
                category: null,
                subcategory: null,
                minPrice: null,
                maxPrice: null,
                brandId: null,
                paramId: null,
                paramValue: null,
                inStock: true
            })
            setSelectedCategoryName(null)
            setSelectedSubcategoryName(null)
            return
        }
        
        setCurrentFilters(filters => ({
            ...filters,
            [type]: value === '' ? null : value
        }))
    }

    const handleResetProductFilters = () => {
        setCurrentFilters(filters => ({
            ...filters, 
            minPrice: null,
            maxPrice: null,
            brandId: null,
            paramId: null,
            paramValue: null,
            inStock: true
        }))
    }

    const applyFilters = () => {
        let filtered = [...(searchResult.length > 0? searchResult : products)]
        
        if (currentFilters.category && !currentFilters.subcategory) {
            filtered = filtered.filter(product => 
                product.category_id === currentFilters.category.id
            )
        } else if (currentFilters.category && currentFilters.subcategory) {
            filtered = filtered.filter(product => 
                product.subcategory_id === currentFilters.subcategory.id
            )
        }
        
        if (currentFilters.minPrice !== null) {
            filtered = filtered.filter(product => 
                parseFloat(product.price) >= parseFloat(currentFilters.minPrice)
            )
        }
        
        if (currentFilters.maxPrice !== null) {
            filtered = filtered.filter(product => 
                parseFloat(product.price) <= parseFloat(currentFilters.maxPrice)
            )
        }
        
        if (currentFilters.brandId !== null) {
            filtered = filtered.filter(product => 
                product.brand && product.brand === parseInt(currentFilters.brandId)
            )
        }
        
        if (currentFilters.paramId !== null && currentFilters.paramValue !== null) {
            filtered = filtered.filter(product => {
                return product.parameters.some(param => 
                    param.param_id == currentFilters.paramId && 
                    param.value === currentFilters.paramValue
                )
            })
        }
        
        if (currentFilters.inStock) {
            filtered = filtered.filter(product => 
                product.quantity > 0
            )
        }

        setFilteredProducts(filtered)
    }

    if (loading) {
        return <Loading />
    }

    return (
    <div className="catalog-page">
        <div className='catalog-page__search'>
            <Search 
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            />
        </div>
        <div className='catalog-page__title-content'>
            <h1 className='catalog-page__title'>Товары</h1>
            <div className='catalog-page__title-category'>
                
                <p>{selectedCategoryName && (selectedCategoryName)}</p>
                {selectedSubcategoryName && (<p>-</p>)}
                <p>{selectedSubcategoryName && (selectedSubcategoryName)}</p>
            </div>
        </div>
        <div className='catalog-page__content'>
            <div className="catalog-page__filters-wrapper">
                <Category 
                    onFilterChange={handleCategoryFilterChange}
                />
                <ProductFilter 
                    onFilterChange={handleFilterChange}
                    onResetProductFilters={handleResetProductFilters}
                    selectedCategory={currentFilters.category}
                />
            </div>
            <main className='catalog-page__main-container'>
            {filteredProducts.length > 0 ? (
                <div className="catalog-page__product-list">
                    <ProductList
                        className='product-list_one-column' 
                        products={filteredProducts}
                    />
                </div>
            ) : (
                <h2 className='catalog-page__products-not-found'>Нет результатов</h2>
            )}
            </main>
        </div>
    </div>
    );
}

export default CatalogPage