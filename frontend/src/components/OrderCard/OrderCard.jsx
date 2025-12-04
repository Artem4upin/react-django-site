import React from 'react';
import './OrderCard.css';

function OrderCard({ order }) {
    return (
        <div className="order-card">
            <h3>Заказ №{order.order_number}</h3>
            <p>Статус: {order.status}</p>
            <p>Дата: {order.created_at}</p>
            <p>Итого: {order.price_sum}₽</p>
            
            <div className="order-items">
                <h4>Товары {order.orderitem_set?.length || 0}:</h4>
                {order.orderitem_set?.map(item => (
                    <div key={item.id} className="order-item">
                        <p>{item.product_name} {item.quantity} шт. {item.product_price}₽</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrderCard;