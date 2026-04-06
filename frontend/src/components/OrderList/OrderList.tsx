import React from 'react';
import OrderCard from '../OrderCard/OrderCard';
import "./OrderList.scss"
import {IOrder, IOrderItemSet} from "../../types/order";

interface OrderListProps {
    orders: IOrder[];
    isArchive: boolean;
    onOrderClick: (order: IOrder) => void;
}

function OrderList({
        orders,
        isArchive = false,
        onOrderClick,
}: OrderListProps) {
    return (
        <div className="order-list">
            <div className='order-list__orders-container'>     
                {orders.map(order => (
                    isArchive ? (
                        order.is_deleted && <OrderCard key={order.id} order={order} onOrderClick={onOrderClick} />
                    ) : (
                        !order.is_deleted && <OrderCard key={order.id} order={order} onOrderClick={onOrderClick} />
                    )
                ))}
            </div>
        </div>
    )
}

export default OrderList