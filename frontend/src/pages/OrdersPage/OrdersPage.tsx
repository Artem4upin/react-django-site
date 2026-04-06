import { useState, useEffect } from 'react';
import { api } from '../../api';
import OrderList from '../../components/OrderList/OrderList';
import './OrdersPage.scss';
import Loading from '../../components/UI/Loading/Loading';
import Button from '../../components/UI/Buttons/Button'
import ModalOrderItems from "../../components/modal/ModalOrderItems/ModalOrderItems";
import {IOrder} from "../../types/order";

function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isArchive, setIsArchive] = useState<boolean>(false)
  const [isModalOrderItemsOpen, setIsModalOrderItemsOpen] = useState<boolean>(false)
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const response = await api.get('/orders/user-orders/')
      setOrders(response.data)
      setLoading(false)
      console.log(response.data)
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error)
    }
  }

  const switchOrders = () => {
    setIsArchive(!isArchive)
  }

  const handleOrderClick = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOrderItemsOpen(true)
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
        {orders.length === 0 && (
            <h2 className='orders-page__not-found'>
              {!isArchive ? 'Нет активных заказов' : 'Нет завершенных заказов'}
            </h2>
        )}
        <OrderList 
        orders={orders} 
        isArchive={isArchive}
        onOrderClick={handleOrderClick}
        />

        <div className='orders-page__buttons'>
          <Button 
          text={(!isArchive ? ('В архив заказов') : ('В заказы'))}
          onClick={switchOrders}
          className={'submit-btn'}
          />
        </div>
      </main>
      <ModalOrderItems
          order={selectedOrder}
          isOpen={isModalOrderItemsOpen}
          setIsOpen={setIsModalOrderItemsOpen} />
    </div>
  );
}

export default OrdersPage