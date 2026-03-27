import React from "react"
import './OrderItems.scss'
import {IOrderItemSet} from "../../../types/order";

interface IOrderItemProps {
    order_items: IOrderItemSet[];
}

function OrderItems ({order_items}:IOrderItemProps) {
    return(

    <div className="order-items">
                <h4>Товары {order_items?.length || 0}:</h4>
                {order_items?.map(item => (
                    <div key={item.id} className="order-items__item">
                        <p>{item.product_name} {item.quantity} шт. {item.product_price}₽</p>
                    </div>
                ))}
    </div>

    )
}

export default OrderItems