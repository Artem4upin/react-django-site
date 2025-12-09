import React, { useState, useEffect } from 'react';
import { api } from '../../api'
import './ManagerPage.css'
import Loading from '../../components/UI/Loading/Loading';
import ModalConfirm from '../../components/modal/ModalConfirm/ModalConfirm';

function ManagerPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState('')

  useEffect(() => {
    loadAllOrders()
  }, [])

  const loadAllOrders = async () => {
    try {
      const response = await api.get('/orders/manager-orders/')
      setOrders(response.data)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/manager-orders/${orderId}/`, {
        status: newStatus
      })
      alert('Статус заказа изменен')
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      alert('Ошибка при обновлении статуса')
    }
  }

  const handleStatusChangeClick = (orderId, newStatus) => {
    setSelectedOrderId(orderId)
    setSelectedNewStatus(newStatus)
    setShowModal(true)
}

const confirmStatusChange = async () => {
  try {
    await api.patch(`/orders/manager-orders/${selectedOrderId}/`, {
      status: selectedNewStatus
    })
    setOrders(orders.map(order => 
      order.id === selectedOrderId ? { ...order, status: selectedNewStatus } : order
    ))
  } catch (error) {
    alert('Ошибка обновления статуса')
  }
}

  const cancelStatusChange = () => {

  }

  if (loading) {
    return <Loading />
  }

  return (

    <main className="manager-page">
      <h1>Панель управления</h1>
      
      <div className="manager-page__order-sum-container">
        <div className="manager-page__order-sum">
          <h3>Всего заказов</h3>
          <p>{orders.length}</p>
        </div>
      </div>

      {orders.length == 0 ? (
        <p className="no-orders">Заказов нет</p>
      ) : (
        <div className="orders">
          {orders.map(order => (
            <div key={order.id} className="orders__card">
              <header className="order__header">
                <div>
                  <h3>Заказ № {order.order_number}</h3>
                  <p>{order.username}</p>
                </div>
                <span>{new Date(order.created_at).toLocaleDateString('ru')}</span>
              </header>
              
              <div className="order__info">
                <div>
                  <span>Статус: </span>
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChangeClick(order.id, e.target.value)}
                  >
                    <option value="Created">Создан</option>
                    <option value="Work">В работе</option>
                    <option value="Sent">Отправлен</option>
                    <option value="Done">Готов к выдаче</option>
                    <option value="Completed">Завершен</option>
                    <option value="Canceled">Отменен</option>
                  </select>
                </div>
                
                <div>
                  <span>Сумма: </span>
                  <strong>{parseFloat(order.price_sum).toFixed(2)} ₽</strong>
                </div>
                
                <div>
                  <span>Товаров: </span>
                  <span>{order.orderitem_set?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} шт.</span>
                </div>
                
                <div>
                  <span>Адрес: </span>
                  <span>{order.delivery_address}</span>
                </div>
              </div>
              
              {order.orderitem_set && order.orderitem_set.length > 0 && (
                <div className="order__items">
                  <h4>Товары:</h4>
                  <ul>
                    {order.orderitem_set.map(item => (
                      <li key={item.id}>
                        <span>{item.product_name}</span>
                        <span>{item.quantity} шт.</span>
                        <span>{parseFloat(item.product_price).toFixed(2)} ₽</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ModalConfirm 
        showModal={showModal}
        setShowModal={setShowModal}
        onConfirm={confirmStatusChange}
        onCancel={cancelStatusChange}
      />
    </main>
  )
}

export default ManagerPage