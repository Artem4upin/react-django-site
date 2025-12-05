import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import "./OrderList.css"

function OrderList({ orders }) {
    return (
        <div className="order-list">
            <h1>Заказы</h1>
            <div className='orders-container'>
                {orders.length === 0 ? (
                    <p>Нет заказов</p>
                ) : (
                    orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </div>
    );
}

export default OrderList;