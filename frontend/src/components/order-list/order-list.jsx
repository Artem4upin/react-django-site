import React from 'react';
import OrderCard from '../order-card/order-card';
import "./order-list.css"

function OrderList({ orders }) {
    return (
        <div className="order-list">
            <h1>Заказы</h1>
            <div className='orders-container'>
                {orders.length === 0 ? (
                    <p>Нет заказов</p>
                ) : (
                    orders.map(order => (
                        <OrderCard key={order.id} order={order} />  // ← передаем ОДИН заказ
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderList;