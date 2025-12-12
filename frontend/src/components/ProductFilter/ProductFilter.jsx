import { useState, useEffect, useRef } from 'react';
import './ProductFilter.css';
import { api } from '../../api';
import Loading from '../UI/Loading/Loading';
import Button from '../UI/Button/Button';

function ProductFilter({ onFilterChange, onResetProductFilters, selectedCategory }) {
    const [brands, setBrands] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const minPriceRef = useRef(null);
    const maxPriceRef = useRef(null);
    const brandSelectRef = useRef(null);
    const paramSelectRef = useRef(null);
    const paramValueSelectRef = useRef(null);
    const inStockCheckboxRef = useRef(null);

    useEffect(() => {
        loadData();
    }, [selectedCategory]);

    const loadData = async () => {
        try {
            setLoading(true);
            
            const brandsResponse = await api.get('/brands/');
            setBrands(brandsResponse.data);
            
            const paramsResponse = await api.get('/parameters/');
            let filteredParams = paramsResponse.data;
            
            if (selectedCategory) {
                filteredParams = filteredParams.filter(
                    param => param.category_id === selectedCategory.id
                );
            }
            
            setParameters(filteredParams);
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleParamChange = (e) => {
        const paramId = e.target.value;
        onFilterChange('paramId', paramId);
        onFilterChange('paramValue', '');
    };

    const handleParamValueChange = (e) => {
        const value = e.target.value;
        onFilterChange('paramValue', value);
    };

    const handleReset = () => {
        if (minPriceRef.current) minPriceRef.current.value = '';
        if (maxPriceRef.current) maxPriceRef.current.value = '';
        if (brandSelectRef.current) brandSelectRef.current.value = '';
        if (paramSelectRef.current) paramSelectRef.current.value = '';
        if (paramValueSelectRef.current) paramValueSelectRef.current.value = '';
        if (inStockCheckboxRef.current) inStockCheckboxRef.current.checked = true;
        
        if (onResetProductFilters) {
            onResetProductFilters();
        }
    };

    const getParamValues = () => {
        const paramSelect = paramSelectRef.current;
        if (!paramSelect) return [];
        
        const selectedParamId = paramSelect.value;
        const parameter = parameters.find(param => param.id == selectedParamId);
        return parameter ? parameter.values : [];
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="product-filter">
            <header className="product-filter__header">
                <h3 className="product-filter__title">Фильтры</h3>
                
                <Button 
                    className="submit-btn" 
                    onClick={handleReset} 
                    text={'Сбросить фильтры'}
                />
            </header>
            
            <div className="product-filter__list">
                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Цена</h4>
                    <div className="product-filter__price-inputs">
                        <input
                            ref={minPriceRef}
                            type="number"
                            placeholder="От"
                            onChange={(e) => onFilterChange('minPrice', e.target.value)}
                            min="0"
                        />
                        <input
                            ref={maxPriceRef}
                            type="number"
                            placeholder="До"
                            onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                            min="0"
                        />
                    </div>
                </div>

                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Бренд</h4>
                    <select 
                        ref={brandSelectRef}
                        onChange={(e) => onFilterChange('brandId', e.target.value)}
                    >
                        <option value="">Все бренды</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Характеристики</h4>
                    <div className="product-filter__params">
                        <select 
                            ref={paramSelectRef}
                            onChange={handleParamChange}
                            className="product-filter__param-select"
                            disabled={!selectedCategory}
                        >
                            <option value="">
                                {selectedCategory ? "Выберите характеристику" : "Необходимо выбрать категорию"}
                            </option>
                            {parameters.map(param => (
                                <option key={param.id} value={param.id}>
                                    {param.name}
                                </option>
                            ))}
                        </select>
                        
                        {paramSelectRef.current?.value && (
                            <select 
                                ref={paramValueSelectRef}
                                onChange={handleParamValueChange}
                                className="product-filter__value-select"
                            >
                                <option value="">Выберите значение</option>
                                {getParamValues().map(value => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>

                <div className="product-filter__item">
                    <h4 className="product-filter__subtitle">Наличие</h4>
                    <label className="product-filter__checkbox">
                        <input
                            ref={inStockCheckboxRef}
                            type="checkbox"
                            defaultChecked={true}
                            onChange={(e) => onFilterChange('inStock', e.target.checked)}
                        />
                        <span>Только в наличии</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

export default ProductFilter;