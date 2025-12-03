import React from "react"
import "./product-card.css"

// заказы по пользователю, компоненты (разделить кнопки, инпуты и тд), гит (создать репу с веткой main и dev)
//б-методология нейминг
// поменял диаграмму - вот что забыл
// продукт кард (исправить нейминг), перенести мэп в высший компонент 



function ProductCard({ product }) {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p className="price">{product.price} ₽</p>
            
            <div className="product-parameters">
                <h4>Характеристики</h4>
                <ul className="parameters-list">
                    {product.parameters?.map((param, index) => ( 
                        <li key={index} className="parameter-item">
                            <span className="parameter">{`${param.name}: ${param.value}`}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <p className="description">{product.description}</p>
            <button className="add-to-cart-btn">В корзину</button>
        </div>
    );
}

export default ProductCard