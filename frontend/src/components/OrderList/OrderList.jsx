import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import "./OrderList.css"

function OrderList({ orders }) {
    return (
        <div className="order-list">
            <div className='order-list__orders-container'>        
                {orders.map(order => (
                    <OrderCard key={order.id} order={order} />
                ))}
            </div>
        </div>
    )
}

export default OrderList