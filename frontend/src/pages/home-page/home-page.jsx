import React, { useState, useEffect, useContext } from 'react'
import { api } from '../../api'
import './HomePage.css'
import ProductList from '../../components/product-list/product-list'
// scss
// context и кастомный хук для проверок
// сделать компонент для загрузки

function HomePage() {
  
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
        loadProducts()
        check()
  }, []);

  const loadProducts = async () => {
    try {
      const response = await api.get('/products/')
      setProducts(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Ошибка:', error)
    }
  };

  const check = async () => {
    const response = await api.get('/orders/user-orders/');
    console.log(response.data)
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="home-page">
      <div className='content-container'>
        <div className='banner'>
          <h1>TechShop</h1>
          <h3>Магазин компютерных комплектующих</h3>
        </div>
        <span className='new-products'>Новинки</span>
        <ProductList products = {products} />
      </div>
    </div>
  )
}

export default HomePage;