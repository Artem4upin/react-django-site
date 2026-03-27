import React, {useEffect, useState} from 'react';
import Category from "../../../components/Category/Category";
import ProductFilter from "../../../components/ProductFilter/ProductFilter";
import './FilterSidebar.scss'
import {useIsMobileFilterSidebarOpen, useSetIsMobileFilterSidebarOpen} from "../../../store/useCatalogStore";
import ArrowLeftIcon from "../../../components/icons/ArrowLeftIcon";

function FilterSidebar() {
    const isMobileFilterOpen = useIsMobileFilterSidebarOpen();
    const setIsMobileFilterOpen = useSetIsMobileFilterSidebarOpen();
    const [isClosing, setIsClosing] = useState(false);

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
        setIsClosing(true);
        setTimeout(() => {
            setIsMobileFilterOpen(false)
            setIsClosing(false);
        }, 350)
    }

    if (!isMobileFilterOpen && !isClosing) return null;

    return (
        <div className="filter-sidebar">
                <div className={`filter-sidebar__overlay ${isClosing ? 'filter-sidebar__overlay--closing' : ''}`} onClick={onFilterClose}>
                    <div className={`filter-sidebar__panel ${isClosing ? 'filter-sidebar__panel--closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <div className="filter-sidebar__header">
                            <button className={'back-btn'} onClick={onFilterClose}>
                                <ArrowLeftIcon />
                            </button>
                            <h3>Фильтры</h3>
                        </div>
                        <div className="filter-sidebar__content">
                            <Category />
                            <ProductFilter />
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default FilterSidebar