import { useState, useEffect } from 'react';
import { api } from '../../api';
import OrderList from '../../components/OrderList/OrderList';
import './OrdersPage.scss';
import Loading from '../../components/UI/Loading/Loading';
import Button from '../../components/UI/Buttons/Button'

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
      setLoading(false)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    }
  }

  const switchOrders = () => {
    setIsArchive(!isArchive)
  }

if (loading) {
    return <Loading fullPage={true} />
  }
  
  return (
    <div className="orders-page">
      {!isArchive ? (
      <h1>Заказы</h1>
      ) : (
      <h1>Архив заказов</h1>
      )}

      <main className='orders-page__main-container'>
        {orders.length < 1 && (
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