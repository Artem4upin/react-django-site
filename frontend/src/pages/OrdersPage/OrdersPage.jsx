import { useState, useEffect } from 'react';
import { api } from '../../api';
import OrderList from '../../components/OrderList/OrderList';
import './OrdersPage.css';
import Loading from '../../components/UI/Loading/Loading';
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/button/button'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

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
  };

if (loading) {
    return <Loading />
  }
  
  return (
    <div className="orders-page">
      <h1>Заказы</h1>
      {!orders && (
        <h2 className='order-page__not-found'>Нет заказов</h2>
      )}
      <OrderList orders={orders} />
    </div>
  );
}

export default OrdersPage