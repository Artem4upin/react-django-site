import React from 'react';
import './OrderCard.scss';
import {IOrder} from "../../types/order";

interface IOrderCardProps {
    order: IOrder;
}

function OrderCard({ order }:IOrderCardProps) {

    const statusTranslations = {
        'Created': 'Создан',
        'Work': 'В работе', 
        'Sent': 'Отправлен',
        'Done': 'Готов к выдаче',
        'Completed': 'Завершен',
        'Canceled': 'Отменен'
    }
    return (
        <div className="order-card">
            <h3>Заказ №{order.order_number}</h3>
            <p>Статус: <strong>{statusTranslations[order.status] || order.status}</strong></p>
            <p>Дата создания: <strong>{new Date (order.created_at).toLocaleDateString('ru')}</strong></p>
            <p>Дата доставки: <strong>{new Date (order.delivery_date).toLocaleDateString('ru')}</strong></p>
            <p>Итого: <strong>{order.price_sum}₽</strong></p>
            {
            // <OrderItems orderitem_set = {order.orderitem_set}/>
            }
        </div>
    );
}

export default OrderCard;