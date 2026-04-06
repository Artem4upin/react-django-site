import React from "react"
import './OrderItems.scss'
import {useNavigate} from 'react-router-dom'
import {IOrderItemSet} from "../../../types/order";
import {goToProduct} from "../../../utils/functions";

interface IOrderItemProps {
    orderItems: IOrderItemSet[];

}

function OrderItems ({orderItems}:IOrderItemProps) {

    const navigate = useNavigate();

    const handleItemClick = (itemId: number) => {
        goToProduct(navigate, itemId)
    }

    return(

    <div className="order-items">
                <h4>Товары {orderItems?.length || 0}:</h4>
                {orderItems?.map(item => (
                    <div key={item.id} className="order-items__item" onClick={() => handleItemClick(item.product)}>
                        <p>{item.product_name} {item.quantity} шт. {item.product_price}₽</p>
                    </div>
                ))}
    </div>

    )
}

export default OrderItems