import React from 'react';
import './OrderCard.css';
import OrderItems from './OrderItems/OrderItems';

function OrderCard({ order }) {
    return (
        <div className="order-card">
            <h3>Заказ №{order.order_number}</h3>
            <p>Статус: {order.status}</p>
            <p>Дата создания: {new Date (order.created_at).toLocaleDateString('ru')}</p>
            <p>Дата доставки: {new Date (order.delivery_date).toLocaleDateString('ru')}</p>
            <p>Итого: {order.price_sum}₽</p>
            {
            // <OrderItems orderitem_set = {order.orderitem_set}/>
            }
        </div>
    );
}

export default OrderCard;