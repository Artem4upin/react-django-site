import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css'
// isProducts переименовать
function ProductList({ products, deleteFromCart, isCart}) {
    return (
        <div className="products-list">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} isCart={isCart} deleteFromCart={deleteFromCart} /> 
                ))}
        </div>
    );
}

export default ProductList