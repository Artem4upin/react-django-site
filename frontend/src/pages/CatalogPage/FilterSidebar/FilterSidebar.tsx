import React, {useEffect} from 'react';
import Category from "../../../components/Category/Category";
import ProductFilter from "../../../components/ProductFilter/ProductFilter";
import Button from "../../../components/UI/Buttons/Button";
import './FilterSidebar.scss'
import {useIsMobileFilterOpen, useSetIsMobileFilterOpen} from "../../../store/useCatalogStore";

function FilterSidebar() {
    const isMobileFilterOpen = useIsMobileFilterOpen();
    const setIsMobileFilterOpen = useSetIsMobileFilterOpen();
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
                            <Category />
                            <ProductFilter />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FilterSidebar