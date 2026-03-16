import React from "react"
import './OrderItems.css'

function OrderItems ({orderitem_set = {
    id: 0,
    product_name: "",
    quantity: 0,
    product_price: 0
}}) {
    return(

    <div className="order-items">
                <h4>Товары {orderitem_set?.length || 0}:</h4>
                {orderitem_set?.map(item => (
                    <div key={item.id} className="order-item">
                        <p>{item.product_name} {item.quantity} шт. {item.product_price}₽</p>
                    </div>
                ))}
    </div>

    )
}

export default OrderItems