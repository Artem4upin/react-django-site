import React, { useState, useEffect, useContext } from 'react'
import { api } from '../../api'
import ProductCard from '../../components/UI/ProductCard'
import './HomePage.css'
// scss
// context и кастомный хук для проверок
// сделать компонент для загрузки

function HomePage() {
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
        loadProducts()
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/')
      setProducts(response.data)
      console.log(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка:', error)
    }
  };

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="HomePage">
      <div className='content-container'>
        <div className='banner'>
          <h1>TechShop</h1>
          <h3>Магазин компютерных комплектующих</h3>
        </div>
        <span className='new-products'>Новинки</span>
        <ProductCard products = {products} />
      </div>
    </div>
  )
}

export default HomePage;