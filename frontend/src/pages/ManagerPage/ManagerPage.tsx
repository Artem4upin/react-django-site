import React, { useState, useEffect } from 'react';
import { api } from '../../api'
import './ManagerPage.scss'
import Loading from '../../components/UI/Loading/Loading';
import ModalConfirm from '../../components/modal/ModalConfirm/ModalConfirm';
import Input from '../../components/UI/Inputs/Input';
import Button from '../../components/UI/Buttons/Button';
import {IOrder, TStatusOrder} from "../../types/order";
import {
  useEndDate,
  useOrderNumber,
  useResetManagerPageFilter, useSetEndDate, useSetOrderNumber, useSetStartDate,
  useStartDate
} from "../../store/useManagerPageFilterStore";

interface IPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ILoadOrdersParams {
  start_date: string;
  end_date: string;
  order_number?: string;
}

function ManagerPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [showModalChangeStatus, setShowModalChangeStatus] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [selectedNewStatus, setSelectedNewStatus] = useState<TStatusOrder | ''>('')

  const startDate = useStartDate();
  const endDate = useEndDate();
  const orderNumber = useOrderNumber();
  const setStartDate = useSetStartDate();
  const setEndDate = useSetEndDate();
  const setOrderNumber = useSetOrderNumber();

  const resetManagerPageFilter = useResetManagerPageFilter()

  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);

  useEffect(() => {
    loadFilteredOrders()
  }, [])

  const loadFilteredOrders = async (url: string | null = null) => {
    setLoading(true)
    try {
      let response;
      if (url) {
        response = await api.get<IPaginatedResponse<IOrder>>(url);
      } else {
        const params: ILoadOrdersParams = {
          start_date: startDate,
          end_date: endDate,
        }
        if (orderNumber) {
          params.order_number = orderNumber
        }
        response = await api.get<IPaginatedResponse<IOrder>>('/orders/manager-orders/', { params })
      }

      setOrders(response.data.results);
      setNextPageUrl(response.data.next);
      setPrevPageUrl(response.data.previous);
      setTotalOrdersCount(response.data.count);
    } catch (error: any) {
      console.error('Ошибка загрузки заказов:', error)
      alert('Ошибка загрузки заказов: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    loadFilteredOrders()
  }

  const resetFilter = () => {
    resetManagerPageFilter()
    loadFilteredOrders()
  }

  const handleStatusChangeClick = (orderId: number, newStatus: TStatusOrder) => {
    setSelectedOrderId(orderId)
    setSelectedNewStatus(newStatus)
    setShowModalChangeStatus(true)
  }

  const changeOrderStatus = async () => {
    try {
      await api.patch(`/orders/manager-orders/${selectedOrderId}/`, {
        status: selectedNewStatus
      })
      loadFilteredOrders()
      setShowModalChangeStatus(false)
    } catch (error: any) {
      alert('Ошибка обновления статуса: ' + (error.response?.data?.error || error.message))
      setShowModalChangeStatus(false)
    }
  }

  const cancelChangeStatus = () => {
    setShowModalChangeStatus(false)
  }

  if (loading) {
    return <Loading fullPage={true} />
  }

  return (
      <main className="manager-page">
        <h1>Управление заказами</h1>

        <div className="manager-page__sum-container">
          <div className="manager-page__sum-container__order-sum">
            <h3>Всего заказов: {totalOrdersCount}</h3>
          </div>
        </div>

        <div className='manager-page__filter-container'>
          <div className="manager-page__filter-container__main-row">

            <div className="manager-page__filter-container__filter-block">
              <h4>Фильтр за период</h4>
              <div className="manager-page__filter-container__filter-block__inputs">
                <div className="manager-page__filter-container__filter-block__inputs__input-group">
                  <p>От</p>
                  <Input
                      type='date'
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="manager-page__filter-container__filter-block__inputs__input-group">
                  <p>До</p>
                  <Input
                      type='date'
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="manager-page__filter-container__filter-block">
              <p className="manager-page__filter-container__filter-block__label-text">Номер заказа</p>
              <Input
                  type='text'
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Поиск по номеру заказа"
              />
            </div>
          </div>

          <div className='manager-page__filter-container__buttons'>
            <Button text={'Применить'} className={'btn'} onClick={applyFilter} />
            <Button text={'Сбросить'} className={'btn'} onClick={resetFilter} />
          </div>
        </div>

        {orders.length === 0 ? (
            <p className="manager-page__no-orders">Заказы не найдены</p>
        ) : (
            <>
              <div className="manager-page__orders">
                {orders.map((order: IOrder) => (
                    <div key={order.id} className="manager-page__orders__card">
                      <header className="manager-page__orders__card__header">
                        <div>
                          <h3>Заказ № {order.order_number}</h3>
                          <p>{order.username}</p>
                        </div>
                        <span>{new Date(order.created_at).toLocaleDateString('ru')}</span>
                      </header>
                      <div className="manager-page__orders__card__info">
                        <div>
                          <span>Статус: </span>
                          <select
                              value={order.status}
                              onChange={(e) => handleStatusChangeClick(order.id, e.target.value as TStatusOrder)}
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
                          <p>{Number(order.price_sum).toFixed(2)} ₽</p>
                        </div>
                        <div>
                          <span>Товаров: </span>
                          <span>{order.order_items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0} шт.</span>
                        </div>
                        <div>
                          <span>Адрес: </span>
                          <span>{order.delivery_address}</span>
                        </div>
                      </div>
                      {order.order_items && order.order_items.length > 0 && (
                          <div className="manager-page__orders__card__items">
                            <h4>Товары:</h4>
                            <ul>
                              {order.order_items.map(item => (
                                  <li key={item.id}>
                                    <span>{item.product_name}</span>
                                    <span>{item.quantity} шт.</span>
                                    <span>{Number(item.product_price).toFixed(2)} ₽</span>
                                  </li>
                              ))}
                            </ul>
                          </div>
                      )}
                    </div>
                ))}
              </div>

              {(nextPageUrl || prevPageUrl) && (
                  <div className="manager-page__pagination-buttons">
                    <Button
                        text="<"
                        onClick={() => loadFilteredOrders(prevPageUrl)}
                        disabled={!prevPageUrl}
                        className="btn"
                    />
                    <Button
                        text=">"
                        onClick={() => loadFilteredOrders(nextPageUrl)}
                        disabled={!nextPageUrl}
                        className="btn"
                    />
                  </div>
              )}
            </>
        )}
        <ModalConfirm
            showModal={showModalChangeStatus}
            setShowModal={setShowModalChangeStatus}
            onConfirm={changeOrderStatus}
            onCancel={cancelChangeStatus}
            newStatus={selectedNewStatus}
        />
      </main>
  )
}

export default ManagerPage