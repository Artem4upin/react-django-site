import React from "react"

// заказы по пользователю, компоненты (разделить кнопки, инпуты и тд), гит (создать репу с веткой main и dev)
//б-методология нейминг
// поменял диаграмму - вот что забыл
// Это не продукт кард а продукт лист (исправить нейминг), перенести мэп в высший компонент 
function ProductCard ({products}) {

    return(
        <div className="ProductCard">
            <div className="products">
            {products.map(product => (
                <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p className="price">{product.price} ₽</p>

                <div className="product-parameters">
                    <h4>Характеристики</h4>
                    <ul className="parameters-list">
                        {product.parameters.map((param, index) => ( 
                        <li key={index} className="parameter-item">
                            <span className="parameter">{`${param.name}:  ${param.value}`}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                <p>{product.description}</p>
                </div>
            ))}
            </div>
        </div>
    )
}

export default ProductCard