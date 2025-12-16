import React, { useState, useEffect } from 'react';
import { api } from '../../api'
import './ManagerPage.css'
import Loading from '../../components/UI/Loading/Loading';
import ModalConfirm from '../../components/modal/ModalConfirm/ModalConfirm';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';

function ManagerPage() {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState('')

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFiltered, setIsFiltered] = useState(false)

  useEffect(() => {
    loadAllOrders()
  }, [])

  const loadAllOrders = async () => {
    try {
      const response = await api.get('/orders/manager-orders/')
      const ordersData = response.data
      setOrders(ordersData)
      setFilteredOrders(ordersData)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(orders)
      setIsFiltered(false)
      return
    }

    const filtered = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      
      let isStartDate = true
      let isEndDate = true
      
      if (startDate) {
        const start = new Date(startDate)
        isStartDate = orderDate >= start
      }
      
      if (endDate) {
        const end = new Date(endDate)
        isEndDate = orderDate <= end
      }
      
      return isStartDate && isEndDate
    })

    setFilteredOrders(filtered)
    setIsFiltered(true)
  }

  const resetFilter = () => {
    setStartDate('')
    setEndDate('')
    setFilteredOrders(orders)
    setIsFiltered(false)
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
      const updatedOrders = orders.map(order => 
        order.id === selectedOrderId ? { ...order, status: selectedNewStatus } : order
      )
      
      const updatedFilteredOrders = filteredOrders.map(order => 
        order.id === selectedOrderId ? { ...order, status: selectedNewStatus } : order
      )
      
      setOrders(updatedOrders)
      setFilteredOrders(updatedFilteredOrders)
      
      setShowModal(false)
    } catch (error) {
      alert('Ошибка обновления статуса')
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
      <h1>Панель управления</h1>
      
      <div className="manager-page__order-sum-container">
        <div className="manager-page__order-sum">
          <h3>Количество заказов</h3>
          <p>{isFiltered ? filteredOrders.length : orders.length}</p>
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
        
        <div className='filter-container__buttons'>
          <Button 
            text={'Применить'}
            className={'submit-btn'}
            onClick={applyFilter}
          />

          <Button 
            text={'Отмена'}
            className={'btn'}
            onClick={resetFilter}
            disabled={!isFiltered && !startDate && !endDate}
          />
        </div>
      </div>

        {filteredOrders.length === 0 ? (
        <p className="manager-page__no-orders">Заказы не найдены</p>
      ) : (
        <div className="orders">
          {filteredOrders.map(order => (
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
      />
    </main>
  )
}

export default ManagerPage