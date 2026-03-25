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
    onResetAll: () => void;
    onApply: () => void;
    selectedCategory: ICategory | null;
    parameters: IParameter[];
    brands: IBrand[];
    isMobileFilterOpen: boolean;
    setIsMobileFilterOpen: (isMobileFilterOpen: boolean) => void;
    hasAnyFilters: boolean;
    handleLocalFilterReset: () => void;
}

function FilterSidebar({
        onCategoryChange,
        onFilterChange,
        categories,
        onResetAll,
        onApply,
        selectedCategory,
        parameters,
        brands,
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        hasAnyFilters,
        handleLocalFilterReset
                       }: IFilterSideBarProps) {

    useEffect(() => {
        if (isMobileFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [isMobileFilterOpen])

    const onFilterClose = () => {
        setIsMobileFilterOpen(false)
    }

    return (
        <div className="filter-sidebar">
            {isMobileFilterOpen && (
                <div className="filter-sidebar__overlay" onClick={onFilterClose}>
                    <div className="filter-sidebar__panel" onClick={(e) => e.stopPropagation()}>
                        <div className="filter-sidebar__header">
                            <Button
                                text="<- Закрыть"
                                className="back-btn"
                                onClick={onFilterClose}
                            />
                            <h3>Фильтры</h3>
                        </div>
                        <div className="filter-sidebar__content">
                            <Category
                                onFilterChange={onCategoryChange}
                                categories={categories}
                            />
                            <ProductFilter
                                onFilterChange={onFilterChange}
                                selectedCategory={selectedCategory}
                                parameters={parameters}
                                brands={brands}
                                hasAnyFilters={hasAnyFilters}
                                onResetAll={onResetAll}
                                onApply={onApply}
                                handleLocalFilterReset={handleLocalFilterReset}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterSidebar