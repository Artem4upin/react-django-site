import React, {useState, useEffect, useContext, ChangeEvent} from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { AuthContext } from '../../hooks/AuthContext'
import Button from '../../components/UI/Buttons/Button'
import Input from '../../components/UI/Inputs/Input'
import Loading from '../../components/UI/Loading/Loading'
import './CreateProductPage.scss'
import {IBrand, ICategory, IParameter, ISubcategory} from "../../types/product";

function CreateProductPage() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [description, setDescription] = useState('')
    const [brandId, setBrandId] = useState<string>('')
    const [categoryId, setCategoryId] = useState<string>('')
    const [subcategoryId, setSubcategoryId] = useState<string>('')
    const [image, setImage] = useState<File | null>(null)
    
    const [brands, setBrands] = useState<IBrand[]>([])
    const [categories, setCategories] = useState<ICategory[]>([])
    const [subcategories, setSubcategories] = useState<ISubcategory[]>([])
    const [parameters, setParameters] = useState<IParameter[]>([])
    const [paramValues, setParamValues] = useState<Record<number, string>>({})

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (categoryId) {
            loadSubcategoriesAndParameters(categoryId)
        } else {
            setSubcategories([])
            setParameters([])
            setParamValues({})
        }
        setSubcategoryId('')
    }, [categoryId])

    const loadData = async () => {
        try {
            const [brandsRes, categoriesRes] = await Promise.all([
                api.get('/brands/'),
                api.get('/categories/')
            ])
            
            setBrands(brandsRes.data)
            setCategories(categoriesRes.data)
            setLoadingData(false)
        } catch (error) {
            console.error('Ошибка загрузки данных:', error)
            setLoadingData(false)
        }
    }

    const loadSubcategoriesAndParameters = async (categoryId: string) => {
        try {
            const category = categories.find(cat => cat.id == Number(categoryId))
            if (category) {
                setSubcategories(category.subcategories || [])
            }
            
            const paramsRes = await api.get<IParameter[]>('/parameters/')
            const categoryParams = paramsRes.data.filter(param => param.category_id == Number(categoryId))
            setParameters(categoryParams)
            
            const initialValues: Record<number, string> = {}
            categoryParams.forEach(param => {
                initialValues[param.id] = ''
            })
            setParamValues(initialValues)
            
        } catch (error) {
            console.error('Ошибка загрузки подкатегорий:', error)
        }
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (user?.user_type !== 'Manager') {
            alert('Только менеджер может создавать товары')
            return
        }

        if (!name || !price || !categoryId) {
            alert('Заполните обязательные поля: название, цена, категория')
            return
        }

        setLoading(true)
        try {
            const formData = new FormData()
            
            formData.append('name', name)
            formData.append('price', price)
            formData.append('quantity', quantity || "1")
            formData.append('description', description)
            if (brandId) formData.append('brand', brandId)
            formData.append('category', categoryId)
            if (subcategoryId) formData.append('subcategory', subcategoryId)
            
            if (image) {
                formData.append('image', image)
            }
            
            const parametersArray: {parameter: number, value: string}[] = []
            Object.entries(paramValues).forEach(([paramId, value]) => {
                if (value && value.trim()) {
                    parametersArray.push({
                        parameter: parseInt(paramId),
                        value: value.trim()
                    })
                }
            })
            
            if (parametersArray.length > 0) {
                formData.append('parameters', JSON.stringify(parametersArray))
            }

            await api.post('/products/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            alert('Товар успешно создан!')
            navigate('/catalog')
            
        } catch (error: any) {
            console.error('Ошибка создания товара:', error)
            console.error('Детали ошибки:', error.response?.data)
            alert('Ошибка создания товара')
        } finally {
            setLoading(false)
        }
    }

    const handleParamChange = (paramId: number, value: string) => {
        setParamValues(prev => ({
            ...prev,
            [paramId]: value
        }))
    }

    if (loadingData) {
        return <Loading fullPage={true} />
    }

    return (
        <div className="create-product-page">
            <button className="back-btn" onClick={() => navigate('/catalog')}>Назад</button>
            <h1>Добавить товар</h1>

            <form onSubmit={handleSubmit} className="create-product-page__create-product-form">
                <div className="create-product-page__form-group">
                    <label>Название товара *</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название"
                        required
                    />
                </div>

                <div className="create-product-page__form-row">
                    <div className="create-product-page__form-group">
                        <label>Цена (₽) *</label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Цена"
                            required
                        />
                    </div>

                    <div className="create-product-page__form-group">
                        <label>Количество</label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Количество"
                            min="0"
                        />
                    </div>
                </div>

                <div className="create-product-page__form-group">
                    <label>Бренд *</label>
                    <select
                        value={brandId}
                        required
                        onChange={(e) => setBrandId(e.target.value)}
                        className="create-product-page__form-select"
                    >
                        <option value="">Выберите бренд</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="create-product-page__form-row">
                    <div className="create-product-page__form-group">
                        <label>Категория *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="create-product-page__form-select"
                            required
                        >
                            <option value="">Выберите категорию</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="create-product-page__form-group">
                        <label>Подкатегория</label>
                        <select
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            className="create-product-page__form-select"
                            disabled={!categoryId || subcategories.length === 0}
                        >
                            <option value="">Выберите подкатегорию</option>
                            {subcategories.map(sub => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="create-product-page__form-group">
                    <label>Изображение</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {parameters.length > 0 && (
                    <div className="create-product-page__form-section">
                        <h3>Характеристики</h3>
                        <div className="create-product-page__parameters-container">
                            {parameters.map(param => (
                                <div key={param.id} className="create-product-page__parameter-group">
                                    <label>{param.name}</label>
                                    <select
                                        value={paramValues[param.id] || ''}
                                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                                        className="create-product-page__form-select"
                                    >
                                        <option value="">Выберите значение</option>
                                        {param.values?.map(value => (
                                            <option key={value} value={value}>
                                                {value}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="create-product-page__form-group">
                    <label>Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="create-product-page__description-input"
                        placeholder="Описание товара"
                        rows={4}
                    />
                </div>

                <div className="create-product-page__form-buttons">
                    <Button
                        type="submit"
                        text={loading ? "Создание..." : "Создать товар"}
                        className="submit-btn"
                        disabled={loading}
                    />
                    <Button
                        text="Отмена"
                        className="exit-btn"
                        onClick={() => navigate('/catalog')}
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    )
}

export default CreateProductPage