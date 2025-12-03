// OrdersPage.jsx
import { useState, useEffect } from 'react';
import { api } from '../../api';
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

  if (loading) return <h1>Загрузка</h1>;

  return (
    <div className="orders-page">
      <h1>Мои заказы</h1>
      
      {orders.length === 0 ? (
        <p>У вас еще нет заказов</p>) 
        : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <h3>Заказ №{order.order_number}</h3>
            <p>Статус: <span className={`status-${order.status}`}>{order.status}</span></p>
            <p>Дата создания: {new Date(order.created_at).toLocaleDateString()}</p>
            <p>Итого: <strong>{order.price_sum} ₽</strong></p>
            
            <div className="order-items">
              <h4>Товары ({order.orderitem_set?.length || 0}):</h4>
              {order.orderitem_set?.map(item => (
                <div key={item.id} className="order-item">
                  <p>{item.product_name} - {item.quantity} шт. {item.product_price} ₽</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage