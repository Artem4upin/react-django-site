import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'

function ProductList({ products, isProducts, deleteFromCart}) {
    return (
        <div className="products-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} isProducts={isProducts} deleteFromCart={deleteFromCart} /> 
                ))}
        </div>
    );
}

export default ProductList