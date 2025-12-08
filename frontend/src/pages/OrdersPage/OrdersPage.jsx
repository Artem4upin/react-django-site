import { useState, useEffect } from 'react';
import { api } from '../../api';
import OrderList from '../../components/OrderList/OrderList';
import './OrdersPage.css';

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
    return <div className="loading">Загрузка</div>;
  }
  
  return (
    <div className="orders-page">
      <OrderList orders={orders} />
    </div>
  );
}

export default OrdersPage