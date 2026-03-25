import React, {useState, useEffect, useContext, useRef} from 'react';
import { api } from '../../api';
import ProductList from '../../components/ProductList/ProductList';
import './CatalogPage.scss'
import Loading from '../../components/UI/Loading/Loading';
import Category from '../../components/Category/Category';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import Button from '../../components/UI/Buttons/Button';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import {getErrorMsg} from "../../utils/errorMassages";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import {IBrand, ICategory, IParameter, IProduct, ISubcategory} from "../../types/product";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import FilterIcon from "../../components/icons/FilterIcon";

interface IFilters {
    category: ICategory | null;
    subcategory: ISubcategory | null;
    minPrice: number | null;
    maxPrice: number | null;
    brandId: number | null;
    paramId: number | null;
    paramValue: string | null;
    inStock: boolean;
}

function CatalogPage() {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategoryName, setSelectedCategoryName] = useState('')
    const [selectedSubcategoryName, setSelectedSubcategoryName] = useState('')
    const [loadingMore, setLoadingMore] = useState(false)
    const [nextPage, setNextPage] = useState('')
    const [loadingError, setLoadingError] = useState('')
    const [categories, setCategories] = useState<ICategory[]>([])
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false)
    const [filterData, setFilterData] = useState<{brands: IBrand[], params: IParameter[]}>({
        brands: [],
        params: []
    })
    const observerRef = useRef<IntersectionObserver | null>(null)
    const { user } = useContext(AuthContext)

    const [currentFilters, setCurrentFilters] = useState<IFilters>({
        category: null,
        subcategory: null,
        minPrice: null,
        maxPrice: null,
        brandId: null,
        paramId: null,
        paramValue: null,
        inStock: true
    })
    const [appliedFilters, setAppliedFilters] = useState<IFilters>(currentFilters)

    const hasAnyFilters =
        currentFilters.minPrice !== null ||
        currentFilters.maxPrice !== null ||
        currentFilters.brandId !== null ||
        currentFilters.paramId !== null ||
        currentFilters.paramValue !== null ||
        currentFilters.inStock === false;

    const navigate = useNavigate()

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        loadProducts(1, appliedFilters)
    }, [])

    const loadData = async () => {
        try {
            const [categoriesRes, brandsRes, paramsRes] = await Promise.all([
                api.get<ICategory[]>('/categories/'),
                api.get<IBrand[]>('/brands/'),
                api.get<IParameter[]>('/parameters/')
            ])
            setCategories(categoriesRes.data)
            setFilterData({
                brands: brandsRes.data,
                params: paramsRes.data
            })
        } catch (error) {
            console.error('Ошибка загрузки метаданных:', error)
        }
    }

    const loadProducts = async (page: number = 1, filters: IFilters = appliedFilters) => {
        setLoading(page === 1)
        setLoadingError('')

        const timeout = setTimeout(() => {
            setLoading(false)
            setLoadingError("Превышено время ожидания. Попробуйте перезагрузить страницу")
        }, 5000)

        try {
            const params: any = { page }
            if (filters.category?.id) params.category_id = filters.category.id
            if (filters.subcategory?.id) params.subcategory_id = filters.subcategory.id
            if (filters.minPrice !== null) params.min_price = filters.minPrice
            if (filters.maxPrice !== null) params.max_price = filters.maxPrice
            if (filters.brandId !== null) params.brand_id = filters.brandId
            if (filters.paramId !== null && filters.paramValue !== null) {
                params.param_id = filters.paramId
                params.param_value = filters.paramValue
            }
            if (!filters.inStock) params.in_stock = false

            const response = await api.get('/products/', { params })
            setProducts(response.data.results)
            setNextPage(response.data.next)
            clearTimeout(timeout)
        } catch (error: any) {
            clearTimeout(timeout)
            setLoadingError(getErrorMsg(error))
            setProducts([])
        } finally {
            setLoading(false)
        }
    }

    const loadingMoreProducts = async () => {
        if (loadingMore || !nextPage) return
        setLoadingMore(true)
        setLoadingError('')

        const timeout = setTimeout(() => {
            setLoadingMore(false)
            setLoadingError("Превышено время ожидания. Попробуйте перезагрузить страницу")
        }, 5000)

        try {
            const response = await axios.get(nextPage)
            clearTimeout(timeout)
            setProducts(prev => [...prev, ...response.data.results])
            setNextPage(response.data.next)
        } catch (error: any) {
            clearTimeout(timeout)
            setLoadingError(getErrorMsg(error))
            console.error('Ошибка загрузки товаров', error)
        } finally {
            setLoadingMore(false)
        }
    }

    const lastProduct = (div: HTMLDivElement | null) => {
        if (loadingMore) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && nextPage && !loadingError) {
                loadingMoreProducts()
            }
        })
        if (div) {
            observerRef.current.observe(div)
        }
    }

    const handleLocalFilterReset = () => {
        setCurrentFilters(prev => ({
            ...prev,
            minPrice: null,
            maxPrice: null,
            brandId: null,
            paramId: null,
            paramValue: null,
            inStock: true
        }));
    }

    const handleCategoryFilterChange = (category: ICategory | null, subcategory: ISubcategory | null) => {
        setCurrentFilters(prev => ({
            ...prev,
            category,
            subcategory,
            paramId: null,
            paramValue: null
        }))

        if (category && !subcategory) {
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName('')
        } else if (category && subcategory) {
            setSelectedCategoryName(category.name)
            setSelectedSubcategoryName(subcategory.name)
        } else {
            setSelectedCategoryName('')
            setSelectedSubcategoryName('')
        }
    }

    const handleFilterChange = (type: string, value: string | number | boolean) => {
        setCurrentFilters(prev => ({
            ...prev,
            [type]: value === '' ? null : value
        }))
    }

    const applyFilters = () => {
        setAppliedFilters(currentFilters)
        loadProducts(1, currentFilters)
        setIsMobileFilterOpen(false)
    }

    const resetAllFilters = () => {
        const emptyFilters = {
            category: null,
            subcategory: null,
            minPrice: null,
            maxPrice: null,
            brandId: null,
            paramId: null,
            paramValue: null,
            inStock: true
        }
        setCurrentFilters(emptyFilters)
        setAppliedFilters(emptyFilters)
        setSelectedCategoryName('')
        setSelectedSubcategoryName('')
        loadProducts(1, emptyFilters)
        setIsMobileFilterOpen(false)
    }

    const goToCreateProduct = () => {
        navigate('/create-product')
    }

    if (loading && products.length === 0) {
        return <Loading fullPage={true} />
    }

    return (
        <div className="catalog-page">
            <div className='catalog-page__title-content'>
                <h1 className='catalog-page__title'>Товары</h1>
                <div className='catalog-page__title-right'>
                    <div className='catalog-page__mobile-filter-button'>
                        <button onClick={() => setIsMobileFilterOpen(true)} className={'submit-btn'}>
                            <FilterIcon />
                        </button>
                    </div>
                    <div className='catalog-page__title-category'>
                        <p>{selectedCategoryName}</p>
                        {selectedSubcategoryName && (<p>-</p>)}
                        <p>{selectedSubcategoryName}</p>
                    </div>
                </div>
                {user?.user_type === 'Manager' && (
                    <Button text={'Добавить товар'} className={'submit-btn'} onClick={goToCreateProduct}/>
                )}
            </div>
            <div className='catalog-page__content'>
                <div className="catalog-page__filters-wrapper">
                    <Category
                        onFilterChange={handleCategoryFilterChange}
                        categories={categories}
                    />
                    <ProductFilter
                        onFilterChange={handleFilterChange}
                        selectedCategory={currentFilters.category}
                        parameters={filterData.params}
                        brands={filterData.brands}
                        onResetAll={resetAllFilters}
                        onApply={applyFilters}
                        hasAnyFilters={hasAnyFilters}
                        handleLocalFilterReset={handleLocalFilterReset}
                    />
                </div>
                <main className='catalog-page__main-container'>
                    {products.length > 0 ? (
                        <div className="catalog-page__product-list">
                            <ProductList
                                className='product-list_one-column'
                                isCart={false}
                                products={products}
                                loadingMore={loadingMore}
                                nextPage={nextPage}
                                lastProduct={lastProduct}
                            />
                        </div>
                    ) : (
                        <h2 className='catalog-page__products-not-found'>Нет результатов</h2>
                    )}
                    {loadingError && <ErrorMessage errorMsg={loadingError}/>}
                </main>
            </div>
            <FilterSidebar
                isMobileFilterOpen={isMobileFilterOpen}
                setIsMobileFilterOpen={setIsMobileFilterOpen}
                onCategoryChange={handleCategoryFilterChange}
                categories={categories}
                onFilterChange={handleFilterChange}
                onResetAll={resetAllFilters}
                onApply={applyFilters}
                selectedCategory={currentFilters.category}
                parameters={filterData.params}
                brands={filterData.brands}
                hasAnyFilters={hasAnyFilters}
                handleLocalFilterReset={handleLocalFilterReset}
            />
        </div>
    )
}

export default CatalogPage