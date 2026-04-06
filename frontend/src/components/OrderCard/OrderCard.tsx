import React from 'react';
import './OrderCard.scss';
import {IOrder} from "../../types/order";

interface IOrderCardProps {
    order: IOrder;
    onOrderClick: (order: IOrder) => void;
}

function OrderCard({
    order,
    onOrderClick,
}:IOrderCardProps) {

    const statusTranslations = {
        'Created': 'Создан',
        'Work': 'В работе', 
        'Sent': 'Отправлен',
        'Done': 'Готов к выдаче',
        'Completed': 'Завершен',
        'Canceled': 'Отменен'
    }
    return (
        <div className="order-card" onClick={() => onOrderClick(order)}>
            <h3>Заказ №{order.order_number}</h3>
            <p>Статус: <strong>{statusTranslations[order.status] || order.status}</strong></p>
            <p>Дата создания: <strong>{new Date (order.created_at).toLocaleDateString('ru')}</strong></p>
            <p>Дата доставки: <strong>{new Date (order.delivery_date).toLocaleDateString('ru')}</strong></p>
            <p>Итого: <strong>{order.price_sum}₽</strong></p>
            {
            // <OrderItems order_items = {order.order_items}/>
            }
        </div>
    );
}

export default OrderCard;