import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import "./OrderList.scss"
import {IOrder} from "../../types/order";

interface OrderListProps {
    orders: IOrder[];
    isArchive: boolean;
}

function OrderList({
        orders,
        isArchive = false
}: OrderListProps) {
    return (
        <div className="order-list">
            <div className='order-list__orders-container'>     
                {orders.map(order => (
                    isArchive ? (
                        order.is_deleted && <OrderCard key={order.id} order={order} />
                    ) : (
                        !order.is_deleted && <OrderCard key={order.id} order={order} />
                    )
                ))}
            </div>
        </div>
    )
}

export default OrderList