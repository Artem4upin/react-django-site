import React, {useEffect} from 'react';
import Category from "../../../components/Category/Category";
import ProductFilter from "../../../components/ProductFilter/ProductFilter";
import {IBrand, ICategory, IParameter, ISubcategory} from "../../../types/product";
import Button from "../../../components/UI/Buttons/Button";
import './FilterSidebar.scss'

interface IFilterSideBarProps {
    onCategoryChange: (category: ICategory | null, subcategory: ISubcategory | null) => void;
    categories: ICategory[];
    onFilterChange: (key: string, value: string | number | boolean) => void;
    onResetProductFilters: () => void;
    selectedCategory: ICategory | null;
    parameters: IParameter[];
    brands: IBrand[];
    isMobileFilterOpen: boolean;
    setIsMobileFilterOpen: (isMobileFilterOpen: boolean) => void;
}

function FilterSidebar({
    onCategoryChange,
    onFilterChange,
    categories,
    onResetProductFilters,
    selectedCategory,
    parameters,
    brands,
    isMobileFilterOpen,
    setIsMobileFilterOpen,
    }: IFilterSideBarProps) {


    // Блокирует прокрутку каталога если открыт бар
    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileFilterOpen]);

    const onFilterClose = () => {
        setIsMobileFilterOpen(false);
    }

    return (
        <div className="filter-sidebar">
            {isMobileFilterOpen && (
                <div className="filter-sidebar__overlay" onClick={onFilterClose}>
                    <div className="filter-sidebar__panel" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-sidebar__header">
                            <h3>Выберите фильтры</h3>
                            <Button
                                text="✕"
                                className="exit-btn"
                                onClick={onFilterClose}
                            />
                        </div>
                        <div className="filter-sidebar__content">
                            <Category
                                onFilterChange={onCategoryChange}
                                categories={categories}
                            />
                            <ProductFilter
                                onFilterChange={onFilterChange}
                                onResetProductFilters={onResetProductFilters}
                                selectedCategory={selectedCategory}
                                parameters={parameters}
                                brands={brands}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default FilterSidebar