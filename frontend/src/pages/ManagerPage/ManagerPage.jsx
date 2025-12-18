import React, { useState, useEffect } from 'react';
import { api } from '../../api'
import './ManagerPage.css'
import Loading from '../../components/UI/Loading/Loading';
import ModalConfirm from '../../components/modal/ModalConfirm/ModalConfirm';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

function ManagerPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [orderNumberFilter, setOrderNumberFilter] = useState('')

  useEffect(() => {
    fetchFilteredOrders()
  }, [])

  const fetchFilteredOrders = async () => {
    setLoading(true)
    try {
      const params = {
        start_date: startDate,
        end_date: endDate,
      }
      
      if (orderNumberFilter) {
        params.order_number = orderNumberFilter
      }
      
      const response = await api.get('/orders/manager-orders/', { params })
      setOrders(response.data)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
      alert('Ошибка загрузки заказов: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    fetchFilteredOrders()
  }

  const resetToToday = () => {
    setStartDate(today)
    setEndDate(today)
    setOrderNumberFilter('')
    fetchFilteredOrders()
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
      
      fetchFilteredOrders()
      
      setShowModal(false)
    } catch (error) {
      alert('Ошибка обновления статуса: ' + (error.response?.data?.error || error.message))
      setShowModal(false)
    }
  }

  const cancelStatusChange = () => {
    setShowModal(false)
  }

  if (loading) {
    return <Loading />
  }

  return (
    <main className="manager-page">
      <h1>Панель управления заказами</h1>
      
      <div className="manager-page__order-sum-container">
        <div className="manager-page__order-sum">
          <h3>Количество заказов</h3>
          <p>{orders.length}</p>
        </div>
      </div>
      
      <div className='manager-page__filter-container'>
        <h4>Фильтр за период</h4>

        <p>От</p>
        <Input 
          type='date'
          className='input'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        
        <p>До</p>
        <Input
          type='date'
          className='input'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        
        <p>Номер заказа</p>
        <Input
          type='text'
          className='input'
          value={orderNumberFilter}
          onChange={(e) => setOrderNumberFilter(e.target.value)}
          placeholder="Поиск по номеру заказа"
        />
        
        <div className='filter-container__buttons'>
          <Button 
            text={'Применить'}
            className={'btn'}
            onClick={applyFilter}
          />
          
          <Button 
            text={'Заказы за сегодня'}
            className={'btn'}
            onClick={resetToToday}
          />
        </div>
      </div>
      
      {orders.length === 0 ? (
        <p className="manager-page__no-orders">Заказы не найдены</p>
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
                  <p>{parseFloat(order.price_sum).toFixed(2)} ₽</p>
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
        newStatus={selectedNewStatus}
      />
    </main>
  )
}

export default ManagerPage