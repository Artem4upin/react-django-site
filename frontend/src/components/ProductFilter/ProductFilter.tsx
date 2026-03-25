import { useState, useRef, ChangeEvent} from 'react';
import './ProductFilter.scss';

import Button from '../UI/Buttons/Button';
import {IBrand, ICategory, IParameter} from "../../types/product";

interface ProductFilterProps {
    onFilterChange: (key: string, value: string | number | boolean) => void;
    selectedCategory: ICategory | null;
    parameters: IParameter[];
    brands: IBrand[];
    hasAnyFilters: boolean;
    onResetAll: () => void;
    onApply: () => void;
    handleLocalFilterReset: () => void;
}

function ProductFilter({
        onFilterChange,
        selectedCategory,
        parameters,
        brands,
        hasAnyFilters,
        onResetAll,
        onApply,
        handleLocalFilterReset
    }: ProductFilterProps) {

    const [selectedParamId, setSelectedParamId] = useState<string>('');

    const minPriceRef = useRef<HTMLInputElement>(null);
    const maxPriceRef = useRef<HTMLInputElement>(null);
    const brandSelectRef = useRef<HTMLSelectElement>(null);
    const inStockCheckboxRef = useRef<HTMLInputElement>(null);

    const handleParamChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedParamId(id);
        onFilterChange('paramId', id);
        onFilterChange('paramValue', '');
    }

    const handleReset = () => {
        if (minPriceRef.current) minPriceRef.current.value = '';
        if (maxPriceRef.current) maxPriceRef.current.value = '';
        if (brandSelectRef.current) brandSelectRef.current.value = '';
        if (inStockCheckboxRef.current) inStockCheckboxRef.current.checked = true;
        setSelectedParamId('')
        handleLocalFilterReset()
    };

    const getParamValues = (): string[] => {
        if (!selectedParamId) return [];
        const parameter = parameters.find(p => String(p.id) === selectedParamId);
        return parameter ? parameter.values : [];
    }

    return (
        <div className="product-filter">
            <header className="product-filter__header">
                <h3 className="product-filter__title">Фильтры</h3>
                { hasAnyFilters && (
                <Button className="submit-btn" onClick={handleReset} text={'Сбросить значения'} />
                )}
            </header>

            <div className="product-filter__list">
                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Цена</h4>
                    <div className="product-filter__price-inputs">
                        <input ref={minPriceRef} type="number" placeholder="От" onChange={(e) => onFilterChange('minPrice', e.target.value)} />
                        <input ref={maxPriceRef} type="number" placeholder="До" onChange={(e) => onFilterChange('maxPrice', e.target.value)} />
                    </div>
                </div>

                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Бренд</h4>
                    <select ref={brandSelectRef} onChange={(e) => onFilterChange('brandId', e.target.value)}>
                        <option key="brand-default" value="">Все бренды</option>
                        {brands.map(brand => (
                            <option key={`brand-${brand.id}`} value={brand.id}>{brand.name}</option>
                        ))}
                    </select>
                </div>

                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Характеристики</h4>
                    <div className="product-filter__params">
                        <select
                            value={selectedParamId}
                            onChange={handleParamChange}
                            disabled={!selectedCategory}
                        >
                            <option key="param-default" value="">
                                {selectedCategory ? "Выберите характеристику" : "Выберите категорию"}
                            </option>
                            {parameters
                                .filter(param => !selectedCategory || param.category_id === selectedCategory.id)
                                .map(param => (
                                <option key={`param-${param.id}`} value={param.id}>
                                    {param.name}
                                </option>
                            ))}
                        </select>

                        {selectedParamId && (
                            <select
                                className="product-filter__value-select"
                                onChange={(e) => onFilterChange('paramValue', e.target.value)}
                            >
                                <option key="val-default" value="">Выберите значение</option>
                                {getParamValues().map((val, idx) => (
                                    <option key={`val-${selectedParamId}-${idx}`} value={val}>
                                        {val}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="product-filter__item">
                    <label className="product-filter__checkbox">
                        <input ref={inStockCheckboxRef} type="checkbox" defaultChecked onChange={(e) => onFilterChange('inStock', e.target.checked)} />
                        <span>Только в наличии</span>
                    </label>
                </div>
            </div>
            <div className="product-filter__footer">
                <Button text="Сбросить все" className="submit-btn" onClick={onResetAll} />
                <Button text="Применить" className="submit-btn" onClick={onApply} />
            </div>
        </div>
    )
}

export default ProductFilter