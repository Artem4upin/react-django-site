import React from "react"
import "./product-card.css"
import Button from "../UI/button/button";

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
            <Button className = 'btn' text = 'В корзину'></Button>
        </div>
    );
}

export default ProductCard