import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { AuthContext } from '../../hooks/authContext'
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import Loading from '../../components/UI/Loading/Loading'
import './CreateProductPage.css'

function CreateProductPage() {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    
    const [loading, setLoading] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [quantity, setQuantity] = useState('1')
    const [description, setDescription] = useState('')
    const [brandId, setBrandId] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [subcategoryId, setSubcategoryId] = useState('')
    const [image, setImage] = useState(null)
    
    const [brands, setBrands] = useState([])
    const [categories, setCategories] = useState([])
    const [subcategories, setSubcategories] = useState([])
    const [parameters, setParameters] = useState([])
    const [paramValues, setParamValues] = useState({})

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

    const loadSubcategoriesAndParameters = async (categoryId) => {
        try {
            const category = categories.find(cat => cat.id == categoryId)
            if (category) {
                setSubcategories(category.subcategories || [])
            }
            
            const paramsRes = await api.get('/parameters/')
            const categoryParams = paramsRes.data.filter(param => param.category_id == categoryId)
            setParameters(categoryParams)
            
            const initialValues = {}
            categoryParams.forEach(param => {
                initialValues[param.id] = ''
            })
            setParamValues(initialValues)
            
        } catch (error) {
            console.error('Ошибка загрузки подкатегорий:', error)
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!user?.user_type === 'Manager') {
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
            formData.append('price', parseFloat(price))
            formData.append('quantity', parseInt(quantity) || 1)
            formData.append('description', description)
            if (brandId) formData.append('brand', brandId)
            formData.append('category', categoryId)
            if (subcategoryId) formData.append('subcategory', subcategoryId)
            
            if (image) {
                formData.append('image', image)
            }
            
            const parametersArray = []
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

            const response = await api.post('/products/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            
            alert('Товар успешно создан!')
            navigate('/catalog')
            
        } catch (error) {
            console.error('Ошибка создания товара:', error)
            console.error('Детали ошибки:', error.response?.data)
            alert('Ошибка создания товара')
        } finally {
            setLoading(false)
        }
    }

    const handleParamChange = (paramId, value) => {
        setParamValues(prev => ({
            ...prev,
            [paramId]: value
        }))
    }

    if (loadingData) {
        return <Loading />
    }

    return (
        <div className="create-product-page">
            <button className="back-btn" onClick={() => navigate('/catalog')}>Назад</button>
            <h1>Добавить товар</h1>

            <form onSubmit={handleSubmit} className="create-product-form">
                <div className="form-group">
                    <label>Название товара *</label>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Название"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Цена (₽) *</label>
                        <Input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Цена"
                            required
                        />
                    </div>

                    <div className="form-group">
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

                <div className="form-group">
                    <label>Бренд *</label>
                    <select
                        value={brandId}
                        required
                        onChange={(e) => setBrandId(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Выберите бренд</option>
                        {brands.map(brand => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Категория *</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="form-select"
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

                    <div className="form-group">
                        <label>Подкатегория</label>
                        <select
                            value={subcategoryId}
                            onChange={(e) => setSubcategoryId(e.target.value)}
                            className="form-select"
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

                <div className="form-group">
                    <label>Изображение</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {parameters.length > 0 && (
                    <div className="form-section">
                        <h3>Характеристики</h3>
                        <div className="parameters-container">
                            {parameters.map(param => (
                                <div key={param.id} className="parameter-group">
                                    <label>{param.name}</label>
                                    <select
                                        value={paramValues[param.id] || ''}
                                        onChange={(e) => handleParamChange(param.id, e.target.value)}
                                        className="form-select"
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

                <div className="form-group">
                    <label>Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="description-input"
                        placeholder="Описание товара"
                        rows="4"
                    />
                </div>

                <div className="form-buttons">
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