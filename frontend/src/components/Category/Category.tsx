import { useState } from 'react';
import './Category.scss';
import Button from '../UI/Buttons/Button';
import {ICategory, ISubcategory} from "../../types/product";

interface ICategoryProps {
    onFilterChange: (category: ICategory | null, subcategory: ISubcategory | null) => void;
    categories: ICategory[];
}

function Category({
        onFilterChange,
        categories
}:ICategoryProps) {

    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null);

    const handleCategoryClick = (category: ICategory) => {
        if (selectedCategory?.id === category.id) {
            resetFilters()
        } else {
            setSelectedCategory(category)
            setSelectedSubcategory(null)
            onFilterChange(category, null)
        }
    };

    const handleSubcategoryClick = (subcategory: ISubcategory) => {
        if (selectedSubcategory?.id === subcategory.id) {
            setSelectedSubcategory(null)
            onFilterChange(selectedCategory, null)
        } else {
            setSelectedSubcategory(subcategory)
            onFilterChange(selectedCategory, subcategory)
        }
    };

    const resetFilters = () => {
        setSelectedCategory(null)
        setSelectedSubcategory(null)
        onFilterChange(null, null)
    };

    return (
        <div className="category">
            <header className="category__header">
                <h3 className="category__title">Категории</h3>
                {(selectedCategory || selectedSubcategory) && (
                    <Button className="submit-btn" onClick={resetFilters} text={'Сбросить'}></Button>
                )}
            </header>
            
            <div className="category__list">
                {categories.map(category => (
                    <div key={category.id} className="category__item">
                        <div 
                            className={`category__category`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category.name}
                        </div>
                        
                        {selectedCategory?.id === category.id && (
                            <div className="category__subcategories">
                                {category.subcategories?.map(subcategory => (
                                    <div 
                                        key={subcategory.id}
                                        className={`category__subcategories__subcategory`}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                    >
                                        {subcategory.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Category