import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import "./OrderList.css"

function OrderList({ orders }) {
    return (
        <div className="order-list">
            <h1>Заказы</h1>
            {orders && (
                <h2 className='order-list__not-found'>Нет заказов</h2>
            )}
            <div className='order-list__orders-container'>        
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    );
}

export default OrderList;