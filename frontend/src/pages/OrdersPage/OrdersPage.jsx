import { useState, useEffect } from 'react';
import { api } from '../../api';
import OrderList from '../../components/OrderList/OrderList';
import './OrdersPage.css';
import Loading from '../../components/UI/Loading/Loading';
import Button from '../../components/UI/button/button'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isArchive, setIsArchive] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/user-orders/')
      setOrders(response.data)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    } finally {
      setLoading(false)
    }
  }

  const switchOrders = () => {
    setIsArchive(!isArchive)
  }

if (loading) {
    return <Loading />
  }
  
  return (
    <div className="orders-page">
      {!isArchive ? (
      <h1>Заказы</h1>
      ) : (
      <h1>Архив заказов</h1>
      )}

      <main className='orders-page__main-container'>
        {!orders && (
          <h2 className='order-page__not-found'>Нет заказов</h2>
        )}
        <OrderList 
        orders={orders} 
        isArchive={isArchive} 
        />

        <div className='orders-page__buttons'>
          <Button 
          text={(!isArchive ? ('В архив заказов') : ('В заказы'))}
          onClick={switchOrders}
          className={'submit-btn'}
          />
        </div>
      </main>
    </div>
  );
}

export default OrdersPage