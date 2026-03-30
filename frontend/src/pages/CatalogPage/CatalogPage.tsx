import React, {useEffect, useContext, useRef} from 'react';
import ProductList from '../../components/ProductList/ProductList';
import './CatalogPage.scss'
import Loading from '../../components/UI/Loading/Loading';
import Category from '../../components/Category/Category';
import ProductFilter from '../../components/ProductFilter/ProductFilter';
import Button from '../../components/UI/Buttons/Button';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import FilterSidebar from "./FilterSidebar/FilterSidebar";
import FilterIcon from "../../components/icons/FilterIcon";
import {
    useCurrentFilters,
    useLoadFilterData,
    useLoading,
    useLoadingError,
    useLoadingMore, useLoadMoreProducts, useLoadProducts,
    useNextPage,
    useProducts,
    useSelectedCategoryName, useSelectedSubcategoryName, useSetIsMobileFilterSidebarOpen
} from "../../store/useCatalogStore";

function CatalogPage() {
    const products = useProducts();
    const loading  = useLoading();
    const loadingMore = useLoadingMore();
    const nextPage = useNextPage();
    const loadingError = useLoadingError();

    const selectedCategoryName = useSelectedCategoryName();
    const selectedSubcategoryName = useSelectedSubcategoryName();
    const currentFilters = useCurrentFilters();

    const observerRef = useRef<IntersectionObserver | null>(null)
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    const loadProducts = useLoadProducts();
    const loadFilterData = useLoadFilterData();
    const loadMoreProducts = useLoadMoreProducts();
    const setIsMobileFilterOpen = useSetIsMobileFilterSidebarOpen();

    useEffect(() => {
        loadFilterData()
        loadProducts(1, currentFilters);
    }, [])

    const lastProduct = (div: HTMLDivElement | null) => {
        if (loadingMore) return

        if (observerRef.current) {
            observerRef.current.disconnect()
        }

        observerRef.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && nextPage && !loadingError) {
                loadMoreProducts()
            }
        })
        if (div) {
            observerRef.current.observe(div)
        }
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
                        {user?.user_type === 'Manager' && (
                            <Button text={'Добавить'} className={'submit-btn'} onClick={goToCreateProduct}/>
                        )}
                    </div>
                    <div className='catalog-page__title-category'>
                        <p>{selectedCategoryName}</p>
                        {selectedSubcategoryName && (<p>-</p>)}
                        <p>{selectedSubcategoryName}</p>
                    </div>
                </div>
            </div>
            <div className='catalog-page__content'>
                <div className="catalog-page__filters-wrapper">
                    <Category />
                    <ProductFilter />
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
            <FilterSidebar />
        </div>
    )
}

export default CatalogPage