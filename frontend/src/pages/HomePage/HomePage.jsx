import React, { useState, useEffect, useContext } from 'react'
import { api } from '../../api'
import './HomePage.css'
import ProductList from '../../components/ProductList/ProductList'
import Loading from '../../components/UI/Loading/Loading'
import Button from '../../components/UI/Button/Button'
import { Link } from 'react-router-dom'
// scss
// context и кастомный хук для проверок

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
      setLoading(false)
    } catch (error) {
      console.error('Ошибка:', error)
    }
  };

  if (loading) {
    return <Loading />
  }

  return (
    <div className="home-page">
      <div className='home-page__content'>
        <div className='home-page__shop-banner'>
          <h1>TechShop</h1>
          <h3>Магазин компютерных комплектующих</h3>
        </div>
         <Link to='/catalog' className="home-page__catalog-banner" >
            <label className="catalog-banner__label">В каталог</label>
        </Link>
          <div className='home-page__new-products'>
            <label className='new-products__label'>Новинки</label>
            <ProductList products = {products} isCart={false} />
        </div>
      </div>
    </div>
  )
}

export default HomePage;