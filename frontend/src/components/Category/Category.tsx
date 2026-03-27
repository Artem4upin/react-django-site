import { useState } from 'react';
import './Category.scss';
import { ICategory, ISubcategory } from "../../types/product";
import Button from "../UI/Buttons/Button";
import {useCategories, useHandleCategoryFilterChange} from "../../store/useCatalogStore";
import ArrowOpenIcon from "../icons/ArrowOpenIcon";
import ArrowClosedIcon from "../icons/ArrowClosedIcon";

function Category() {
    const onFilterChange = useHandleCategoryFilterChange();
    const categories = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<ISubcategory | null>(null);
    const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

    const groups: { [key: string]: { id: number; name: string; categories: ICategory[] } } = {}
    categories.forEach(category => {
        const group = category.category_group;
        const groupId = group ? group.id : 3;
        const groupName = group ? group.name : 'Другое';
        if (!groups[groupId]) {
            groups[groupId] = { id: groupId, name: groupName, categories: [] }
        }
        groups[groupId].categories.push(category);
    })
    const groupsArray = Object.values(groups)
        .sort((prevGroup, nextGroup) => prevGroup.id - nextGroup.id)

    const handleGroupClick = (groupId: number) => {
        if (selectedGroups.includes(groupId)) {
            setSelectedGroups(selectedGroups.filter(id => id !== groupId));
        } else {
            setSelectedGroups([...selectedGroups, groupId]);
        }
    }

    const handleCategoryClick = (category: ICategory) => {
        if (selectedCategory?.id === category.id) {
            resetFilters();
        } else {
            setSelectedCategory(category);
            setSelectedSubcategory(null);
            onFilterChange(category, null);
        }
    }

    const handleSubcategoryClick = (subcategory: ISubcategory) => {
        if (selectedSubcategory?.id === subcategory.id) {
            setSelectedSubcategory(null);
            onFilterChange(selectedCategory, null);
        } else {
            setSelectedSubcategory(subcategory);
            onFilterChange(selectedCategory, subcategory);
        }
    };

    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedSubcategory(null);
        onFilterChange(null, null);
    }
    const resetFiltersAndGroups = () => {
        setSelectedGroups([]);
        resetFilters();
    }

    return (
        <div className="category">
            <header className="category__header">
                <h3 className="category__title">Категории</h3>
                {selectedCategory && (
                <Button className="submit-btn" text={'Сбросить'} onClick={resetFiltersAndGroups}/>
                )}
            </header>

            <div className="category__list">
                {groupsArray.map(group => (
                    <div key={group.id} className="category__group">
                        <div
                            className="category__group-item"
                            onClick={() => handleGroupClick(group.id)}
                        >
                            <span className="category__group-name">{group.name}</span>
                            {selectedGroups.includes(group.id) ? (
                                <ArrowOpenIcon />
                            ):
                                <ArrowClosedIcon />
                            }

                        </div>
                        {selectedGroups.includes(group.id) && (
                            <div className="category__group-content">
                                {group.categories.map(category => (
                                    <div key={category.id} className="category__item">
                                        <div
                                            className={`category__category ${
                                                selectedCategory?.id === category.id ? 'selected' : ''
                                            }`}
                                            onClick={() => handleCategoryClick(category)}
                                        >
                                            {category.name}
                                        </div>
                                        {selectedCategory?.id === category.id && (
                                            <div className="category__subcategories">
                                                {category.subcategories?.map(subcategory => (
                                                    <div
                                                        key={subcategory.id}
                                                        className={`category__subcategories__subcategory ${
                                                            selectedSubcategory?.id === subcategory.id ? 'selected' : ''
                                                        }`}
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Category